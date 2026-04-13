import List "mo:core/List";
import NewTypes "./types/services";

module {
  // Old ServiceRequest type (before isRequestForSelf and recipient fields were added)
  type OldServiceRequestStatus = {
    #New;
    #Contacted;
    #Completed;
    #Cancelled;
  };

  type OldServiceType = {
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

  type OldServiceRequest = {
    id : Nat;
    userId : Text;
    userName : Text;
    userPhone : Text;
    serviceType : OldServiceType;
    preferredDate : Text;
    preferredTime : Text;
    description : Text;
    var status : OldServiceRequestStatus;
    submittedAt : Int;
    var lastUpdatedAt : Int;
  };

  type OldActor = {
    serviceRequests : List.List<OldServiceRequest>;
  };

  type NewActor = {
    serviceRequests : List.List<NewTypes.ServiceRequest>;
  };

  public func run(old : OldActor) : NewActor {
    let newRequests = List.empty<NewTypes.ServiceRequest>();
    old.serviceRequests.forEach(func(r : OldServiceRequest) {
      let migrated : NewTypes.ServiceRequest = {
        id = r.id;
        userId = r.userId;
        userName = r.userName;
        userPhone = r.userPhone;
        serviceType = r.serviceType;
        preferredDate = r.preferredDate;
        preferredTime = r.preferredTime;
        description = r.description;
        isRequestForSelf = true;
        recipientName = null;
        recipientPhone = null;
        recipientAddress = null;
        var status = r.status;
        submittedAt = r.submittedAt;
        var lastUpdatedAt = r.lastUpdatedAt;
      };
      newRequests.add(migrated);
    });
    { serviceRequests = newRequests };
  };
};
