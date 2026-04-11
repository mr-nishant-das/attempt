import UserLib "../lib/users";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";


mixin (
  users : List.List<UserLib.UserProfile>,
) {

  public shared ({ caller }) func getMyProfile() : async UserLib.UserProfilePublic {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    let profile = UserLib.getOrCreateProfile(users, caller);
    UserLib.toPublic(profile);
  };

  public shared ({ caller }) func updateMyProfile(input : UserLib.UserProfileInput) : async UserLib.UserProfilePublic {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    ignore UserLib.getOrCreateProfile(users, caller);
    switch (UserLib.updateProfile(users, caller, input)) {
      case (?p) p;
      case null Runtime.trap("Profile not found");
    };
  };

  public shared ({ caller }) func addMyAddress(address : UserLib.Address) : async UserLib.UserProfilePublic {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    ignore UserLib.getOrCreateProfile(users, caller);
    switch (UserLib.addAddress(users, caller, address)) {
      case (?p) p;
      case null Runtime.trap("Profile not found");
    };
  };

  public query ({ caller }) func isCurrentUserAdmin() : async Bool {
    if (caller.isAnonymous()) return false;
    UserLib.isAdmin(users, caller);
  };

  // Bootstrap: allow first caller to become admin (one-time use)
  public shared ({ caller }) func claimAdminIfFirst() : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    let isEmpty = users.isEmpty();
    if (isEmpty) {
      ignore UserLib.getOrCreateProfile(users, caller);
      ignore UserLib.setAdmin(users, caller, true);
      true;
    } else {
      false;
    };
  };

  public shared ({ caller }) func adminSetUserAdmin(targetUser : Principal, adminStatus : Bool) : async Bool {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    UserLib.setAdmin(users, targetUser, adminStatus);
  };

};
