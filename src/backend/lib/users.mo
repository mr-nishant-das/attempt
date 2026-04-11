import Types "../types/users";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  public type UserProfile = Types.UserProfile;
  public type UserProfilePublic = Types.UserProfilePublic;
  public type UserProfileInput = Types.UserProfileInput;
  public type UserId = Types.UserId;
  public type Address = Types.Address;

  public func toPublic(p : UserProfile) : UserProfilePublic {
    {
      id = p.id;
      name = p.name;
      email = p.email;
      phone = p.phone;
      addresses = p.addresses;
      isAdmin = p.isAdmin;
      createdAt = p.createdAt;
      updatedAt = p.updatedAt;
    };
  };

  public func getProfile(users : List.List<UserProfile>, userId : UserId) : ?UserProfile {
    users.find<UserProfile>(func(u) = Principal.equal(u.id, userId));
  };

  public func getOrCreateProfile(users : List.List<UserProfile>, userId : UserId) : UserProfile {
    switch (users.find<UserProfile>(func(u) = Principal.equal(u.id, userId))) {
      case (?u) u;
      case null {
        let now = Time.now();
        let newUser : UserProfile = {
          id = userId;
          var name = "";
          var email = "";
          var phone = "";
          var addresses = [];
          var isAdmin = false;
          createdAt = now;
          var updatedAt = now;
        };
        users.add(newUser);
        newUser;
      };
    };
  };

  public func updateProfile(users : List.List<UserProfile>, userId : UserId, input : UserProfileInput) : ?UserProfilePublic {
    var result : ?UserProfilePublic = null;
    let now = Time.now();
    users.forEach<UserProfile>(func(u) {
      if (Principal.equal(u.id, userId)) {
        u.name := input.name;
        u.email := input.email;
        u.phone := input.phone;
        u.updatedAt := now;
        result := ?toPublic(u);
      };
    });
    result;
  };

  public func addAddress(users : List.List<UserProfile>, userId : UserId, address : Address) : ?UserProfilePublic {
    var result : ?UserProfilePublic = null;
    let now = Time.now();
    users.forEach<UserProfile>(func(u) {
      if (Principal.equal(u.id, userId)) {
        let existing = u.addresses;
        let newAddresses : [Address] = if (address.isDefault) {
          let cleared = existing.map(func(a) {
            if (a.isDefault) { { a with isDefault = false } } else { a };
          });
          cleared.concat<Address>([address]);
        } else {
          existing.concat<Address>([address]);
        };
        u.addresses := newAddresses;
        u.updatedAt := now;
        result := ?toPublic(u);
      };
    });
    result;
  };

  public func isAdmin(users : List.List<UserProfile>, userId : UserId) : Bool {
    switch (users.find<UserProfile>(func(u) = Principal.equal(u.id, userId))) {
      case (?u) u.isAdmin;
      case null false;
    };
  };

  public func setAdmin(users : List.List<UserProfile>, userId : UserId, adminStatus : Bool) : Bool {
    var found = false;
    users.forEach<UserProfile>(func(u) {
      if (Principal.equal(u.id, userId)) {
        found := true;
        u.isAdmin := adminStatus;
      };
    });
    found;
  };
};
