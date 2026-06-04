import VendorTypes "vendors";

module {
  /// A product submitted by a vendor for admin review.
  public type VendorProduct = {
    id : Nat;
    vendorId : Principal;
    vendorEmail : Text;
    productName : Text;
    vendorName : Text;
    description : Text;
    imageUrls : [Text];
    category : Text;
    /// For brand vendors: the vendor's cost price to AssamRoots (paise).
    /// For raw-material vendors: treated as the base price before per-kg calculation.
    basePrice : Nat;
    fssaiDocumentUrl : ?Text;
    /// Vendor classification — drives finalPrice calculation.
    vendorType : VendorTypes.VendorType;
    // ── Brand-vendor fields ──
    /// Maximum Retail Price set by the brand (paise).
    mrp : ?Nat;
    /// Price at which the brand sells to AssamRoots (paise). Used in finalPrice calculation.
    supplyPrice : ?Nat;
    /// Minimum order quantity in units.
    moq : ?Nat;
    // ── Raw-material vendor fields ──
    /// Price per kg offered by the raw-material vendor (paise/kg).
    pricePerKg : ?Nat;
    /// Stock available from the vendor (kg). Vendor and admin can update.
    var availableQuantityKg : ?Nat;
    /// Packaging cost added by AssamRoots admin (paise). Admin-set.
    var packagingCost : ?Nat;
    var taxPercent : ?Nat;
    var finalPrice : ?Nat;
    var status : { #pending; #approved; #rejected };
    var rejectionReason : ?Text;
    submittedAt : Int;
    var reviewedAt : ?Int;
  };

  /// Immutable public view of a VendorProduct, safe to return across the API boundary.
  public type VendorProductView = {
    id : Nat;
    vendorId : Principal;
    vendorEmail : Text;
    productName : Text;
    vendorName : Text;
    description : Text;
    imageUrls : [Text];
    category : Text;
    basePrice : Nat;
    fssaiDocumentUrl : ?Text;
    vendorType : VendorTypes.VendorType;
    mrp : ?Nat;
    supplyPrice : ?Nat;
    moq : ?Nat;
    pricePerKg : ?Nat;
    availableQuantityKg : ?Nat;
    packagingCost : ?Nat;
    taxPercent : ?Nat;
    finalPrice : ?Nat;
    status : { #pending; #approved; #rejected };
    rejectionReason : ?Text;
    submittedAt : Int;
    reviewedAt : ?Int;
  };

  /// Input type for vendor product submission.
  public type VendorProductInput = {
    productName : Text;
    vendorName : Text;
    description : Text;
    imageUrls : [Text];
    category : Text;
    basePrice : Nat;
    fssaiDocumentUrl : ?Text;
    /// Vendor classification — must match the submitting vendor's type.
    vendorType : VendorTypes.VendorType;
    // Brand-vendor fields
    mrp : ?Nat;
    supplyPrice : ?Nat;
    moq : ?Nat;
    // Raw-material vendor fields
    pricePerKg : ?Nat;
    availableQuantityKg : ?Nat;
  };
};
