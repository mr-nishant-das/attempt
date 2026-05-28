import Types "../types/image-storage";

/// Domain helpers for image storage.
/// Heavy lifting is delegated to the caffeineai-object-storage mixin;
/// this module provides any app-level helpers needed at the lib layer.
module {
  public type ImageHash = Types.ImageHash;
  public type ImageUploadResult = Types.ImageUploadResult;

  /// Validate that a hash string is a non-empty SHA-256 hex string (64 chars).
  public func isValidHash(hash : ImageHash) : Bool {
    hash.size() == 64;
  };

  /// Build a public URL for a stored image given its hash and the gateway base URL.
  public func buildImageUrl(gatewayBaseUrl : Text, hash : ImageHash) : Text {
    gatewayBaseUrl # "/" # hash;
  };
};
