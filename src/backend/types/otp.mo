module {
  /// A stored OTP record. The code field holds a hashed 6-digit code.
  public type OtpRecord = {
    hashedCode : Text;
    expiresAt : Int;
    var used : Bool;
  };

  /// Input type for OTP verification at the API boundary.
  public type OtpVerifyInput = {
    email : Text;
    code : Text;
  };
};
