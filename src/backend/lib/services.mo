import Types "../types/services";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  public type ServiceRequest = Types.ServiceRequest;
  public type ServiceRequestPublic = Types.ServiceRequestPublic;
  public type ServiceRequestStatus = Types.ServiceRequestStatus;
  public type ServiceType = Types.ServiceType;
  public type CreateServiceRequestInput = Types.CreateServiceRequestInput;

  public func toPublic(r : ServiceRequest) : ServiceRequestPublic {
    {
      id = r.id;
      userId = r.userId;
      userName = r.userName;
      userPhone = r.userPhone;
      serviceType = r.serviceType;
      preferredDate = r.preferredDate;
      preferredTime = r.preferredTime;
      description = r.description;
      isRequestForSelf = r.isRequestForSelf;
      recipientName = r.recipientName;
      recipientPhone = r.recipientPhone;
      recipientAddress = r.recipientAddress;
      status = r.status;
      submittedAt = r.submittedAt;
      lastUpdatedAt = r.lastUpdatedAt;
    };
  };

  public func submitRequest(
    serviceRequests : List.List<ServiceRequest>,
    nextId : Nat,
    caller : Principal,
    input : CreateServiceRequestInput,
  ) : ServiceRequest {
    let now = Time.now();
    let req : ServiceRequest = {
      id = nextId;
      userId = caller.toText();
      userName = input.userName;
      userPhone = input.userPhone;
      serviceType = input.serviceType;
      preferredDate = input.preferredDate;
      preferredTime = input.preferredTime;
      description = input.description;
      isRequestForSelf = input.isRequestForSelf;
      recipientName = input.recipientName;
      recipientPhone = input.recipientPhone;
      recipientAddress = input.recipientAddress;
      var status = #New;
      submittedAt = now;
      var lastUpdatedAt = now;
    };
    serviceRequests.add(req);
    req;
  };

  public func getAllRequests(serviceRequests : List.List<ServiceRequest>) : [ServiceRequestPublic] {
    serviceRequests.toArray().map<ServiceRequest, ServiceRequestPublic>(toPublic);
  };

  public func getRequestById(serviceRequests : List.List<ServiceRequest>, id : Nat) : ?ServiceRequestPublic {
    switch (serviceRequests.find(func(r : ServiceRequest) : Bool { Nat.equal(r.id, id) })) {
      case (?r) ?toPublic(r);
      case null null;
    };
  };

  public func updateStatus(
    serviceRequests : List.List<ServiceRequest>,
    id : Nat,
    status : ServiceRequestStatus,
  ) : ?ServiceRequestPublic {
    var updated : ?ServiceRequestPublic = null;
    let now = Time.now();
    serviceRequests.forEach(func(r : ServiceRequest) {
      if (r.id == id) {
        r.status := status;
        r.lastUpdatedAt := now;
        updated := ?toPublic(r);
      };
    });
    updated;
  };

  public func deleteRequest(serviceRequests : List.List<ServiceRequest>, id : Nat) : Bool {
    let before = serviceRequests.size();
    let kept = serviceRequests.filter(func(r : ServiceRequest) : Bool { not Nat.equal(r.id, id) });
    serviceRequests.clear();
    serviceRequests.append(kept);
    serviceRequests.size() < before;
  };
};
