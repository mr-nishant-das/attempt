import HomepageLib "../lib/homepage-content";
import UserLib "../lib/users";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

mixin (
  heroBanners : List.List<HomepageLib.HeroBanner>,
  featuredBlocks : List.List<HomepageLib.FeaturedBlock>,
  users : List.List<UserLib.UserProfile>,
) {

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

  public shared query ({ caller }) func adminListHeroBanners() : async [HomepageLib.HeroBanner] {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    HomepageLib.listAllHeroBanners(heroBanners);
  };

  public shared ({ caller }) func adminAddHeroBanner(input : HomepageLib.HeroBannerInput) : async HomepageLib.HeroBanner {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    let banner = HomepageLib.addHeroBanner(heroBanners, nextHeroBannerId, input);
    nextHeroBannerId += 1;
    banner;
  };

  public shared ({ caller }) func adminUpdateHeroBanner(
    id : HomepageLib.HeroBannerId,
    input : HomepageLib.HeroBannerInput,
  ) : async { #ok : HomepageLib.HeroBanner; #err : Text } {
    if (not UserLib.isAdmin(users, caller)) return #err("Not authorized");
    switch (HomepageLib.updateHeroBanner(heroBanners, id, input)) {
      case (?banner) { #ok(banner) };
      case null { #err("HeroBanner not found") };
    };
  };

  public shared ({ caller }) func adminDeleteHeroBanner(id : HomepageLib.HeroBannerId) : async { #ok : Bool; #err : Text } {
    if (not UserLib.isAdmin(users, caller)) return #err("Not authorized");
    let deleted = HomepageLib.deleteHeroBanner(heroBanners, id);
    if (deleted) { #ok(true) } else { #err("HeroBanner not found") };
  };

  public shared ({ caller }) func adminReorderHeroBanner(
    id : HomepageLib.HeroBannerId,
    newOrder : Nat,
  ) : async { #ok : HomepageLib.HeroBanner; #err : Text } {
    if (not UserLib.isAdmin(users, caller)) return #err("Not authorized");
    switch (HomepageLib.reorderHeroBanner(heroBanners, id, newOrder)) {
      case (?banner) { #ok(banner) };
      case null { #err("HeroBanner not found") };
    };
  };

  // ---- Admin FeaturedBlock API ----

  public shared query ({ caller }) func adminListFeaturedBlocks() : async [HomepageLib.FeaturedBlock] {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    HomepageLib.listAllFeaturedBlocks(featuredBlocks);
  };

  public shared ({ caller }) func adminAddFeaturedBlock(input : HomepageLib.FeaturedBlockInput) : async HomepageLib.FeaturedBlock {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    let block = HomepageLib.addFeaturedBlock(featuredBlocks, nextFeaturedBlockId, input);
    nextFeaturedBlockId += 1;
    block;
  };

  public shared ({ caller }) func adminUpdateFeaturedBlock(
    id : HomepageLib.FeaturedBlockId,
    input : HomepageLib.FeaturedBlockInput,
  ) : async { #ok : HomepageLib.FeaturedBlock; #err : Text } {
    if (not UserLib.isAdmin(users, caller)) return #err("Not authorized");
    switch (HomepageLib.updateFeaturedBlock(featuredBlocks, id, input)) {
      case (?block) { #ok(block) };
      case null { #err("FeaturedBlock not found") };
    };
  };

  public shared ({ caller }) func adminDeleteFeaturedBlock(id : HomepageLib.FeaturedBlockId) : async { #ok : Bool; #err : Text } {
    if (not UserLib.isAdmin(users, caller)) return #err("Not authorized");
    let deleted = HomepageLib.deleteFeaturedBlock(featuredBlocks, id);
    if (deleted) { #ok(true) } else { #err("FeaturedBlock not found") };
  };

};
