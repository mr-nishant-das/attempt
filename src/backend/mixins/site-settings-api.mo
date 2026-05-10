import SiteSettingsLib "../lib/site-settings";
import UserLib "../lib/users";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";

mixin (
  users : List.List<UserLib.UserProfile>,
) {

  var siteSettings : SiteSettingsLib.SiteSettings = SiteSettingsLib.empty();

  // --- Admin session authentication (session-token approach) ---
  // Credentials: userId = "assamroots2804", passcode = "Assamroots@2026"
  // djb2 hash is used to avoid storing the raw passcode in code.
  // Token expires after 30 minutes.

  let ADMIN_USER_ID : Text = "assamroots2804";
  let SESSION_DURATION_NS : Int = 30 * 60 * 1_000_000_000;

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

  var adminSessionToken : ?Text = null;
  var adminSessionExpiry : Int = 0;

  func isValidAdminSession(token : Text) : Bool {
    switch (adminSessionToken) {
      case (?t) Text.equal(t, token) and Time.now() < adminSessionExpiry;
      case null false;
    };
  };

  func makeToken(userId : Text, tsNat : Nat) : Text {
    userId # "-" # tsNat.toText() # "-" # djb2Hash(userId # tsNat.toText()).toText();
  };

  /// Admin login with userId and passcode. Returns a session token on success, null on failure.
  public shared func adminLogin(userId : Text, passcode : Text) : async ?Text {
    if (not Text.equal(userId, ADMIN_USER_ID)) return null;
    if (djb2Hash(passcode) != PASSCODE_HASH_REF) return null;
    let now = Time.now();
    let tsNat : Nat = if (now >= 0) now.toNat() else 0;
    let token = makeToken(userId, tsNat);
    adminSessionToken := ?token;
    adminSessionExpiry := now + SESSION_DURATION_NS;
    ?token;
  };

  /// Invalidate the current admin session.
  public shared func adminLogout(token : Text) : async () {
    switch (adminSessionToken) {
      case (?t) {
        if (Text.equal(t, token)) {
          adminSessionToken := null;
          adminSessionExpiry := 0;
        };
      };
      case null {};
    };
  };

  /// Check if a session token is still valid.
  public query func isAdminSession(token : Text) : async Bool {
    isValidAdminSession(token);
  };

  // --- Site settings (logo, favicon) ---

  public query func getSiteSettings() : async { logoUrl : ?Text; faviconUrl : ?Text } {
    { logoUrl = siteSettings.logoUrl; faviconUrl = siteSettings.faviconUrl };
  };

  public shared ({ caller }) func adminUpdateSiteSettings(
    logoUrl : ?Text,
    faviconUrl : ?Text,
  ) : async { logoUrl : ?Text; faviconUrl : ?Text } {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    siteSettings := SiteSettingsLib.update(siteSettings, logoUrl, faviconUrl);
    { logoUrl = siteSettings.logoUrl; faviconUrl = siteSettings.faviconUrl };
  };

  // --- Services availability ---

  public query func getServicesAvailability() : async { available : Bool; message : Text } {
    {
      available = SiteSettingsLib.getServicesAvailable(siteSettings);
      message = SiteSettingsLib.getServicesUnavailableMessage(siteSettings);
    };
  };

  public shared ({ caller }) func adminUpdateServicesAvailability(
    available : Bool,
    message : Text,
  ) : async () {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    siteSettings := SiteSettingsLib.updateServicesAvailability(siteSettings, available, message);
  };

  // --- Video byte ---

  public query func getVideoByte() : async { url : Text; enabled : Bool; title : Text } {
    {
      url = SiteSettingsLib.getVideoByteUrl(siteSettings);
      enabled = SiteSettingsLib.getVideoByteEnabled(siteSettings);
      title = SiteSettingsLib.getVideoByteTitle(siteSettings);
    };
  };

  public shared ({ caller }) func adminUpdateVideoByte(
    url : Text,
    enabled : Bool,
    title : Text,
  ) : async () {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    siteSettings := SiteSettingsLib.updateVideoByte(siteSettings, url, enabled, title);
  };

};
