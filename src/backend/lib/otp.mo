import Map "mo:core/Map";
import OtpTypes "../types/otp";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

module {
  public type OtpRecord = OtpTypes.OtpRecord;
  /// Remove all expired OTP entries from the store.
  public func cleanup(store : Map.Map<Text, OtpRecord>) : () {
    let nowNs = Time.now();
    let expiredKeys : [Text] = Iter.toArray(
      store.entries()
        .filter(func((_, r)) { r.expiresAt <= nowNs })
        .map(func((k, _ : OtpRecord)) { k })
    );
    for (k in expiredKeys.values()) {
      store.remove(k);
    };
  };


  /// Generate a 6-digit OTP, hash it, store it keyed by email, and return the
  /// plain-text code so the caller can send it via email.
  public func generate(
    store : Map.Map<Text, OtpRecord>,
    email : Text,
    nowNs : Int,
  ) : Text {
    var seed : Nat = 17;
    for (c in email.chars()) {
      seed := seed * 31 + c.toNat32().toNat();
    };
    let tNat : Nat = if (nowNs >= 0) nowNs.toNat() else 0;
    seed := (seed * 1_000_003 + tNat) % 1_000_000;
    let code = seed % 1_000_000;
    let codeText : Text = if (code < 100_000) { "0" # code.toText() } else { code.toText() };
    let record : OtpRecord = {
      hashedCode = hashCode(codeText);
      expiresAt = nowNs + 10 * 60 * 1_000_000_000;
      var used = false;
    };
    store.add(email, record);
    codeText;
  };

  /// Verify a submitted code against the stored hashed record.
  /// Returns #ok on success, #err with a reason on failure.
  public func verify(
    store : Map.Map<Text, OtpRecord>,
    email : Text,
    code : Text,
    nowNs : Int,
  ) : { #ok; #err : Text } {
    let expiredKeys : [Text] = Iter.toArray(
      store.entries()
        .filter(func((_, r)) { r.expiresAt <= nowNs })
        .map(func((k, _ : OtpRecord)) { k })
    );
    for (k in expiredKeys.values()) {
      store.remove(k);
    };
    switch (store.get(email)) {
      case null { #err "No OTP found for this email. Please request a new one." };
      case (?record) {
        if (record.expiresAt <= nowNs) {
          store.remove(email);
          #err "OTP has expired. Please request a new one.";
        } else if (record.used) {
          #err "OTP has already been used. Please request a new one.";
        } else if (record.hashedCode != hashCode(code)) {
          #err "Invalid OTP code.";
        } else {
          record.used := true;
          #ok;
        };
      };
    };
  };

  /// Hash a plain-text code for storage.
  public func hashCode(code : Text) : Text {
    var h : Nat = 5381;
    for (c in code.chars()) {
      h := h * 33 + c.toNat32().toNat();
    };
    h.toText();
  };
};
