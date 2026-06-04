import List "mo:core/List";
import Map "mo:core/Map";
import VendorTypes "../types/vendors";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Nat8 "mo:core/Nat8";

module {
  public type VendorApprovalToken = VendorTypes.VendorApprovalToken;

  public type Vendor = VendorTypes.Vendor;
  public type VendorStatus = VendorTypes.VendorStatus;
  public type VendorSummary = VendorTypes.VendorSummary;
  public type VendorProfile = VendorTypes.VendorProfile;
  public type VendorRegistration = VendorTypes.VendorRegistration;
  public type VendorOrderSummary = VendorTypes.VendorOrderSummary;
  /// Generate a pseudo-random token from a blob of entropy bytes.
  /// Produces a 40-char lowercase hex string.
  /// Generate a pseudo-random token from a blob of entropy bytes.
  /// Produces a 40-char lowercase hex string.
  public func makeToken(entropy : Blob) : Text {
    let bytes = entropy.toArray();
    let hexChars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    var hex = "";
    for (b in bytes.vals()) {
      let hi = Nat8.toNat(b / 16);
      let lo = Nat8.toNat(b % 16);
      hex := hex # hexChars[hi] # hexChars[lo];
      if (hex.size() >= 40) return hex;
    };
    hex;
  };

  /// Generate a deterministic token from a timestamp (Int) and an email string.
  /// Produces a 40-char hex string by hashing the combined seed text.
  public func makeTokenFromSeed(nowNs : Int, email : Text) : Text {
    let hexChars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    // Combine timestamp and email into a single seed string, then encode bytes
    let seed : Text = debug_show(nowNs) # email;
    let bytes = seed.encodeUtf8();
    // Simple positional mixing: XOR each byte position with a rotating prime
    let arr = bytes.toArray();
    var hex = "";
    var i = 0;
    let len = arr.size();
    while (hex.size() < 40) {
      let idx = i % len;
      let raw = arr[idx];
      // Mix with position to increase variation
      let mixed : Nat8 = raw ^ Nat8.fromNat(((i * 31 + 7) % 256));
      let hi = Nat8.toNat(mixed / 16);
      let lo = Nat8.toNat(mixed % 16);
      hex := hex # hexChars[hi] # hexChars[lo];
      i += 1;
    };
    // Trim to exactly 40 chars
    Text.fromIter(hex.chars().take(40));
  };

  /// Store a new approval token for a vendor email.
  public func storeToken(
    tokens : Map.Map<Text, VendorApprovalToken>,
    token : Text,
    email : Text,
    nowNs : Int,
  ) {
    tokens.add(token, { token; vendorEmail = email; createdAt = nowNs; var used = false });
  };

  /// Look up a valid (unused, not expired) approval token.
  /// 7 days in nanoseconds = 7 * 24 * 3600 * 1_000_000_000
  public func lookupToken(
    tokens : Map.Map<Text, VendorApprovalToken>,
    token : Text,
    nowNs : Int,
  ) : { #ok : VendorApprovalToken; #expired; #used; #notFound } {
    let sevenDaysNs : Int = 604_800_000_000_000;
    switch (tokens.get(token)) {
      case null #notFound;
      case (?t) {
        if (t.used) return #used;
        if (nowNs - t.createdAt > sevenDaysNs) return #expired;
        #ok t;
      };
    };
  };

  /// Convert an internal Vendor to the immutable public VendorProfile.
  public func toProfile(v : Vendor) : VendorProfile {
    {
      id = v.id;
      businessName = v.businessName;
      contactEmail = v.contactEmail;
      phone = v.phone;
      categories = v.categories;
      address = v.address;
      bankAccountNumber = v.bankAccountNumber;
      ifscCode = v.ifscCode;
      fssaiDocumentUrl = v.fssaiDocumentUrl;
      vendorType = v.vendorType;
      gstinNumber = v.gstinNumber;
      brandName = v.brandName;
      packagingDetails = v.packagingDetails;
      status = v.status;
      registeredAt = v.registeredAt;
      approvedAt = v.approvedAt;
      assignedProductIds = v.assignedProductIds;
    };
  };


  /// Convert an internal Vendor to the immutable public VendorSummary.
  public func toSummary(v : Vendor) : VendorSummary {
    {
      id = v.id;
      businessName = v.businessName;
      contactEmail = v.contactEmail;
      phone = v.phone;
      categories = v.categories;
      address = v.address;
      bankAccountNumber = v.bankAccountNumber;
      ifscCode = v.ifscCode;
      fssaiDocumentUrl = v.fssaiDocumentUrl;
      vendorType = v.vendorType;
      gstinNumber = v.gstinNumber;
      brandName = v.brandName;
      packagingDetails = v.packagingDetails;
      status = v.status;
      registeredAt = v.registeredAt;
      approvedAt = v.approvedAt;
      assignedProductIds = v.assignedProductIds;
    };
  };

  /// Create a new pending vendor from registration input.
  public func create(
    id : Principal,
    reg : VendorRegistration,
    nowNs : Int,
  ) : Vendor {
    {
      id;
      businessName = reg.businessName;
      contactEmail = reg.contactEmail;
      phone = reg.phone;
      categories = reg.categories;
      address = reg.address;
      bankAccountNumber = reg.bankAccountNumber;
      ifscCode = reg.ifscCode;
      fssaiDocumentUrl = reg.fssaiDocumentUrl;
      vendorType = reg.vendorType;
      gstinNumber = reg.gstinNumber;
      brandName = reg.brandName;
      packagingDetails = reg.packagingDetails;
      var status = #pending;
      registeredAt = nowNs;
      var approvedAt = null;
      var assignedProductIds = [];
    };
  };

  /// Delete a vendor by Principal — mutates the list in-place by clearing and re-adding all non-matching entries.
  /// Works because List is a mutable object passed by reference.
  public func deleteByPrincipal(
    vendors : List.List<Vendor>,
    id : Principal,
  ) {
    let kept = vendors.filter(func(v) { not Principal.equal(v.id, id) });
    vendors.clear();
    vendors.addAll(kept.values());
  };

  /// Find a vendor by Principal.
  public func findById(
    vendors : List.List<Vendor>,
    id : Principal,
  ) : ?Vendor {
    vendors.find(func(v) { Principal.equal(v.id, id) });
  };

  /// Find a vendor by contact email (used for deduplication on anonymous registration).
  public func findByEmail(
    vendors : List.List<Vendor>,
    email : Text,
  ) : ?Vendor {
    vendors.find(func(v) { v.contactEmail == email });
  };

  /// Filter vendors by optional status.
  public func listByStatus(
    vendors : List.List<Vendor>,
    status : ?VendorStatus,
  ) : [VendorSummary] {
    switch (status) {
      case null {
        vendors.map<Vendor, VendorSummary>(toSummary).toArray();
      };
      case (?s) {
        vendors
          .filter(func(v) {
            switch (v.status, s) {
              case (#pending, #pending) true;
              case (#approved, #approved) true;
              case (#rejected, #rejected) true;
              case (#suspended, #suspended) true;
              case _ false;
            };
          })
          .map<Vendor, VendorSummary>(toSummary)
          .toArray();
      };
    };
  };

  /// Find the vendor assigned to a given product ID.
  public func findByProductId(
    vendors : List.List<Vendor>,
    productId : Text,
  ) : ?VendorSummary {
    switch (
      vendors.find(func(v) {
        v.assignedProductIds.find(func(pid) { pid == productId }) != null
      })
    ) {
      case (?v) ?toSummary(v);
      case null null;
    };
  };
};
