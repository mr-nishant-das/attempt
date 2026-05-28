import List "mo:core/List";
import Runtime "mo:core/Runtime";
import UserLib "../lib/users";
import FooterLib "../lib/footer";
import Types "../types/footer";

mixin (
  users : List.List<UserLib.UserProfile>,
  reviews : List.List<Types.CustomerReview>,
  footerState : { var footerSettings : Types.FooterSettings; var nextReviewId : Nat },
) {

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

  public shared ({ caller }) func adminUpdateFooterSettings(
    tagline : Text,
    copyright : Text,
    aboutContent : Text,
    socialLinks : [Types.SocialLink],
  ) : async Bool {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    footerState.footerSettings := FooterLib.updateFooterSettings(
      footerState.footerSettings,
      tagline,
      copyright,
      aboutContent,
      socialLinks,
    );
    true;
  };

  public shared ({ caller }) func adminUpdatePolicyContent(policyContent : Text) : async Bool {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    footerState.footerSettings := FooterLib.updatePolicyContent(footerState.footerSettings, policyContent);
    true;
  };

  // --- Customer reviews ---

  public query func getReviews() : async [Types.CustomerReview] {
    FooterLib.getReviews(reviews);
  };

  public shared ({ caller }) func adminAddReview(
    reviewerName : Text,
    rating : Nat,
    reviewText : Text,
    productName : Text,
  ) : async Nat {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    FooterLib.addReview(reviews, footerState, reviewerName, rating, reviewText, productName);
  };

  public shared ({ caller }) func adminUpdateReview(
    id : Nat,
    reviewerName : Text,
    rating : Nat,
    reviewText : Text,
    productName : Text,
  ) : async Bool {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    FooterLib.updateReview(reviews, id, reviewerName, rating, reviewText, productName);
  };

  public shared ({ caller }) func adminDeleteReview(id : Nat) : async Bool {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    FooterLib.deleteReview(reviews, id);
  };

};
