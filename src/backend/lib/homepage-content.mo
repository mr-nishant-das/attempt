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
    let seedData : [(Text, Text, Text, Text, Text)] = [
      (
        "Authentic Assamese Tea",
        "Discover the finest teas from the lush Assam valley",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
        "Shop Now",
        "/products?category=tea",
      ),
      (
        "Traditional Assamese Attire",
        "Handwoven Mekhela Chador and Muga Silk crafted by artisans",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200",
        "Explore",
        "/products?category=attire",
      ),
      (
        "Assamese Handicrafts",
        "Bamboo, cane, bell metal and clay — crafts that tell stories",
        "https://images.unsplash.com/photo-1567361672830-f7aa558020c9?w=1200",
        "Discover",
        "/products?category=handicrafts",
      ),
    ];
    var id = nextId;
    var order : Nat = 1;
    for ((title, subtitle, imageUrl, ctaText, ctaSlug) in seedData.values()) {
      banners.add({
        id;
        title;
        subtitle;
        imageUrl;
        ctaText;
        ctaSlug;
        order;
        isActive = true;
      });
      id += 1;
      order += 1;
    };
    id;
  };
};
