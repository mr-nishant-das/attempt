import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";

/// Public API mixin for image storage.
/// The five _immutableObjectStorage* gateway/scrubber methods are provided by
/// the caffeineai-object-storage Mixin included in main.mo.
/// This mixin exposes the admin-facing helper to register an uploaded image hash
/// so the frontend can persist it to a product's imageUrls.
mixin (
  adminSessionState : { var token : ?Text; var expiry : Int },
) {

  func _adminAuthIS(token : Text) : Bool {
    switch (adminSessionState.token) {
      case (?t) Text.equal(t, token) and Time.now() < adminSessionState.expiry;
      case null false;
    };
  };

  /// Admin-only: record that a previously uploaded blob hash is now in use.
  /// Returns the canonical hash string so the frontend can store it in imageUrls.
  /// The actual upload is performed by the frontend via the StorageClient; this
  /// call simply validates admin access and returns the hash for persistence.
  public shared func adminRegisterImageHash(adminToken : Text, hash : Text) : async Text {
    if (not _adminAuthIS(adminToken)) Runtime.trap("Unauthorized");
    if (hash.size() == 0) Runtime.trap("Hash must be non-empty");
    hash;
  };

};
