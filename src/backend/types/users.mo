module {
  public type UserId = Principal;

  public type Address = {
    name : Text;
    phone : Text;
    line1 : Text;
    line2 : Text;
    city : Text;
    state : Text;
    pincode : Text;
    isDefault : Bool;
  };

  public type UserProfile = {
    id : UserId;
    var name : Text;
    var email : Text;
    var phone : Text;
    var addresses : [Address];
    var isAdmin : Bool;
    createdAt : Int;
    var updatedAt : Int;
  };

  public type UserProfileInput = {
    name : Text;
    email : Text;
    phone : Text;
  };

  public type UserProfilePublic = {
    id : UserId;
    name : Text;
    email : Text;
    phone : Text;
    addresses : [Address];
    isAdmin : Bool;
    createdAt : Int;
    updatedAt : Int;
  };
};
