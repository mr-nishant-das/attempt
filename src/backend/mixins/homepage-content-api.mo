import HomepageLib "../lib/homepage-content";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";

mixin (
  heroBanners : List.List<HomepageLib.HeroBanner>,
  featuredBlocks : List.List<HomepageLib.FeaturedBlock>,
  adminSessionState : { var token : ?Text; var expiry : Int },
) {

  func _adminAuthHP(token : Text) : Bool {
    switch (adminSessionState.token) {
      case (?t) Text.equal(t, token) and Time.now() < adminSessionState.expiry;
      case null false;
    };
  };

  stable var nextHeroBannerId : Nat = 1;
  stable var nextFeaturedBlockId : Nat = 1;

  // ---- Public HeroBanner Queries ----

  public query func listHeroBanners() : async [HomepageLib.HeroBanner] {
    HomepageLib.listHeroBanners(heroBanners);
  };

  public query func getHeroBanner(id : HomepageLib.HeroBannerId) : async ?HomepageLib.HeroBanner {
    HomepageLib.getHeroBanner(heroBanners, id);
  };

  // ---- Public FeaturedBlock Queries ----

  public query func listFeaturedBlocks() : async [HomepageLib.FeaturedBlock] {
    HomepageLib.listFeaturedBlocks(featuredBlocks);
  };

  public query func getFeaturedBlock(id : HomepageLib.FeaturedBlockId) : async ?HomepageLib.FeaturedBlock {
    HomepageLib.getFeaturedBlock(featuredBlocks, id);
  };

  // ---- Admin HeroBanner API ----

  public query func adminListHeroBanners(adminToken : Text) : async [HomepageLib.HeroBanner] {
    if (not _adminAuthHP(adminToken)) Runtime.trap("Unauthorized");
    HomepageLib.listAllHeroBanners(heroBanners);
  };

  public shared func adminAddHeroBanner(adminToken : Text, input : HomepageLib.HeroBannerInput) : async HomepageLib.HeroBanner {
    if (not _adminAuthHP(adminToken)) Runtime.trap("Unauthorized");
    let banner = HomepageLib.addHeroBanner(heroBanners, nextHeroBannerId, input);
    nextHeroBannerId += 1;
    banner;
  };

  public shared func adminUpdateHeroBanner(
    adminToken : Text,
    id : HomepageLib.HeroBannerId,
    input : HomepageLib.HeroBannerInput,
  ) : async { #ok : HomepageLib.HeroBanner; #err : Text } {
    if (not _adminAuthHP(adminToken)) return #err("Not authorized");
    switch (HomepageLib.updateHeroBanner(heroBanners, id, input)) {
      case (?banner) { #ok(banner) };
      case null { #err("HeroBanner not found") };
    };
  };

  public shared func adminDeleteHeroBanner(adminToken : Text, id : HomepageLib.HeroBannerId) : async { #ok : Bool; #err : Text } {
    if (not _adminAuthHP(adminToken)) return #err("Not authorized");
    let deleted = HomepageLib.deleteHeroBanner(heroBanners, id);
    if (deleted) { #ok(true) } else { #err("HeroBanner not found") };
  };

  public shared func adminReorderHeroBanner(
    adminToken : Text,
    id : HomepageLib.HeroBannerId,
    newOrder : Nat,
  ) : async { #ok : HomepageLib.HeroBanner; #err : Text } {
    if (not _adminAuthHP(adminToken)) return #err("Not authorized");
    switch (HomepageLib.reorderHeroBanner(heroBanners, id, newOrder)) {
      case (?banner) { #ok(banner) };
      case null { #err("HeroBanner not found") };
    };
  };

  // ---- Admin FeaturedBlock API ----

  public query func adminListFeaturedBlocks(adminToken : Text) : async [HomepageLib.FeaturedBlock] {
    if (not _adminAuthHP(adminToken)) Runtime.trap("Unauthorized");
    HomepageLib.listAllFeaturedBlocks(featuredBlocks);
  };

  public shared func adminAddFeaturedBlock(adminToken : Text, input : HomepageLib.FeaturedBlockInput) : async HomepageLib.FeaturedBlock {
    if (not _adminAuthHP(adminToken)) Runtime.trap("Unauthorized");
    let block = HomepageLib.addFeaturedBlock(featuredBlocks, nextFeaturedBlockId, input);
    nextFeaturedBlockId += 1;
    block;
  };

  public shared func adminUpdateFeaturedBlock(
    adminToken : Text,
    id : HomepageLib.FeaturedBlockId,
    input : HomepageLib.FeaturedBlockInput,
  ) : async { #ok : HomepageLib.FeaturedBlock; #err : Text } {
    if (not _adminAuthHP(adminToken)) return #err("Not authorized");
    switch (HomepageLib.updateFeaturedBlock(featuredBlocks, id, input)) {
      case (?block) { #ok(block) };
      case null { #err("FeaturedBlock not found") };
    };
  };

  public shared func adminDeleteFeaturedBlock(adminToken : Text, id : HomepageLib.FeaturedBlockId) : async { #ok : Bool; #err : Text } {
    if (not _adminAuthHP(adminToken)) return #err("Not authorized");
    let deleted = HomepageLib.deleteFeaturedBlock(featuredBlocks, id);
    if (deleted) { #ok(true) } else { #err("FeaturedBlock not found") };
  };

};
