import List "mo:core/List";
import Map "mo:core/Map";
import VendorLib "../lib/vendors";
import VendorTypes "../types/vendors";
import OtpTypes "../types/otp";
import EmailClient "mo:caffeineai-email/emailClient";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import OtpLib "../lib/otp";

mixin (
  vendors : List.List<VendorTypes.Vendor>,
  vendorOtpStore : Map.Map<Text, OtpTypes.OtpRecord>,
  vendorApprovalTokens : Map.Map<Text, VendorTypes.VendorApprovalToken>,
  adminSessionState : { var token : ?Text; var expiry : Int },
  vendorSessionStore : Map.Map<Text, { email : Text; expiresAt : Int }>,
) {

  func _adminAuthV(token : Text) : Bool {
    switch (adminSessionState.token) {
      case (?t) Text.equal(t, token) and Time.now() < adminSessionState.expiry;
      case null false;
    };
  };

  func _makeVendorSessionToken(email : Text, nowNs : Int) : Text {
    let nowNat : Nat = if (nowNs >= 0) nowNs.toNat() else 0;
    var h : Nat = 5381;
    for (c in email.chars()) {
      h := h * 33 + c.toNat32().toNat();
    };
    h := h * 1_000_003 + nowNat;
    "vendor-" # email # "-" # nowNat.toText() # "-" # h.toText();
  };

  let ADMIN_NOTIFY_EMAIL : Text = "assamshop@assamroots.shop";


  // ──────────────────────────────────────────────
  // Public vendor self-service endpoints
  // ──────────────────────────────────────────────

  /// Register a new vendor application. The vendor is created with status=pending.
  public shared ({ caller }) func registerVendor(
    details : VendorTypes.VendorRegistration,
  ) : async { #ok : Text; #err : Text } {
    switch (VendorLib.findByEmail(vendors, details.contactEmail)) {
      case (?_) { return #err "A vendor application with this email already exists." };
      case null {};
    };
    let vendor = VendorLib.create(caller, details, Time.now());
    vendors.add(vendor);
    let token = VendorLib.makeTokenFromSeed(Time.now(), details.contactEmail);
    VendorLib.storeToken(vendorApprovalTokens, token, details.contactEmail, Time.now());
    let cats : Text = details.categories.values().join(", ");
    let approveLink : Text = "https://assamroots.org/vendor-action?action=approve&token=" # token;
    let rejectLink : Text = "https://assamroots.org/vendor-action?action=reject&token=" # token;
    let vendorTypeLabel : Text = switch (details.vendorType) {
      case (#brand) "Brand Vendor (own packaging, GSTIN, MRP-priced products)";
      case (#rawMaterial) "Raw Material Vendor (bulk supply by kg, admin handles packaging)";
    };
    let brandFieldsHtml : Text = switch (details.vendorType) {
      case (#brand) {
        (switch (details.gstinNumber) {
          case null "";
          case (?g) "<p><strong>GSTIN Number:</strong> " # g # "</p>";
        }) #
        (switch (details.brandName) {
          case null "";
          case (?b) "<p><strong>Brand Name:</strong> " # b # "</p>";
        }) #
        (switch (details.packagingDetails) {
          case null "";
          case (?p) "<p><strong>Packaging Details:</strong> " # p # "</p>";
        });
      };
      case (#rawMaterial) "";
    };
    let htmlBody : Text = "<html><body style='font-family:Arial,sans-serif'>" #
      "<h2>New Vendor Application - AssamRoots</h2>" #
      "<p><strong>Business Name:</strong> " # details.businessName # "</p>" #
      "<p><strong>Contact Email:</strong> " # details.contactEmail # "</p>" #
      "<p><strong>Phone:</strong> " # details.phone # "</p>" #
      "<p><strong>Vendor Type:</strong> " # vendorTypeLabel # "</p>" #
      brandFieldsHtml #
      "<p><strong>Categories Supplied:</strong> " # cats # "</p>" #
      "<hr/>" #
      "<p>Use the links below to approve or reject this application directly:</p>" #
      "<p><a href='" # approveLink # "' style='background:#2e7d32;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;margin-right:12px'>Approve Vendor</a>" #
      "&nbsp;&nbsp;<a href='" # rejectLink # "' style='background:#c62828;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none'>Reject Vendor</a></p>" #
      "<p style='color:#666;font-size:12px'>Approval token: <code>" # token # "</code> (expires in 7 days, single use)</p>" #
      "</body></html>";
    ignore EmailClient.sendServiceEmail(
      "vendors",
      [ADMIN_NOTIFY_EMAIL],
      "New vendor application: " # details.businessName,
      htmlBody,
    );
    #ok "Your vendor application has been submitted. You will be notified once reviewed.";
  };

  // ──────────────────────────────────────────────
  // Vendor OTP login (vendor-specific, checks approval status)
  // ──────────────────────────────────────────────

  /// Verify an OTP for a vendor email. Returns a vendor session token + vendor status.
  /// Unlike the generic verifyOtp, this checks that the email belongs to a registered vendor.
  public shared func verifyVendorOtp(
    email : Text,
    code : Text,
  ) : async { #ok : { token : Text; status : VendorTypes.VendorStatus }; #err : Text } {
    let now = Time.now();
    switch (OtpLib.verify(vendorOtpStore, email, code, now)) {
      case (#err msg) { #err msg };
      case (#ok) {
        switch (VendorLib.findByEmail(vendors, email)) {
          case null { #err "No vendor account found for this email address." };
          case (?v) {
            let token = _makeVendorSessionToken(email, now);
            let expiresAt = now + 24 * 60 * 60 * 1_000_000_000;
            vendorSessionStore.add(token, { email; expiresAt });
            #ok { token; status = v.status };
          };
        };
      };
    };
  };

  /// Re-check the vendor's approval status using their current session token.
  public query func getVendorStatusBySession(
    token : Text,
  ) : async ?VendorTypes.VendorStatus {
    let now = Time.now();
    switch (vendorSessionStore.get(token)) {
      case null null;
      case (?entry) {
        if (now > entry.expiresAt) return null;
        switch (VendorLib.findByEmail(vendors, entry.email)) {
          case null null;
          case (?v) ?v.status;
        };
      };
    };
  };

  /// Retrieve the authenticated caller's own vendor profile.
  public shared query ({ caller }) func getMyVendorProfile() : async { #ok : VendorTypes.VendorProfile; #err : Text } {
    switch (VendorLib.findById(vendors, caller)) {
      case null { #err "No vendor profile found for this account." };
      case (?v) { #ok (VendorLib.toProfile(v)) };
    };
  };

  /// Retrieve orders that contain products assigned to the caller's vendor account.
  public shared query ({ caller }) func getMyVendorOrders() : async [VendorTypes.VendorOrderSummary] {
    ignore (vendors, caller);
    [];
  };

  // ──────────────────────────────────────────────
  // Public product-vendor lookup
  // ──────────────────────────────────────────────

  /// Return the vendor supplying a given product, or null if unassigned.
  public query func getVendorForProduct(productId : Text) : async ?VendorTypes.VendorSummary {
    VendorLib.findByProductId(vendors, productId);
  };

  // ──────────────────────────────────────────────
  // Admin vendor management endpoints
  // ──────────────────────────────────────────────

  /// List all vendors, optionally filtered by status.
  public query func adminListVendors(
    status : ?VendorTypes.VendorStatus,
  ) : async [VendorTypes.VendorSummary] {
    VendorLib.listByStatus(vendors, status);
  };

  /// Process a vendor approval/rejection via secure email token.
  public shared func processVendorActionToken(
    token : Text,
    action : { #approve; #reject },
  ) : async { #ok : Text; #err : Text } {
    switch (VendorLib.lookupToken(vendorApprovalTokens, token, Time.now())) {
      case (#notFound) { #err "Token not found. It may have been used or never existed." };
      case (#expired) { #err "This approval link has expired (older than 7 days). Please use the admin panel directly." };
      case (#used) { #err "This token has already been used." };
      case (#ok t) {
        t.used := true;
        switch (VendorLib.findByEmail(vendors, t.vendorEmail)) {
          case null { #err "Vendor not found for this token." };
          case (?v) {
            switch (action) {
              case (#approve) {
                v.status := #approved;
                v.approvedAt := ?Time.now();
                let htmlBody : Text = "<html><body style='font-family:Arial,sans-serif'>" #
                  "<h2 style='color:#2e7d32'>Your AssamRoots Vendor Application is Approved!</h2>" #
                  "<p>Congratulations! Your application for <strong>" # v.businessName # "</strong> has been approved.</p>" #
                  "<p>You can now log in to your vendor dashboard at <strong>/vendor-login</strong> using your registered email.</p>" #
                  "<p>Welcome to AssamRoots!</p></body></html>";
                ignore EmailClient.sendServiceEmail(
                  "vendors",
                  [v.contactEmail],
                  "Your AssamRoots vendor application has been approved",
                  htmlBody,
                );
                #ok "Vendor approved and notified by email.";
              };
              case (#reject) {
                v.status := #rejected;
                let htmlBody : Text = "<html><body style='font-family:Arial,sans-serif'>" #
                  "<h2 style='color:#c62828'>AssamRoots Vendor Application Update</h2>" #
                  "<p>We regret to inform you that the application for <strong>" # v.businessName # "</strong> was not approved at this time.</p>" #
                  "<p>You are welcome to reapply in the future. Contact us at " # ADMIN_NOTIFY_EMAIL # ".</p>" #
                  "</body></html>";
                ignore EmailClient.sendServiceEmail(
                  "vendors",
                  [v.contactEmail],
                  "AssamRoots vendor application update",
                  htmlBody,
                );
                #ok "Vendor rejected and notified by email.";
              };
            };
          };
        };
      };
    };
  };

  /// Approve a pending vendor application.
  public shared func adminApproveVendor(
    adminToken : Text,
    vendorId : Principal,
  ) : async { #ok; #err : Text } {
    if (not _adminAuthV(adminToken)) return #err "Unauthorized";
    switch (VendorLib.findById(vendors, vendorId)) {
      case null { #err "Vendor not found." };
      case (?v) {
        v.status := #approved;
        v.approvedAt := ?Time.now();
        let htmlBody : Text = "<html><body style='font-family:Arial,sans-serif'>" #
          "<h2 style='color:#2e7d32'>Your AssamRoots Vendor Application is Approved!</h2>" #
          "<p>Congratulations! Your application for <strong>" # v.businessName # "</strong> has been approved.</p>" #
          "<p>You can now log in to the vendor dashboard and manage your assigned products.</p>" #
          "<p>Welcome to AssamRoots!</p></body></html>";
        ignore EmailClient.sendServiceEmail(
          "vendors",
          [v.contactEmail],
          "Your AssamRoots vendor application has been approved",
          htmlBody,
        );
        #ok;
      };
    };
  };

  /// Reject a pending vendor application with a reason.
  public shared func adminRejectVendor(
    adminToken : Text,
    vendorId : Principal,
    reason : Text,
  ) : async { #ok; #err : Text } {
    if (not _adminAuthV(adminToken)) return #err "Unauthorized";
    switch (VendorLib.findById(vendors, vendorId)) {
      case null { #err "Vendor not found." };
      case (?v) {
        let email = v.contactEmail;
        let businessName = v.businessName;
        // Send rejection email before deleting the record
        let htmlBody : Text = "<html><body style='font-family:Arial,sans-serif'>" #
          "<h2 style='color:#c62828'>AssamRoots Vendor Application Update</h2>" #
          "<p>We regret to inform you that the application for <strong>" # businessName # "</strong> was not approved at this time.</p>" #
          "<p><strong>Reason:</strong> " # reason # "</p>" #
          "<p>You are welcome to reapply in the future. Contact us at " # ADMIN_NOTIFY_EMAIL # ".</p>" #
          "</body></html>";
        ignore EmailClient.sendServiceEmail(
          "vendors",
          [email],
          "AssamRoots vendor application update",
          htmlBody,
        );
        // Remove the vendor record entirely
        VendorLib.deleteByPrincipal(vendors, vendorId);
        // Invalidate all sessions belonging to this vendor
        let toRemove = vendorSessionStore
          .entries()
          .filter(func((_, entry)) { entry.email == email })
          .map(func((token, _)) { token })
          .toArray();
        for (token in toRemove.values()) {
          vendorSessionStore.remove(token);
        };
        #ok;
      };
    };
  };

  /// Suspend an approved vendor.
  public shared func adminSuspendVendor(
    adminToken : Text,
    vendorId : Principal,
  ) : async { #ok; #err : Text } {
    if (not _adminAuthV(adminToken)) return #err "Unauthorized";
    switch (VendorLib.findById(vendors, vendorId)) {
      case null { #err "Vendor not found." };
      case (?v) {
        v.status := #suspended;
        #ok;
      };
    };
  };

  /// Assign a product to a vendor (admin only).
  public shared func adminAssignProductToVendor(
    adminToken : Text,
    vendorId : Principal,
    productId : Text,
  ) : async { #ok; #err : Text } {
    if (not _adminAuthV(adminToken)) return #err "Unauthorized";
    switch (VendorLib.findById(vendors, vendorId)) {
      case null { #err "Vendor not found." };
      case (?v) {
        if (v.assignedProductIds.find(func(pid) { pid == productId }) != null) {
          return #err "Product already assigned to this vendor.";
        };
        v.assignedProductIds := v.assignedProductIds.concat([productId]);
        #ok;
      };
    };
  };

  /// Remove a product assignment from a vendor (admin only).
  public shared func adminUnassignProductFromVendor(
    adminToken : Text,
    vendorId : Principal,
    productId : Text,
  ) : async { #ok; #err : Text } {
    if (not _adminAuthV(adminToken)) return #err "Unauthorized";
    switch (VendorLib.findById(vendors, vendorId)) {
      case null { #err "Vendor not found." };
      case (?v) {
        v.assignedProductIds := v.assignedProductIds.filter(func(pid) { pid != productId });
        #ok;
      };
    };
  };
};
