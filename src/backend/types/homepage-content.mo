module {
  public type HeroBannerId = Nat;
  public type FeaturedBlockId = Nat;

  public type HeroBanner = {
    id : HeroBannerId;
    title : Text;
    subtitle : Text;
    imageUrl : Text;
    ctaText : Text;
    ctaSlug : Text;
    order : Nat;
    isActive : Bool;
  };

  public type HeroBannerInput = {
    title : Text;
    subtitle : Text;
    imageUrl : Text;
    ctaText : Text;
    ctaSlug : Text;
    order : Nat;
    isActive : Bool;
  };

  public type FeaturedBlock = {
    id : FeaturedBlockId;
    title : Text;
    thumbnailUrl : Text;
    content : Text;
    contentImages : [Text];
    order : Nat;
    isActive : Bool;
    createdAt : Int;
  };

  public type FeaturedBlockInput = {
    title : Text;
    thumbnailUrl : Text;
    content : Text;
    contentImages : [Text];
    order : Nat;
    isActive : Bool;
  };
};
