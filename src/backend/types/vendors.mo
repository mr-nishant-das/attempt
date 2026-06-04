module {
  public type VendorStatus = {
    #pending;
    #approved;
    #rejected;
    #suspended;
  };

  /// Distinguishes a branded vendor (with GSTIN, own packaging, MRP-priced products)
  /// from a raw-material vendor (bulk-supply by kg, admin handles packaging).
  public type VendorType = {
    #brand;
    #rawMaterial;
  };

  public type Vendor = {
    id : Principal;
    businessName : Text;
    contactEmail : Text;
    phone : Text;
    categories : [Text];
    address : Text;
    bankAccountNumber : Text;
    ifscCode : Text;
    fssaiDocumentUrl : ?Text;
    /// Vendor classification added for vendor-types domain.
    vendorType : VendorType;
    /// Brand vendors: GST Identification Number.
    gstinNumber : ?Text;
    /// Brand vendors: publicly visible brand name.
    brandName : ?Text;
    /// Brand vendors: description of their product packaging.
    packagingDetails : ?Text;
    var status : VendorStatus;
    registeredAt : Int;
    var approvedAt : ?Int;
    var assignedProductIds : [Text];
  };

  public type VendorRegistration = {
    businessName : Text;
    contactEmail : Text;
    phone : Text;
    categories : [Text];
    address : Text;
    bankAccountNumber : Text;
    ifscCode : Text;
    fssaiDocumentUrl : ?Text;
    /// Must be provided at registration to classify the vendor.
    vendorType : VendorType;
    /// Brand vendors only.
    gstinNumber : ?Text;
    brandName : ?Text;
    packagingDetails : ?Text;
  };

  /// Immutable summary safe to return across the API boundary.
  public type VendorSummary = {
    id : Principal;
    businessName : Text;
    contactEmail : Text;
    phone : Text;
    categories : [Text];
    address : Text;
    bankAccountNumber : Text;
    ifscCode : Text;
    fssaiDocumentUrl : ?Text;
    vendorType : VendorType;
    gstinNumber : ?Text;
    brandName : ?Text;
    packagingDetails : ?Text;
    status : VendorStatus;
    registeredAt : Int;
    approvedAt : ?Int;
    assignedProductIds : [Text];
  };

  /// Full vendor profile returned to the vendor themselves.
  public type VendorProfile = {
    id : Principal;
    businessName : Text;
    contactEmail : Text;
    phone : Text;
    categories : [Text];
    address : Text;
    bankAccountNumber : Text;
    ifscCode : Text;
    fssaiDocumentUrl : ?Text;
    vendorType : VendorType;
    gstinNumber : ?Text;
    brandName : ?Text;
    packagingDetails : ?Text;
    status : VendorStatus;
    registeredAt : Int;
    approvedAt : ?Int;
    assignedProductIds : [Text];
  };

  /// A lightweight order summary surfaced to a vendor.
  public type VendorOrderSummary = {
    orderId : Text;
    productId : Text;
    productName : Text;
    quantity : Nat;
    totalPrice : Float;
    placedAt : Int;
  };

  /// A one-time approval token for email-based vendor action links.
  public type VendorApprovalToken = {
    token : Text;
    vendorEmail : Text;
    createdAt : Int;
    var used : Bool;
  };
};
