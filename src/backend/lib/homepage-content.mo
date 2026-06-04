import Types "../types/homepage-content";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public type HeroBanner = Types.HeroBanner;
  public type HeroBannerId = Types.HeroBannerId;
  public type HeroBannerInput = Types.HeroBannerInput;
  public type FeaturedBlock = Types.FeaturedBlock;
  public type FeaturedBlockId = Types.FeaturedBlockId;
  public type FeaturedBlockInput = Types.FeaturedBlockInput;

  // --- HeroBanner Operations ---

  public func listHeroBanners(banners : List.List<HeroBanner>) : [HeroBanner] {
    let active = banners.filter(func(b : HeroBanner) : Bool { b.isActive });
    active.toArray();
  };

  public func listAllHeroBanners(banners : List.List<HeroBanner>) : [HeroBanner] {
    banners.toArray();
  };

  public func getHeroBanner(banners : List.List<HeroBanner>, id : HeroBannerId) : ?HeroBanner {
    banners.find(func(b : HeroBanner) : Bool { b.id == id });
  };

  public func addHeroBanner(
    banners : List.List<HeroBanner>,
    nextId : Nat,
    input : HeroBannerInput,
  ) : HeroBanner {
    let banner : HeroBanner = {
      id = nextId;
      title = input.title;
      subtitle = input.subtitle;
      imageUrl = input.imageUrl;
      ctaText = input.ctaText;
      ctaSlug = input.ctaSlug;
      order = input.order;
      isActive = input.isActive;
      durationSeconds = input.durationSeconds;
    };
    banners.add(banner);
    banner;
  };

  public func updateHeroBanner(
    banners : List.List<HeroBanner>,
    id : HeroBannerId,
    input : HeroBannerInput,
  ) : ?HeroBanner {
    var updated : ?HeroBanner = null;
    banners.mapInPlace(func(b : HeroBanner) : HeroBanner {
      if (b.id == id) {
        let u : HeroBanner = {
          b with
          title = input.title;
          subtitle = input.subtitle;
          imageUrl = input.imageUrl;
          ctaText = input.ctaText;
          ctaSlug = input.ctaSlug;
          order = input.order;
          isActive = input.isActive;
          durationSeconds = input.durationSeconds;
        };
        updated := ?u;
        u;
      } else { b };
    });
    updated;
  };

  public func deleteHeroBanner(
    banners : List.List<HeroBanner>,
    id : HeroBannerId,
  ) : Bool {
    let before = banners.size();
    banners.retain(func(b : HeroBanner) : Bool { b.id != id });
    banners.size() < before;
  };

  public func reorderHeroBanner(
    banners : List.List<HeroBanner>,
    id : HeroBannerId,
    newOrder : Nat,
  ) : ?HeroBanner {
    var updated : ?HeroBanner = null;
    banners.mapInPlace(func(b : HeroBanner) : HeroBanner {
      if (b.id == id) {
        let u : HeroBanner = { b with order = newOrder };
        updated := ?u;
        u;
      } else { b };
    });
    updated;
  };

  // --- FeaturedBlock Operations ---

  public func listFeaturedBlocks(blocks : List.List<FeaturedBlock>) : [FeaturedBlock] {
    let active = blocks.filter(func(b : FeaturedBlock) : Bool { b.isActive });
    active.toArray();
  };

  public func listAllFeaturedBlocks(blocks : List.List<FeaturedBlock>) : [FeaturedBlock] {
    blocks.toArray();
  };

  public func getFeaturedBlock(blocks : List.List<FeaturedBlock>, id : FeaturedBlockId) : ?FeaturedBlock {
    blocks.find(func(b : FeaturedBlock) : Bool { b.id == id });
  };

  public func addFeaturedBlock(
    blocks : List.List<FeaturedBlock>,
    nextId : Nat,
    input : FeaturedBlockInput,
  ) : FeaturedBlock {
    let block : FeaturedBlock = {
      id = nextId;
      title = input.title;
      thumbnailUrl = input.thumbnailUrl;
      content = input.content;
      contentImages = input.contentImages;
      order = input.order;
      isActive = input.isActive;
      createdAt = Time.now();
    };
    blocks.add(block);
    block;
  };

  public func updateFeaturedBlock(
    blocks : List.List<FeaturedBlock>,
    id : FeaturedBlockId,
    input : FeaturedBlockInput,
  ) : ?FeaturedBlock {
    var updated : ?FeaturedBlock = null;
    blocks.mapInPlace(func(b : FeaturedBlock) : FeaturedBlock {
      if (b.id == id) {
        let u : FeaturedBlock = {
          b with
          title = input.title;
          thumbnailUrl = input.thumbnailUrl;
          content = input.content;
          contentImages = input.contentImages;
          order = input.order;
          isActive = input.isActive;
        };
        updated := ?u;
        u;
      } else { b };
    });
    updated;
  };

  public func deleteFeaturedBlock(
    blocks : List.List<FeaturedBlock>,
    id : FeaturedBlockId,
  ) : Bool {
    let before = blocks.size();
    blocks.retain(func(b : FeaturedBlock) : Bool { b.id != id });
    blocks.size() < before;
  };

  // --- Seeding ---

  public func seedHeroBanners(banners : List.List<HeroBanner>, nextId : Nat) : Nat {
    let seedData : [(Text, Text, Text, Text, Text, Nat)] = [
      (
        "Authentic Assam, Delivered Anywhere",
        "From the heart of Northeast India to your doorstep \u{2014} tea, spices, handloom, and more",
        "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1400",
        "Shop Now",
        "/products",
        5,
      ),
      (
        "Taste the Spirit of Bihu",
        "Celebrate Assam's most beloved festival with traditional foods, sweets, and decor",
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1400",
        "Explore",
        "/products",
        5,
      ),
      (
        "Muga Silk \u{2014} Assam's Golden Thread",
        "Discover the world-renowned golden silk of Assam, handwoven by master artisans",
        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400",
        "Discover",
        "/products",
        5,
      ),
      (
        "Pure Assam Tea, Straight from the Garden",
        "Rich, bold, and aromatic \u{2014} experience Assam tea the way it was meant to be",
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400",
        "Shop Now",
        "/products",
        5,
      ),
      (
        "Connecting the Diaspora to Home",
        "Wherever you are in the world, AssamRoots brings the authentic taste and culture of Assam to you",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1400",
        "Learn More",
        "/products",
        5,
      ),
      (
        "Handcrafted with Pride",
        "Every product tells a story \u{2014} made by skilled Assamese craftspeople preserving generations of tradition",
        "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=1400",
        "Discover",
        "/products",
        5,
      ),
      (
        "Gamosa \u{2014} Symbol of Respect and Love",
        "The iconic red-and-white Gamosa, a symbol of Assamese identity and pride, now at your fingertips",
        "https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?w=1400",
        "Shop Now",
        "/products",
        5,
      ),
      (
        "Natural Herbs and Remedies from Assam",
        "Explore traditional Ayurvedic herbs and forest medicines trusted by Assamese families for centuries",
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400",
        "Explore",
        "/products",
        5,
      ),
      (
        "A Marketplace Built for Assam",
        "Supporting local vendors, artisans, and farmers \u{2014} every purchase directly empowers an Assamese livelihood",
        "https://images.unsplash.com/photo-1474898856510-884a2c0be546?w=1400",
        "Shop Now",
        "/products",
        5,
      ),
      (
        "Assamese Music, Art, and Culture",
        "From traditional instruments to handcrafted paintings \u{2014} bring the culture of Assam into your home",
        "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1400",
        "Discover",
        "/products",
        5,
      ),
      (
        "Fast, Reliable Delivery Across India",
        "Express and standard delivery options \u{2014} your authentic Assamese products reach you quickly and safely",
        "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1400",
        "Shop Now",
        "/products",
        5,
      ),
      (
        "Join the AssamRoots Community",
        "Sign up today and be part of a growing movement celebrating Assamese heritage and supporting local businesses",
        "https://images.unsplash.com/photo-1567604130959-7de86b24b6bb?w=1400",
        "Sign Up",
        "/signup",
        5,
      ),
    ];
    var id = nextId;
    var order : Nat = 1;
    for ((title, subtitle, imageUrl, ctaText, ctaSlug, durationSeconds) in seedData.values()) {
      banners.add({
        id;
        title;
        subtitle;
        imageUrl;
        ctaText;
        ctaSlug;
        order;
        isActive = true;
        durationSeconds;
      });
      id += 1;
      order += 1;
    };
    id;
  };
};
