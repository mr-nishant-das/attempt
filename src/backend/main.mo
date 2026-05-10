import List "mo:core/List";
import ProductLib "lib/products-catalog";
import UserLib "lib/users";
import CartLib "lib/cart";
import OrderLib "lib/orders";
import ServicesLib "lib/services";
import HomepageLib "lib/homepage-content";
import SiteSettingsLib "lib/site-settings";
import Runtime "mo:core/Runtime";
import ProductsMixin "mixins/products-catalog-api";
import UsersMixin "mixins/users-api";
import CartMixin "mixins/cart-api";
import OrdersMixin "mixins/orders-api";
import ServicesMixin "mixins/services-api";
import HomepageContentMixin "mixins/homepage-content-api";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import ImageStorageMixin "mixins/image-storage-api";
import RazorpayMixin "mixins/razorpay-api";
import AdminMixin "mixins/admin-session-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  // --- Shared state ---
  let categories = List.empty<ProductLib.Category>();
  let products = List.empty<ProductLib.Product>();
  let users = List.empty<UserLib.UserProfile>();
  let carts = List.empty<CartLib.Cart>();
  let orders = List.empty<OrderLib.Order>();
  let serviceRequests = List.empty<ServicesLib.ServiceRequest>();
  let heroBanners = List.empty<HomepageLib.HeroBanner>();
  let featuredBlocks = List.empty<HomepageLib.FeaturedBlock>();

  // --- Site settings: declared directly at actor level for migration compatibility ---
  var siteSettings : SiteSettingsLib.SiteSettings = SiteSettingsLib.empty();

  // --- Seed data on first run ---
  do {
    if (categories.isEmpty()) {
      ignore ProductLib.seedCategories(categories, 1);
      ignore ProductLib.seedProducts(products, categories, 1);
    };
    if (heroBanners.isEmpty()) {
      ignore HomepageLib.seedHeroBanners(heroBanners, 1);
    };
  };

  // --- Include mixins ---
  include ProductsMixin(products, categories, users);
  include UsersMixin(users);
  include CartMixin(carts);
  include OrdersMixin(orders, products, users, carts);
  include ServicesMixin(serviceRequests, users);
  include HomepageContentMixin(heroBanners, featuredBlocks, users);
  include MixinObjectStorage();
  include ImageStorageMixin(users);
  include RazorpayMixin();
  include AdminMixin(users);

  // --- Site settings public API (inline because siteSettings must be a direct actor field) ---

  public query func getSiteSettings() : async { logoUrl : ?Text; faviconUrl : ?Text } {
    { logoUrl = siteSettings.logoUrl; faviconUrl = siteSettings.faviconUrl };
  };

  public shared ({ caller }) func adminUpdateSiteSettings(
    logoUrl : ?Text,
    faviconUrl : ?Text,
  ) : async { logoUrl : ?Text; faviconUrl : ?Text } {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    siteSettings := SiteSettingsLib.update(siteSettings, logoUrl, faviconUrl);
    { logoUrl = siteSettings.logoUrl; faviconUrl = siteSettings.faviconUrl };
  };

  public query func getServicesAvailability() : async { available : Bool; message : Text } {
    {
      available = SiteSettingsLib.getServicesAvailable(siteSettings);
      message = SiteSettingsLib.getServicesUnavailableMessage(siteSettings);
    };
  };

  public shared ({ caller }) func adminUpdateServicesAvailability(
    available : Bool,
    message : Text,
  ) : async () {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    siteSettings := SiteSettingsLib.updateServicesAvailability(siteSettings, available, message);
  };

  public query func getVideoByte() : async { url : Text; enabled : Bool; title : Text } {
    {
      url = SiteSettingsLib.getVideoByteUrl(siteSettings);
      enabled = SiteSettingsLib.getVideoByteEnabled(siteSettings);
      title = SiteSettingsLib.getVideoByteTitle(siteSettings);
    };
  };

  public shared ({ caller }) func adminUpdateVideoByte(
    url : Text,
    enabled : Bool,
    title : Text,
  ) : async () {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    siteSettings := SiteSettingsLib.updateVideoByte(siteSettings, url, enabled, title);
  };
};
