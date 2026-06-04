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
import FooterLib "lib/footer";
import FooterMixin "mixins/footer-api";
import FooterTypes "types/footer";
import Map "mo:core/Map";
import OtpTypes "types/otp";
import VendorTypes "types/vendors";
import OtpMixin "mixins/otp-api";
import VendorsMixin "mixins/vendors-api";
import VendorProductsMixin "mixins/vendor-products-api";
import VendorProductTypes "types/vendor-products";









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
  // --- Footer state ---
  let reviews = List.empty<FooterTypes.CustomerReview>();
  let footerState = { var footerSettings : FooterTypes.FooterSettings = FooterLib.defaultFooterSettings(); var nextReviewId : Nat = 0 };

  // --- Site settings: declared directly at actor level for migration compatibility ---
  var siteSettings : SiteSettingsLib.SiteSettings = SiteSettingsLib.empty();

  // --- Auth/OTP state ---
  let otpStore = Map.empty<Text, OtpTypes.OtpRecord>();
  let adminOtpStore = Map.empty<Text, OtpTypes.OtpRecord>();
  // --- Vendor session store: token -> { email; expiresAt } ---
  let vendorSessionStore = Map.empty<Text, { email : Text; expiresAt : Int }>();

  // --- Admin session shared state (passed to all mixins needing token-based auth) ---
  let adminSessionState = { var token : ?Text = null; var expiry : Int = 0 };

  // --- Vendor state ---
  let vendors = List.empty<VendorTypes.Vendor>();
  let vendorApprovalTokens = Map.empty<Text, VendorTypes.VendorApprovalToken>();

  // --- Vendor products state ---
  let vendorProducts = List.empty<VendorProductTypes.VendorProduct>();
  let vendorProductState = { var nextId : Nat = 1 };
  // IDs for vendor-approved catalog products start at 100_000 to avoid collision with admin-added products
  let catalogVendorProductIdState = { var nextId : Nat = 100_000 };

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
  include ProductsMixin(products, categories, adminSessionState);
  include UsersMixin(users);
  include CartMixin(carts);
  include OrdersMixin(orders, products, users, carts);
  include ServicesMixin(serviceRequests, adminSessionState);
  include HomepageContentMixin(heroBanners, featuredBlocks, adminSessionState);
  include MixinObjectStorage();
  include ImageStorageMixin(adminSessionState);
  include RazorpayMixin();
  include OtpMixin(otpStore, users, adminOtpStore, adminSessionState);
  include VendorsMixin(vendors, otpStore, vendorApprovalTokens, adminSessionState, vendorSessionStore);
  include VendorProductsMixin(vendorProducts, vendorProductState, vendors, products, catalogVendorProductIdState, adminSessionState, vendorSessionStore);
  include AdminMixin(users, adminSessionState);
  include FooterMixin(reviews, footerState, adminSessionState);

  // --- Site settings public API (inline because siteSettings must be a direct actor field) ---

  public query func getSiteSettings() : async {
    logoUrl : ?Text;
    faviconUrl : ?Text;
    heroTagline : Text;
    heroSubtitle : Text;
    howitworksSteps : [SiteSettingsLib.HowItWorksStep];
  } {
    {
      logoUrl = siteSettings.logoUrl;
      faviconUrl = siteSettings.faviconUrl;
      heroTagline = SiteSettingsLib.getHeroTagline(siteSettings);
      heroSubtitle = SiteSettingsLib.getHeroSubtitle(siteSettings);
      howitworksSteps = SiteSettingsLib.getHowitworksSteps(siteSettings);
    };
  };

  public shared func adminUpdateSiteSettings(
    adminToken : Text,
    logoUrl : ?Text,
    faviconUrl : ?Text,
  ) : async { logoUrl : ?Text; faviconUrl : ?Text } {
    if (not _checkAdminAuth(adminToken)) Runtime.trap("Unauthorized");
    siteSettings := SiteSettingsLib.update(siteSettings, logoUrl, faviconUrl);
    { logoUrl = siteSettings.logoUrl; faviconUrl = siteSettings.faviconUrl };
  };

  public shared func adminUpdateHeroAndHowitworks(
    adminToken : Text,
    heroTagline : Text,
    heroSubtitle : Text,
    howitworksSteps : [SiteSettingsLib.HowItWorksStep],
  ) : async () {
    if (not _checkAdminAuth(adminToken)) Runtime.trap("Unauthorized");
    siteSettings := SiteSettingsLib.updateHeroAndHowitworks(siteSettings, heroTagline, heroSubtitle, howitworksSteps);
  };

  public query func getServicesAvailability() : async { available : Bool; message : Text } {
    {
      available = SiteSettingsLib.getServicesAvailable(siteSettings);
      message = SiteSettingsLib.getServicesUnavailableMessage(siteSettings);
    };
  };

  public shared func adminUpdateServicesAvailability(
    adminToken : Text,
    available : Bool,
    message : Text,
  ) : async () {
    if (not _checkAdminAuth(adminToken)) Runtime.trap("Unauthorized");
    siteSettings := SiteSettingsLib.updateServicesAvailability(siteSettings, available, message);
  };

  public query func getVideoByte() : async { url : Text; enabled : Bool; title : Text } {
    {
      url = SiteSettingsLib.getVideoByteUrl(siteSettings);
      enabled = SiteSettingsLib.getVideoByteEnabled(siteSettings);
      title = SiteSettingsLib.getVideoByteTitle(siteSettings);
    };
  };

  public shared func adminUpdateVideoByte(
    adminToken : Text,
    url : Text,
    enabled : Bool,
    title : Text,
  ) : async () {
    if (not _checkAdminAuth(adminToken)) Runtime.trap("Unauthorized");
    siteSettings := SiteSettingsLib.updateVideoByte(siteSettings, url, enabled, title);
  };
};
