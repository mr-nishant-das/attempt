// migration.mo — explicit migration for two stable variables that gained new optional fields.
// Old types are defined inline (copied from .old/src/backend/) per migration skill rules.
import FooterTypes "types/footer";
import SiteSettingsLib "lib/site-settings";

module {
  // ---- Old types (inline copies from .old/src/backend/) ----

  type OldSocialLink = {
    platform : Text;
    url : Text;
    enabled : Bool;
  };

  type OldFooterSettings = {
    tagline : Text;
    copyright : Text;
    aboutContent : Text;
    socialLinks : [OldSocialLink];
  };

  type OldFooterState = {
    var footerSettings : OldFooterSettings;
    var nextReviewId : Nat;
  };

  type OldSiteSettings = {
    logoUrl : ?Text;
    faviconUrl : ?Text;
    servicesAvailable : ?Bool;
    servicesUnavailableMessage : ?Text;
    videoByteUrl : ?Text;
    videoByteEnabled : ?Bool;
    videoByteTitle : ?Text;
  };

  // ---- Migration input / output ----

  type OldActor = {
    footerState : OldFooterState;
    var siteSettings : OldSiteSettings;
  };

  type NewActor = {
    footerState : {
      var footerSettings : FooterTypes.FooterSettings;
      var nextReviewId : Nat;
    };
    var siteSettings : SiteSettingsLib.SiteSettings;
  };

  public func run(old : OldActor) : NewActor {
    let oldFs = old.footerState.footerSettings;
    let newFooterSettings : FooterTypes.FooterSettings = {
      tagline = oldFs.tagline;
      copyright = oldFs.copyright;
      aboutContent = oldFs.aboutContent;
      socialLinks = oldFs.socialLinks;
      policyContent = null; // new optional field — null means use default
    };
    let oldSs = old.siteSettings;
    let newSiteSettings : SiteSettingsLib.SiteSettings = {
      logoUrl = oldSs.logoUrl;
      faviconUrl = oldSs.faviconUrl;
      servicesAvailable = oldSs.servicesAvailable;
      servicesUnavailableMessage = oldSs.servicesUnavailableMessage;
      videoByteUrl = oldSs.videoByteUrl;
      videoByteEnabled = oldSs.videoByteEnabled;
      videoByteTitle = oldSs.videoByteTitle;
      heroTagline = null;      // new optional fields — null means use default
      heroSubtitle = null;
      howitworksSteps = null;
    };
    {
      footerState = {
        var footerSettings = newFooterSettings;
        var nextReviewId = old.footerState.nextReviewId;
      };
      var siteSettings = newSiteSettings;
    };
  };
};
