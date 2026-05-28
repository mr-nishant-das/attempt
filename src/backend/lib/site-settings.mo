module {
  public type HowItWorksStep = {
    title : Text;
    description : Text;
  };

  public type SiteSettings = {
    logoUrl : ?Text;
    faviconUrl : ?Text;
    // Optional fields — null means "use default" so old persisted values are compatible
    servicesAvailable : ?Bool;
    servicesUnavailableMessage : ?Text;
    videoByteUrl : ?Text;
    videoByteEnabled : ?Bool;
    videoByteTitle : ?Text;
    // Hero section
    heroTagline : ?Text;
    heroSubtitle : ?Text;
    // How it works steps
    howitworksSteps : ?[HowItWorksStep];
  };

  let DEFAULT_STEPS : [HowItWorksStep] = [
    { title = "Browse our catalog"; description = "Explore 100+ authentic Assamese products — food, textiles, art, and more." },
    { title = "Place your order"; description = "Add items to your cart, enter your delivery details, and choose your delivery speed." },
    { title = "Delivered to your door"; description = "We ship directly to you, wherever you are in the world." },
  ];

  public func empty() : SiteSettings {
    {
      logoUrl = null;
      faviconUrl = null;
      servicesAvailable = ?false;
      servicesUnavailableMessage = ?"Our services are temporarily unavailable but will resume soon. Thank you for your patience.";
      videoByteUrl = ?"";
      videoByteEnabled = ?false;
      videoByteTitle = ?"";
      heroTagline = ?"Authentic Assam, Delivered Anywhere";
      heroSubtitle = ?"Shop 100+ genuine Assamese products — from Muga silk to Assam tea — and get them delivered wherever you are.";
      howitworksSteps = ?DEFAULT_STEPS;
    };
  };

  public func getServicesAvailable(s : SiteSettings) : Bool {
    switch (s.servicesAvailable) { case (?v) v; case null false };
  };

  public func getServicesUnavailableMessage(s : SiteSettings) : Text {
    switch (s.servicesUnavailableMessage) {
      case (?v) v;
      case null "Our services are temporarily unavailable but will resume soon. Thank you for your patience.";
    };
  };

  public func getVideoByteUrl(s : SiteSettings) : Text {
    switch (s.videoByteUrl) { case (?v) v; case null "" };
  };

  public func getVideoByteEnabled(s : SiteSettings) : Bool {
    switch (s.videoByteEnabled) { case (?v) v; case null false };
  };

  public func getVideoByteTitle(s : SiteSettings) : Text {
    switch (s.videoByteTitle) { case (?v) v; case null "" };
  };

  public func getHeroTagline(s : SiteSettings) : Text {
    switch (s.heroTagline) { case (?v) v; case null "Authentic Assam, Delivered Anywhere" };
  };

  public func getHeroSubtitle(s : SiteSettings) : Text {
    switch (s.heroSubtitle) {
      case (?v) v;
      case null "Shop 100+ genuine Assamese products — from Muga silk to Assam tea — and get them delivered wherever you are.";
    };
  };

  public func getHowitworksSteps(s : SiteSettings) : [HowItWorksStep] {
    switch (s.howitworksSteps) { case (?v) v; case null DEFAULT_STEPS };
  };

  public func update(
    current : SiteSettings,
    logoUrl : ?Text,
    faviconUrl : ?Text,
  ) : SiteSettings {
    {
      current with
      logoUrl = logoUrl;
      faviconUrl = faviconUrl;
    };
  };

  public func updateHeroAndHowitworks(
    current : SiteSettings,
    heroTagline : Text,
    heroSubtitle : Text,
    howitworksSteps : [HowItWorksStep],
  ) : SiteSettings {
    {
      current with
      heroTagline = ?heroTagline;
      heroSubtitle = ?heroSubtitle;
      howitworksSteps = ?howitworksSteps;
    };
  };

  public func updateServicesAvailability(
    current : SiteSettings,
    available : Bool,
    message : Text,
  ) : SiteSettings {
    {
      current with
      servicesAvailable = ?available;
      servicesUnavailableMessage = ?message;
    };
  };

  public func updateVideoByte(
    current : SiteSettings,
    url : Text,
    enabled : Bool,
    title : Text,
  ) : SiteSettings {
    {
      current with
      videoByteUrl = ?url;
      videoByteEnabled = ?enabled;
      videoByteTitle = ?title;
    };
  };
};
