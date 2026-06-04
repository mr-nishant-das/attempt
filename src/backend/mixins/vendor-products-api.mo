import List "mo:core/List";
import VendorProductLib "../lib/vendor-products";
import VendorProductTypes "../types/vendor-products";
import VendorTypes "../types/vendors";
import ProductLib "../lib/products-catalog";
import ProductTypes "../types/products-catalog";
import EmailClient "mo:caffeineai-email/emailClient";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Map "mo:core/Map";

mixin (
  vendorProducts : List.List<VendorProductTypes.VendorProduct>,
  vendorProductState : { var nextId : Nat },
  vendors : List.List<VendorTypes.Vendor>,
  products : List.List<ProductLib.Product>,
  catalogVendorProductIdState : { var nextId : Nat },
  adminSessionState : { var token : ?Text; var expiry : Int },
  vendorSessionStore : Map.Map<Text, { email : Text; expiresAt : Int }>,
) {

  let ADMIN_NOTIFY_EMAIL_VP : Text = "assamshop@assamroots.shop";

  func _adminAuthVP(token : Text) : Bool {
    switch (adminSessionState.token) {
      case (?t) Text.equal(t, token) and Time.now() < adminSessionState.expiry;
      case null false;
    };
  };

  /// Validate a vendor session token via the vendor session store.
  /// Performs an O(1) exact lookup keyed by token, then finds the vendor by email.
  func _findVendorBySession(sessionToken : Text) : ?VendorTypes.Vendor {
    let now = Time.now();
    switch (vendorSessionStore.get(sessionToken)) {
      case null null;
      case (?entry) {
        if (now > entry.expiresAt) return null;
        switch (vendors.find(func(v : VendorTypes.Vendor) : Bool { v.contactEmail == entry.email })) {
          case null null;
          case (?v) {
            if (v.status == #approved) ?v else null;
          };
        };
      };
    };
  };

  /// Format a paise amount as an INR string, e.g. 150000 -> "₹1,500.00".
  func _formatINR(paise : Nat) : Text {
    let rupees = paise / 100;
    let paiseRem = paise % 100;
    let paiseStr = if (paiseRem < 10) { "0" # paiseRem.toText() } else { paiseRem.toText() };
    "\u{20B9}" # rupees.toText() # "." # paiseStr;
  };

  // ──────────────────────────────────────────────
  // Vendor self-service endpoints
  // ──────────────────────────────────────────────

  /// Submit a new product for admin review.
  public shared func vendorSubmitProduct(
    sessionToken : Text,
    input : VendorProductTypes.VendorProductInput,
  ) : async { #ok : VendorProductTypes.VendorProductView; #err : Text } {
    switch (_findVendorBySession(sessionToken)) {
      case null { #err "Unauthorized: invalid or expired vendor session." };
      case (?v) {
        let vp = VendorProductLib.add(
          vendorProducts,
          vendorProductState,
          v.id,
          v.contactEmail,
          input,
        );
        let vendorTypeLabel : Text = switch (input.vendorType) {
          case (#brand) "Brand Vendor";
          case (#rawMaterial) "Raw Material Vendor";
        };
        let typeSpecificHtml : Text = switch (input.vendorType) {
          case (#brand) {
            (switch (input.mrp) {
              case null "";
              case (?m) "<p><strong>MRP:</strong> " # _formatINR(m) # "</p>";
            }) #
            (switch (input.supplyPrice) {
              case null "";
              case (?sp) "<p><strong>Supply Price to AssamRoots:</strong> " # _formatINR(sp) # "</p>";
            }) #
            (switch (input.moq) {
              case null "";
              case (?q) "<p><strong>Min Order Qty:</strong> " # q.toText() # " units</p>";
            });
          };
          case (#rawMaterial) {
            (switch (input.pricePerKg) {
              case null "";
              case (?ppkg) "<p><strong>Price per kg:</strong> " # _formatINR(ppkg) # "</p>";
            }) #
            (switch (input.availableQuantityKg) {
              case null "";
              case (?qty) "<p><strong>Available Quantity:</strong> " # qty.toText() # " kg</p>";
            });
          };
        };
        let htmlBody : Text = "<html><body style='font-family:Arial,sans-serif'>" #
          "<h2>New Vendor Product Submission - AssamRoots</h2>" #
          "<p><strong>Product Name:</strong> " # input.productName # "</p>" #
          "<p><strong>Vendor Name:</strong> " # input.vendorName # "</p>" #
          "<p><strong>Vendor Type:</strong> " # vendorTypeLabel # "</p>" #
          "<p><strong>Category:</strong> " # input.category # "</p>" #
          "<p><strong>Base Price:</strong> " # _formatINR(input.basePrice) # "</p>" #
          typeSpecificHtml #
          "<p><strong>Description:</strong> " # input.description # "</p>" #
          (switch (input.fssaiDocumentUrl) {
            case null "";
            case (?url) "<p><strong>FSSAI Document:</strong> <a href='" # url # "'>View Document</a></p>";
          }) #
          "<hr/>" #
          "<p>Review this product in the <a href='https://assamroots.org/admin'>AssamRoots Admin Panel</a>.</p>" #
          "</body></html>";
        ignore EmailClient.sendServiceEmail(
          "vendor-products",
          [ADMIN_NOTIFY_EMAIL_VP],
          "New product submission: " # input.productName # " by " # input.vendorName,
          htmlBody,
        );
        #ok (VendorProductLib.toView(vp));
      };
    };
  };

  /// Get all products submitted by the authenticated vendor.
  public shared func vendorGetMyProducts(
    sessionToken : Text,
  ) : async { #ok : [VendorProductTypes.VendorProductView]; #err : Text } {
    switch (_findVendorBySession(sessionToken)) {
      case null { #err "Unauthorized: invalid or expired vendor session." };
      case (?v) {
        #ok (VendorProductLib.listByVendor(vendorProducts, v.id));
      };
    };
  };

  // ──────────────────────────────────────────────
  // Admin vendor product management endpoints
  // ──────────────────────────────────────────────

  /// List all vendor product submissions (admin only).
  public query func adminListVendorProducts(
    adminToken : Text,
  ) : async [VendorProductTypes.VendorProductView] {
    if (not _adminAuthVP(adminToken)) return [];
    VendorProductLib.listAll(vendorProducts);
  };

  /// List all product submissions by a specific vendor (admin only).
  public query func adminListVendorProductsByVendor(
    adminToken : Text,
    vendorId : Principal,
  ) : async [VendorProductTypes.VendorProductView] {
    if (not _adminAuthVP(adminToken)) return [];
    VendorProductLib.listAllByVendorId(vendorProducts, vendorId);
  };

  /// Approve a vendor product: set tax, compute final price, publish to product catalog.
  public shared func adminApproveVendorProduct(
    adminToken : Text,
    productId : Nat,
    taxPercent : Nat,
    packagingCost : ?Nat,
  ) : async { #ok : VendorProductTypes.VendorProductView; #err : Text } {
    if (not _adminAuthVP(adminToken)) return #err "Unauthorized";
    let now = Time.now();
    // For raw-material vendors, store packagingCost before calling approve
    // so the lib finalPrice calculation can use it.
    switch (packagingCost) {
      case null {};
      case (?pc) {
        switch (VendorProductLib.findById(vendorProducts, productId)) {
          case null {};
          case (?vp) { vp.packagingCost := ?pc };
        };
      };
    };
    switch (VendorProductLib.approve(vendorProducts, productId, taxPercent, now)) {
      case null { #err "Vendor product not found." };
      case (?vp) {
        let fp = switch (vp.finalPrice) { case (?p) p; case null vp.basePrice };
        let catId : ProductTypes.CategoryId = 1;
        let input : ProductLib.ProductInput = {
          title = vp.productName;
          description = vp.description;
          price = fp;
          discountPercent = 0;
          imageUrls = vp.imageUrls;
          category = catId;
          subCategory = vp.category;
          rating = 0;
          reviewCount = 0;
          stock = 100;
          brand = vp.vendorName;
          tags = [];
        };
        let catalogId = catalogVendorProductIdState.nextId;
        catalogVendorProductIdState.nextId += 1;
        ignore ProductLib.addProduct(products, catalogId, input);
        let breakdownHtml : Text = switch (vp.vendorType) {
          case (#brand) {
            let base = switch (vp.supplyPrice) { case (?sp) sp; case null vp.basePrice };
            "<p><strong>Pricing Breakdown (Brand Vendor):</strong></p>" #
            "<ul>" #
            "<li>Supply Price to AssamRoots: " # _formatINR(base) # "</li>" #
            "<li>Tax Applied: " # taxPercent.toText() # "%</li>" #
            "<li><strong>Final Selling Price: " # _formatINR(fp) # "</strong></li>" #
            "</ul>";
          };
          case (#rawMaterial) {
            let ppkg = switch (vp.pricePerKg) { case (?p) p; case null 0 };
            let pc2 = switch (vp.packagingCost) { case (?p) p; case null 0 };
            let base = ppkg + pc2;
            "<p><strong>Pricing Breakdown (Raw Material Vendor):</strong></p>" #
            "<ul>" #
            "<li>Price per kg (your rate): " # _formatINR(ppkg) # "</li>" #
            "<li>Packaging Cost (AssamRoots): " # _formatINR(pc2) # "</li>" #
            "<li>Combined Base: " # _formatINR(base) # "</li>" #
            "<li>Tax Applied: " # taxPercent.toText() # "%</li>" #
            "<li><strong>Final Selling Price: " # _formatINR(fp) # "</strong></li>" #
            "</ul>";
          };
        };
        let htmlBody : Text = "<html><body style='font-family:Arial,sans-serif'>" #
          "<h2 style='color:#2e7d32'>Your Product is Now Live on AssamRoots!</h2>" #
          "<p>Congratulations! Your product <strong>" # vp.productName # "</strong> has been approved and is now available for customers.</p>" #
          breakdownHtml #
          "<p>Thank you for partnering with AssamRoots. Customers can discover your product on our platform.</p>" #
          "</body></html>";
        ignore EmailClient.sendServiceEmail(
          "vendor-products",
          [vp.vendorEmail],
          "Your product '" # vp.productName # "' is now live on AssamRoots!",
          htmlBody,
        );
        #ok (VendorProductLib.toView(vp));
      };
    };
  };

  /// Reject a vendor product with a reason and notify the vendor.
  public shared func adminRejectVendorProduct(
    adminToken : Text,
    productId : Nat,
    reason : Text,
  ) : async { #ok : VendorProductTypes.VendorProductView; #err : Text } {
    if (not _adminAuthVP(adminToken)) return #err "Unauthorized";
    let now = Time.now();
    switch (VendorProductLib.reject(vendorProducts, productId, reason, now)) {
      case null { #err "Vendor product not found." };
      case (?vp) {
        let htmlBody : Text = "<html><body style='font-family:Arial,sans-serif'>" #
          "<h2 style='color:#c62828'>Product Submission Update — AssamRoots</h2>" #
          "<p>Unfortunately, your product <strong>" # vp.productName # "</strong> was not approved at this time.</p>" #
          "<p><strong>Reason:</strong> " # reason # "</p>" #
          "<p>You may revise and resubmit your product. For questions, contact us at " # ADMIN_NOTIFY_EMAIL_VP # ".</p>" #
          "</body></html>";
        ignore EmailClient.sendServiceEmail(
          "vendor-products",
          [vp.vendorEmail],
          "Update on your product submission: " # vp.productName,
          htmlBody,
        );
        #ok (VendorProductLib.toView(vp));
      };
    };
  };
  /// Admin: update available stock (kg) for a raw-material vendor product.
  public shared func adminUpdateVendorProductQuantity(
    adminToken : Text,
    productId : Nat,
    newQuantityKg : Nat,
  ) : async { #ok; #err : Text } {
    if (not _adminAuthVP(adminToken)) return #err "Unauthorized";
    switch (VendorProductLib.findById(vendorProducts, productId)) {
      case null { #err "Vendor product not found." };
      case (?vp) {
        vp.availableQuantityKg := ?newQuantityKg;
        #ok;
      };
    };
  };

  /// Vendor: update available stock (kg) for their own raw-material product.
  public shared func vendorUpdateProductQuantity(
    sessionToken : Text,
    productId : Nat,
    newQuantityKg : Nat,
  ) : async { #ok; #err : Text } {
    switch (_findVendorBySession(sessionToken)) {
      case null { #err "Unauthorized: invalid or expired vendor session." };
      case (?v) {
        switch (VendorProductLib.findById(vendorProducts, productId)) {
          case null { #err "Vendor product not found." };
          case (?vp) {
            if (not Principal.equal(vp.vendorId, v.id)) {
              return #err "You do not own this product.";
            };
            vp.availableQuantityKg := ?newQuantityKg;
            #ok;
          };
        };
      };
    };
  };
};
