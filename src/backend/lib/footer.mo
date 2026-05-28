import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/footer";

module {
  public type FooterSettings = Types.FooterSettings;
  public type SocialLink = Types.SocialLink;
  public type CustomerReview = Types.CustomerReview;

  // --- Footer settings helpers ---

  func defaultPolicy() : Text {
    "<h2>Return &amp; Refund Policy</h2>"
    # "<p>We want you to be completely happy with your AssamRoots purchase. Please read our policy carefully before placing an order.</p>"
    # "<h3>7-Day Return Window</h3>"
    # "<p>You may request a return within 7 days of delivery for eligible items. Items must be unused, in their original packaging, and in the same condition as received.</p>"
    # "<h3>Non-Returnable Items</h3>"
    # "<p>Food products, perishable items, spices, and edible goods are <strong>non-returnable</strong> due to hygiene and safety reasons. Please check product descriptions carefully before purchasing.</p>"
    # "<h3>Damaged or Defective Goods</h3>"
    # "<p>If your item arrives damaged or defective, please contact us within 48 hours of delivery with a photograph of the damage. We will arrange a replacement or full refund at no additional cost to you.</p>"
    # "<h3>How to Initiate a Return</h3>"
    # "<p>To initiate a return or report a damaged item, email us at <a href='mailto:assamshop@assamroots.shop'>assamshop@assamroots.shop</a> with your order number and a brief description of the issue. Our team will respond within 2 business days.</p>"
    # "<h3>Refund Processing</h3>"
    # "<p>Approved refunds are processed within 7-10 business days and credited back to your original payment method. Cash-on-delivery refunds are issued via bank transfer.</p>";
  };

  public func defaultFooterSettings() : FooterSettings {
    {
      tagline = "Bringing Assam to the World";
      copyright = "\u{A9} 2026 AssamRoots. All rights reserved.";
      aboutContent = "AssamRoots is an Assamese-first commerce and community platform, connecting Assamese people\u{2014}especially the diaspora\u{2014}with authentic Assamese products and services.";
      socialLinks = [
        { platform = "Instagram"; url = ""; enabled = false },
        { platform = "Facebook";  url = ""; enabled = false },
        { platform = "WhatsApp";  url = ""; enabled = false },
        { platform = "YouTube";   url = ""; enabled = false },
      ];
      policyContent = ?defaultPolicy();
    };
  };

  public func updateFooterSettings(
    current : FooterSettings,
    tagline : Text,
    copyright : Text,
    aboutContent : Text,
    socialLinks : [SocialLink],
  ) : FooterSettings {
    { current with tagline; copyright; aboutContent; socialLinks };
  };

  public func updatePolicyContent(
    current : FooterSettings,
    policyContent : Text,
  ) : FooterSettings {
    { current with policyContent = ?policyContent };
  };

  public func getPolicyContent(s : FooterSettings) : Text {
    switch (s.policyContent) { case (?v) v; case null defaultPolicy() };
  };

  // --- Customer reviews CRUD ---

  public func addReview(
    reviews : List.List<CustomerReview>,
    state : { var nextReviewId : Nat },
    reviewerName : Text,
    rating : Nat,
    reviewText : Text,
    productName : Text,
  ) : Nat {
    let id = state.nextReviewId;
    state.nextReviewId += 1;
    reviews.add({
      id;
      reviewerName;
      rating;
      reviewText;
      productName;
      createdAt = Time.now();
    });
    id;
  };

  public func updateReview(
    reviews : List.List<CustomerReview>,
    id : Nat,
    reviewerName : Text,
    rating : Nat,
    reviewText : Text,
    productName : Text,
  ) : Bool {
    var found = false;
    reviews.mapInPlace(
      func(r) {
        if (r.id == id) {
          found := true;
          { r with reviewerName; rating; reviewText; productName };
        } else { r };
      }
    );
    found;
  };

  public func deleteReview(
    reviews : List.List<CustomerReview>,
    id : Nat,
  ) : Bool {
    let before = reviews.size();
    reviews.retain(func(r) { r.id != id });
    reviews.size() < before;
  };

  public func getReviews(reviews : List.List<CustomerReview>) : [CustomerReview] {
    reviews.toArray();
  };
};
