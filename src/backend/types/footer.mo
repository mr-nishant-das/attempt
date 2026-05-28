module {
  public type SocialLink = {
    platform : Text;
    url : Text;
    enabled : Bool;
  };

  public type FooterSettings = {
    tagline : Text;
    copyright : Text;
    aboutContent : Text;
    socialLinks : [SocialLink];
    policyContent : ?Text; // optional for upgrade compatibility; null means use default
  };

  public type CustomerReviewId = Nat;

  public type CustomerReview = {
    id : CustomerReviewId;
    reviewerName : Text;
    rating : Nat;
    reviewText : Text;
    productName : Text;
    createdAt : Int;
  };
};
