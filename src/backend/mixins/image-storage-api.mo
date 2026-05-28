import Runtime "mo:core/Runtime";
import UserLib "../lib/users";
import List "mo:core/List";

/// Public API mixin for image storage.
/// The five _immutableObjectStorage* gateway/scrubber methods are provided by
/// the caffeineai-object-storage Mixin included in main.mo.
/// This mixin exposes the admin-facing helper to register an uploaded image hash
/// so the frontend can persist it to a product's imageUrls.
mixin (
  users : List.List<UserLib.UserProfile>,
) {

  /// Admin-only: record that a previously uploaded blob hash is now in use.
  /// Returns the canonical hash string so the frontend can store it in imageUrls.
  /// The actual upload is performed by the frontend via the StorageClient; this
  /// call simply validates admin access and returns the hash for persistence.
  public shared ({ caller }) func adminRegisterImageHash(hash : Text) : async Text {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    if (hash.size() == 0) Runtime.trap("Hash must be non-empty");
    hash;
  };

};
