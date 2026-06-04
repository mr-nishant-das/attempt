import ServicesLib "../lib/services";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";

mixin (
  serviceRequests : List.List<ServicesLib.ServiceRequest>,
  adminSessionState : { var token : ?Text; var expiry : Int },
) {

  var nextServiceRequestId : Nat = 1;

  func _adminAuthSvc(token : Text) : Bool {
    switch (adminSessionState.token) {
      case (?t) Text.equal(t, token) and Time.now() < adminSessionState.expiry;
      case null false;
    };
  };

  public shared ({ caller }) func submitServiceRequest(
    input : ServicesLib.CreateServiceRequestInput,
  ) : async ServicesLib.ServiceRequestPublic {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    let req = ServicesLib.submitRequest(serviceRequests, nextServiceRequestId, caller, input);
    nextServiceRequestId += 1;
    ServicesLib.toPublic(req);
  };

  public query func adminGetServiceRequests(adminToken : Text) : async [ServicesLib.ServiceRequestPublic] {
    if (not _adminAuthSvc(adminToken)) Runtime.trap("Unauthorized");
    ServicesLib.getAllRequests(serviceRequests);
  };

  public shared func adminUpdateServiceRequestStatus(
    adminToken : Text,
    id : Nat,
    status : ServicesLib.ServiceRequestStatus,
  ) : async ?ServicesLib.ServiceRequestPublic {
    if (not _adminAuthSvc(adminToken)) Runtime.trap("Unauthorized");
    ServicesLib.updateStatus(serviceRequests, id, status);
  };

  public shared func adminDeleteServiceRequest(adminToken : Text, id : Nat) : async Bool {
    if (not _adminAuthSvc(adminToken)) Runtime.trap("Unauthorized");
    ServicesLib.deleteRequest(serviceRequests, id);
  };

};
