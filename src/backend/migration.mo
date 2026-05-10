// Migration: expand siteSettings to include new optional fields, and drop nextOrderId.
// Old stable fields (from .old/src/backend/dist/backend.most):
//   stable var nextOrderId : Nat
//   stable var siteSettings : {faviconUrl : ?Text; logoUrl : ?Text}
// New stable fields:
//   stable var siteSettings : SiteSettingsLib.SiteSettings (all new fields are ?T)
import SiteSettingsLib "lib/site-settings";

module {
  // Old types defined inline (from .old/src/backend/lib/site-settings.mo)
  type OldSiteSettings = { faviconUrl : ?Text; logoUrl : ?Text };

  type OldActor = {
    var nextOrderId : Nat;
    var siteSettings : OldSiteSettings;
  };

  type NewActor = {
    var siteSettings : SiteSettingsLib.SiteSettings;
  };

  public func run(old : OldActor) : NewActor {
    {
      var siteSettings = {
        faviconUrl = old.siteSettings.faviconUrl;
        logoUrl = old.siteSettings.logoUrl;
        servicesAvailable = ?false;
        servicesUnavailableMessage = ?"Our services are temporarily unavailable but will resume soon. Thank you for your patience.";
        videoByteEnabled = ?false;
        videoByteTitle = ?"";
        videoByteUrl = ?"";
      };
    };
  };
};
