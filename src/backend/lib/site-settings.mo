module {
  public type SiteSettings = {
    logoUrl : ?Text;
    faviconUrl : ?Text;
    // Optional fields — null means "use default" so old persisted values are compatible
    servicesAvailable : ?Bool;
    servicesUnavailableMessage : ?Text;
    videoByteUrl : ?Text;
    videoByteEnabled : ?Bool;
    videoByteTitle : ?Text;
  };

  public func empty() : SiteSettings {
    {
      logoUrl = null;
      faviconUrl = null;
      servicesAvailable = ?false;
      servicesUnavailableMessage = ?"Our services are temporarily unavailable but will resume soon. Thank you for your patience.";
      videoByteUrl = ?"";
      videoByteEnabled = ?false;
      videoByteTitle = ?"";
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
