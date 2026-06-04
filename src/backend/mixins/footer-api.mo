import List "mo:core/List";
import Runtime "mo:core/Runtime";
import FooterLib "../lib/footer";
import Types "../types/footer";
import Text "mo:core/Text";
import Time "mo:core/Time";

mixin (
  reviews : List.List<Types.CustomerReview>,
  footerState : { var footerSettings : Types.FooterSettings; var nextReviewId : Nat },
  adminSessionState : { var token : ?Text; var expiry : Int },
) {

  func _adminAuthFT(token : Text) : Bool {
    switch (adminSessionState.token) {
      case (?t) Text.equal(t, token) and Time.now() < adminSessionState.expiry;
      case null false;
    };
  };

  // --- Footer settings ---

  public query func getFooterSettings() : async {
    tagline : Text;
    copyright : Text;
    aboutContent : Text;
    socialLinks : [Types.SocialLink];
    policyContent : Text;
  } {
    let fs = footerState.footerSettings;
    {
      tagline = fs.tagline;
      copyright = fs.copyright;
      aboutContent = fs.aboutContent;
      socialLinks = fs.socialLinks;
      policyContent = FooterLib.getPolicyContent(fs);
    };
  };

  public shared func adminUpdateFooterSettings(
    adminToken : Text,
    tagline : Text,
    copyright : Text,
    aboutContent : Text,
    socialLinks : [Types.SocialLink],
  ) : async Bool {
    if (not _adminAuthFT(adminToken)) Runtime.trap("Unauthorized");
    footerState.footerSettings := FooterLib.updateFooterSettings(
      footerState.footerSettings,
      tagline,
      copyright,
      aboutContent,
      socialLinks,
    );
    true;
  };

  public shared func adminUpdatePolicyContent(adminToken : Text, policyContent : Text) : async Bool {
    if (not _adminAuthFT(adminToken)) Runtime.trap("Unauthorized");
    footerState.footerSettings := FooterLib.updatePolicyContent(footerState.footerSettings, policyContent);
    true;
  };

  // --- Customer reviews ---

  public query func getReviews() : async [Types.CustomerReview] {
    FooterLib.getReviews(reviews);
  };

  public shared func adminAddReview(
    adminToken : Text,
    reviewerName : Text,
    rating : Nat,
    reviewText : Text,
    productName : Text,
  ) : async Nat {
    if (not _adminAuthFT(adminToken)) Runtime.trap("Unauthorized");
    FooterLib.addReview(reviews, footerState, reviewerName, rating, reviewText, productName);
  };

  public shared func adminUpdateReview(
    adminToken : Text,
    id : Nat,
    reviewerName : Text,
    rating : Nat,
    reviewText : Text,
    productName : Text,
  ) : async Bool {
    if (not _adminAuthFT(adminToken)) Runtime.trap("Unauthorized");
    FooterLib.updateReview(reviews, id, reviewerName, rating, reviewText, productName);
  };

  public shared func adminDeleteReview(adminToken : Text, id : Nat) : async Bool {
    if (not _adminAuthFT(adminToken)) Runtime.trap("Unauthorized");
    FooterLib.deleteReview(reviews, id);
  };

};
