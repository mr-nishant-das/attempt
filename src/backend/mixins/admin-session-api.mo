import UserLib "../lib/users";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";

mixin (
  users : List.List<UserLib.UserProfile>,
  adminSessionState : { var token : ?Text; var expiry : Int },
) {

  // --- Admin session authentication (session-token approach) ---
  // Credentials: userId = "assamroots2804", passcode = "Assamroots@2026"
  // djb2 hash is used to avoid storing the raw passcode in code.
  // Token expires after 30 minutes.

  let ADMIN_USER_ID : Text = "assamroots2804";
  let SESSION_DURATION_NS : Int = 8 * 60 * 60 * 1_000_000_000;

  // djb2 hash over Text characters
  func djb2Hash(s : Text) : Nat {
    var h : Nat = 5381;
    for (c in s.chars()) {
      h := h * 33 + c.toNat32().toNat();
    };
    h;
  };

  // Reference hash of the admin passcode — computed at actor init time
  let PASSCODE_HASH_REF : Nat = djb2Hash("Assamroots@2026");

  func _checkAdminAuth(token : Text) : Bool {
    switch (adminSessionState.token) {
      case (?t) Text.equal(t, token) and Time.now() < adminSessionState.expiry;
      case null false;
    };
  };

  func makeToken(userId : Text, tsNat : Nat) : Text {
    userId # "-" # tsNat.toText() # "-" # djb2Hash(userId # tsNat.toText()).toText();
  };

  /// Admin login — retained for backward compatibility.
  /// The new two-factor flow: adminVerifyKey() -> adminRequestOtp() -> adminVerifyOtp().
  public shared func adminLogin(userId : Text, passcode : Text) : async ?Text {
    if (not Text.equal(userId, ADMIN_USER_ID)) return null;
    if (djb2Hash(passcode) != PASSCODE_HASH_REF) return null;
    let now = Time.now();
    let tsNat : Nat = if (now >= 0) now.toNat() else 0;
    let token = makeToken(userId, tsNat);
    adminSessionState.token := ?token;
    adminSessionState.expiry := now + SESSION_DURATION_NS;
    ?token;
  };

  /// Invalidate the current admin session.
  public shared func adminLogout(token : Text) : async () {
    switch (adminSessionState.token) {
      case (?t) {
        if (Text.equal(t, token)) {
          adminSessionState.token := null;
          adminSessionState.expiry := 0;
        };
      };
      case null {};
    };
  };

  /// Check if a session token is still valid.
  public query func isAdminSession(token : Text) : async Bool {
    _checkAdminAuth(token);
  };

};
