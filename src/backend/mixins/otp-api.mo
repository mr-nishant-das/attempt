import Map "mo:core/Map";
import List "mo:core/List";
import OtpLib "../lib/otp";
import OtpTypes "../types/otp";
import UserLib "../lib/users";
import EmailClient "mo:caffeineai-email/emailClient";
import Time "mo:core/Time";
import Text "mo:core/Text";

mixin (
  otpStore : Map.Map<Text, OtpTypes.OtpRecord>,
  users : List.List<UserLib.UserProfile>,
  adminOtpStore : Map.Map<Text, OtpTypes.OtpRecord>,
  adminSessionState : { var token : ?Text; var expiry : Int },
) {

  // ============================================================
  // ADMIN_SECRET_KEY: aR7#Xm2$Kp9@Wq5!Tz8^Nj4&Yb6*Lv3%Fh1@Dc0!Qs
  // This 44-character key is the FIRST factor for admin panel
  // access. Guard it carefully -- possession grants admin entry.
  // ============================================================
  let ADMIN_SECRET_KEY : Text = "aR7#Xm2$Kp9@Wq5!Tz8^Nj4&Yb6*Lv3%Fh1@Dc0!Qs";

  // Admin OTP always goes to this fixed address -- never configurable.
  let ADMIN_EMAIL : Text = "assamshop@assamroots.shop";
  let ADMIN_OTP_KEY : Text = "admin@system";

  var adminSessionTokens : Map.Map<Text, Int> = Map.empty<Text, Int>();
  var userSessionTokens : Map.Map<Text, { email : Text; expiresAt : Int }> = Map.empty<Text, { email : Text; expiresAt : Int }>();

  func makeSessionToken(email : Text, nowNs : Int) : Text {
    let nowNat : Nat = if (nowNs >= 0) nowNs.toNat() else 0;
    var h : Nat = 5381;
    for (c in email.chars()) {
      h := h * 33 + c.toNat32().toNat();
    };
    h := h * 1_000_003 + nowNat;
    email # "-" # nowNat.toText() # "-" # h.toText();
  };


  // ──────────────────────────────────────────────
  // Customer / Vendor OTP login
  // ──────────────────────────────────────────────

  /// Send a 6-digit OTP to the given email address.
  /// Stores a hashed record with a 10-minute expiry.
  public shared func requestOtp(email : Text) : async { #ok; #err : Text } {
    let code = OtpLib.generate(otpStore, email, Time.now());
    let htmlBody : Text = "<html><body style='font-family:Arial,sans-serif'>" #
      "<h2 style='color:#8B1A2B'>AssamRoots Login Code</h2>" #
      "<p>Your one-time login code is: <strong style='font-size:24px;letter-spacing:4px'>" # code # "</strong></p>" #
      "<p>This code expires in <strong>10 minutes</strong>.</p>" #
      "<p>If you did not request this, please ignore this email.</p>" #
      "</body></html>";
    ignore EmailClient.sendServiceEmail("auth", [email], "Your AssamRoots login code", htmlBody);
    #ok;
  };

  /// Verify the submitted OTP. Returns a session token on success.
  public shared func verifyOtp(email : Text, code : Text) : async { #ok : Text; #err : Text } {
    let now = Time.now();
    switch (OtpLib.verify(otpStore, email, code, now)) {
      case (#err msg) { #err msg };
      case (#ok) {
        let token = makeSessionToken(email, now);
        let expiresAt = now + 24 * 60 * 60 * 1_000_000_000;
        userSessionTokens.add(token, { email; expiresAt });
        #ok token;
      };
    };
  };

  // ──────────────────────────────────────────────
  // Admin two-factor OTP
  // ──────────────────────────────────────────────

  /// First factor: verify the admin's hardcoded complex secret key.
  public shared func adminVerifyKey(secretKey : Text) : async { #ok; #err : Text } {
    if (Text.equal(secretKey, ADMIN_SECRET_KEY)) { #ok }
    else { #err "Invalid secret key." };
  };

  /// Second factor: send a one-time code to assamshop@assamroots.shop.
  public shared func adminRequestOtp() : async { #ok; #err : Text } {
    let code = OtpLib.generate(adminOtpStore, ADMIN_OTP_KEY, Time.now());
    let htmlBody : Text = "<html><body style='font-family:Arial,sans-serif'>" #
      "<h2 style='color:#1a2b5e'>AssamRoots Admin Access Code</h2>" #
      "<p>Your admin panel one-time access code is: <strong style='font-size:24px;letter-spacing:4px'>" # code # "</strong></p>" #
      "<p>This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>" #
      "</body></html>";
    ignore EmailClient.sendServiceEmail("auth", [ADMIN_EMAIL], "AssamRoots Admin Panel Access Code", htmlBody);
    #ok;
  };

  /// Second factor verification: check the OTP sent to assamshop@assamroots.shop.
  public shared func adminVerifyOtp(code : Text) : async { #ok : Text; #err : Text } {
    let now = Time.now();
    switch (OtpLib.verify(adminOtpStore, ADMIN_OTP_KEY, code, now)) {
      case (#err msg) { #err msg };
      case (#ok) {
        let token = makeSessionToken(ADMIN_EMAIL, now);
        let expiresAt = now + 8 * 60 * 60 * 1_000_000_000;
        adminSessionTokens.add(token, expiresAt);
        // Also persist into the shared adminSessionState so all mixins can validate it
        adminSessionState.token := ?token;
        adminSessionState.expiry := expiresAt;
        #ok token;
      };
    };
  };
};
