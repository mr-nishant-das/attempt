import ServicesLib "../lib/services";
import UserLib "../lib/users";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

mixin (
  serviceRequests : List.List<ServicesLib.ServiceRequest>,
  users : List.List<UserLib.UserProfile>,
) {

  var nextServiceRequestId : Nat = 1;

  public shared ({ caller }) func submitServiceRequest(
    input : ServicesLib.CreateServiceRequestInput,
  ) : async ServicesLib.ServiceRequestPublic {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    let req = ServicesLib.submitRequest(serviceRequests, nextServiceRequestId, caller, input);
    nextServiceRequestId += 1;
    ServicesLib.toPublic(req);
  };

  public query ({ caller }) func adminGetServiceRequests() : async [ServicesLib.ServiceRequestPublic] {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    ServicesLib.getAllRequests(serviceRequests);
  };

  public shared ({ caller }) func adminUpdateServiceRequestStatus(
    id : Nat,
    status : ServicesLib.ServiceRequestStatus,
  ) : async ?ServicesLib.ServiceRequestPublic {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    ServicesLib.updateStatus(serviceRequests, id, status);
  };

  public shared ({ caller }) func adminDeleteServiceRequest(id : Nat) : async Bool {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    ServicesLib.deleteRequest(serviceRequests, id);
  };

};
