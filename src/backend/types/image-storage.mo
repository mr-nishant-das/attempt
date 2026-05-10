module {
  /// A blob hash (SHA-256, 32 bytes) identifying a stored image.
  public type ImageHash = Text;

  /// Result returned after successfully registering an image hash.
  public type ImageUploadResult = {
    hash : ImageHash;
  };
};
