module {
  public type ServiceType = {
    #Ambulance;
    #Doctors;
    #Medicines;
    #FoodDelivery;
    #Taxi;
    #EventManagement;
    #FuneralServices;
    #WeddingsAnniversaries;
    #Gifting;
    #VideoConferencing;
    #SchoolAdmissions;
    #Tourism;
    #Other;
  };

  public type ServiceRequestStatus = {
    #New;
    #Contacted;
    #Completed;
    #Cancelled;
  };

  public type ServiceRequest = {
    id : Nat;
    userId : Text;
    userName : Text;
    userPhone : Text;
    serviceType : ServiceType;
    preferredDate : Text;
    preferredTime : Text;
    description : Text;
    isRequestForSelf : Bool;
    recipientName : ?Text;
    recipientPhone : ?Text;
    recipientAddress : ?Text;
    var status : ServiceRequestStatus;
    submittedAt : Int;
    var lastUpdatedAt : Int;
  };

  public type CreateServiceRequestInput = {
    userName : Text;
    userPhone : Text;
    serviceType : ServiceType;
    preferredDate : Text;
    preferredTime : Text;
    description : Text;
    isRequestForSelf : Bool;
    recipientName : ?Text;
    recipientPhone : ?Text;
    recipientAddress : ?Text;
  };

  public type ServiceRequestPublic = {
    id : Nat;
    userId : Text;
    userName : Text;
    userPhone : Text;
    serviceType : ServiceType;
    preferredDate : Text;
    preferredTime : Text;
    description : Text;
    isRequestForSelf : Bool;
    recipientName : ?Text;
    recipientPhone : ?Text;
    recipientAddress : ?Text;
    status : ServiceRequestStatus;
    submittedAt : Int;
    lastUpdatedAt : Int;
  };
};
