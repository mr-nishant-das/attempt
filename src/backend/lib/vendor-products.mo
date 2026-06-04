import List "mo:core/List";
import VendorProductTypes "../types/vendor-products";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import VendorTypes "../types/vendors";

module {
  public type VendorProduct = VendorProductTypes.VendorProduct;
  public type VendorProductView = VendorProductTypes.VendorProductView;
  public type VendorProductInput = VendorProductTypes.VendorProductInput;

  /// Convert internal VendorProduct to immutable public view.
  public func toView(vp : VendorProduct) : VendorProductView {
    {
      id = vp.id;
      vendorId = vp.vendorId;
      vendorEmail = vp.vendorEmail;
      productName = vp.productName;
      vendorName = vp.vendorName;
      description = vp.description;
      imageUrls = vp.imageUrls;
      category = vp.category;
      basePrice = vp.basePrice;
      fssaiDocumentUrl = vp.fssaiDocumentUrl;
      vendorType = vp.vendorType;
      mrp = vp.mrp;
      supplyPrice = vp.supplyPrice;
      moq = vp.moq;
      pricePerKg = vp.pricePerKg;
      availableQuantityKg = vp.availableQuantityKg;
      packagingCost = vp.packagingCost;
      taxPercent = vp.taxPercent;
      finalPrice = vp.finalPrice;
      status = vp.status;
      rejectionReason = vp.rejectionReason;
      submittedAt = vp.submittedAt;
      reviewedAt = vp.reviewedAt;
    };
  };

  /// Add a new pending vendor product. Returns the created product.
  public func add(
    products : List.List<VendorProduct>,
    state : { var nextId : Nat },
    vendorId : Principal,
    vendorEmail : Text,
    input : VendorProductInput,
  ) : VendorProduct {
    let vp : VendorProduct = {
      id = state.nextId;
      vendorId;
      vendorEmail;
      productName = input.productName;
      vendorName = input.vendorName;
      description = input.description;
      imageUrls = input.imageUrls;
      category = input.category;
      basePrice = input.basePrice;
      fssaiDocumentUrl = input.fssaiDocumentUrl;
      vendorType = input.vendorType;
      mrp = input.mrp;
      supplyPrice = input.supplyPrice;
      moq = input.moq;
      pricePerKg = input.pricePerKg;
      var availableQuantityKg = input.availableQuantityKg;
      var packagingCost = null;
      var taxPercent = null;
      var finalPrice = null;
      var status = #pending;
      var rejectionReason = null;
      submittedAt = Time.now();
      var reviewedAt = null;
    };
    state.nextId += 1;
    products.add(vp);
    vp;
  };

  /// Find a vendor product by id.
  public func findById(
    products : List.List<VendorProduct>,
    id : Nat,
  ) : ?VendorProduct {
    products.find(func(vp) { vp.id == id });
  };

  /// List all products submitted by a specific vendor.
  public func listByVendor(
    products : List.List<VendorProduct>,
    vendorId : Principal,
  ) : [VendorProductView] {
    products
      .filter(func(vp) { Principal.equal(vp.vendorId, vendorId) })
      .map<VendorProduct, VendorProductView>(toView)
      .toArray();
  };

  /// List all products with a given status.
  public func listByStatus(
    products : List.List<VendorProduct>,
    status : { #pending; #approved; #rejected },
  ) : [VendorProductView] {
    products
      .filter(func(vp) {
        switch (vp.status, status) {
          case (#pending, #pending) true;
          case (#approved, #approved) true;
          case (#rejected, #rejected) true;
          case _ false;
        };
      })
      .map<VendorProduct, VendorProductView>(toView)
      .toArray();
  };

  /// List all vendor products.
  public func listAll(
    products : List.List<VendorProduct>,
  ) : [VendorProductView] {
    products.map<VendorProduct, VendorProductView>(toView).toArray();
  };

  /// List all vendor products grouped by a specific vendor.
  public func listAllByVendorId(
    products : List.List<VendorProduct>,
    vendorId : Principal,
  ) : [VendorProductView] {
    listByVendor(products, vendorId);
  };

  /// Approve a vendor product: set taxPercent, compute finalPrice, update status.
  /// finalPrice calculation:
  ///   - Brand vendor:       supplyPrice + (supplyPrice * tax / 100)  [falls back to basePrice]
  ///   - Raw-material vendor: (pricePerKg + packagingCost) + tax%    [falls back to basePrice]
  public func approve(
    products : List.List<VendorProduct>,
    id : Nat,
    taxPercent : Nat,
    nowNs : Int,
  ) : ?VendorProduct {
    switch (findById(products, id)) {
      case null null;
      case (?vp) {
        let base : Nat = switch (vp.vendorType) {
          case (#brand) {
            switch (vp.supplyPrice) {
              case (?sp) sp;
              case null vp.basePrice;
            };
          };
          case (#rawMaterial) {
            let pkgCost : Nat = switch (vp.packagingCost) {
              case (?pc) pc;
              case null 0;
            };
            switch (vp.pricePerKg) {
              case (?ppkg) ppkg + pkgCost;
              case null vp.basePrice + pkgCost;
            };
          };
        };
        let fp = base + (base * taxPercent / 100);
        vp.taxPercent := ?taxPercent;
        vp.finalPrice := ?fp;
        vp.status := #approved;
        vp.reviewedAt := ?nowNs;
        ?vp;
      };
    };
  };

  /// Reject a vendor product with a reason.
  public func reject(
    products : List.List<VendorProduct>,
    id : Nat,
    reason : Text,
    nowNs : Int,
  ) : ?VendorProduct {
    switch (findById(products, id)) {
      case null null;
      case (?vp) {
        vp.status := #rejected;
        vp.rejectionReason := ?reason;
        vp.reviewedAt := ?nowNs;
        ?vp;
      };
    };
  };
};
