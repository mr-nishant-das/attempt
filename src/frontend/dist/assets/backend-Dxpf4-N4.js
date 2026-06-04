var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, o as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, p as lookupResultToBuffer, q as RequestStatusResponseStatus, U as UnknownError, t as RequestStatusDoneNoReplyErrorCode, v as RejectError, w as CertifiedRejectErrorCode, x as UNREACHABLE_ERROR, I as InputError, y as InvalidReadStateRequestErrorCode, z as ReadRequestType, A as Principal, B as IDL, D as MissingCanisterIdErrorCode, H as HttpAgent, F as encode, Q as QueryResponseStatus, G as UncertifiedRejectErrorCode, J as isV3ResponseBody, K as isV2ResponseBody, N as UncertifiedRejectUpdateErrorCode, O as UnexpectedErrorCode, V as decode, W as Record, X as Opt, Y as Vec, Z as Variant, _ as Nat, $ as Service, a0 as Func, a1 as Text, a2 as Principal$1, a3 as Nat8, a4 as Null, a5 as Bool, a6 as Int, a7 as Float64 } from "./index-CstiQ4sz.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a = agent.createReadStateRequest) == null ? void 0 : _a.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a, _b;
      options = {
        ...options,
        ...(_b = (_a = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a, _b;
      options = {
        ...options,
        ...(_b = (_a = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
const _ImmutableObjectStorageCreateCertificateResult = Record({
  "method": Text,
  "blob_hash": Text
});
const _ImmutableObjectStorageRefillInformation = Record({
  "proposed_top_up_amount": Opt(Nat)
});
const _ImmutableObjectStorageRefillResult = Record({
  "success": Opt(Bool),
  "topped_up_amount": Opt(Nat)
});
const Address = Record({
  "city": Text,
  "name": Text,
  "line1": Text,
  "line2": Text,
  "state": Text,
  "isDefault": Bool,
  "phone": Text,
  "pincode": Text
});
const UserId = Principal$1;
const UserProfilePublic = Record({
  "id": UserId,
  "name": Text,
  "createdAt": Int,
  "email": Text,
  "updatedAt": Int,
  "addresses": Vec(Address),
  "isAdmin": Bool,
  "phone": Text
});
const CartItem = Record({
  "productId": Nat,
  "addedAt": Int,
  "quantity": Nat
});
const CartPublic = Record({
  "userId": Principal$1,
  "updatedAt": Int,
  "items": Vec(CartItem)
});
const CategoryId = Nat;
const SubCategoryId = Nat;
const SubCategory = Record({
  "id": SubCategoryId,
  "name": Text,
  "imageUrl": Text
});
const Category = Record({
  "id": CategoryId,
  "name": Text,
  "slug": Text,
  "description": Text,
  "imageUrl": Text,
  "subCategories": Vec(SubCategory)
});
const FeaturedBlockInput = Record({
  "title": Text,
  "content": Text,
  "thumbnailUrl": Text,
  "order": Nat,
  "isActive": Bool,
  "contentImages": Vec(Text)
});
const FeaturedBlockId = Nat;
const FeaturedBlock = Record({
  "id": FeaturedBlockId,
  "title": Text,
  "content": Text,
  "thumbnailUrl": Text,
  "order": Nat,
  "createdAt": Int,
  "isActive": Bool,
  "contentImages": Vec(Text)
});
const HeroBannerInput = Record({
  "title": Text,
  "order": Nat,
  "isActive": Bool,
  "imageUrl": Text,
  "ctaSlug": Text,
  "ctaText": Text,
  "durationSeconds": Nat,
  "subtitle": Text
});
const HeroBannerId = Nat;
const HeroBanner = Record({
  "id": HeroBannerId,
  "title": Text,
  "order": Nat,
  "isActive": Bool,
  "imageUrl": Text,
  "ctaSlug": Text,
  "ctaText": Text,
  "durationSeconds": Nat,
  "subtitle": Text
});
const ProductInput = Record({
  "subCategory": Text,
  "title": Text,
  "imageUrls": Vec(Text),
  "tags": Vec(Text),
  "description": Text,
  "discountPercent": Nat,
  "stock": Nat,
  "category": CategoryId,
  "brand": Text,
  "rating": Nat,
  "price": Nat,
  "reviewCount": Nat
});
const ProductId = Nat;
const Product = Record({
  "id": ProductId,
  "subCategory": Text,
  "title": Text,
  "imageUrls": Vec(Text),
  "createdAt": Int,
  "tags": Vec(Text),
  "description": Text,
  "discountPercent": Nat,
  "isActive": Bool,
  "updatedAt": Int,
  "stock": Nat,
  "category": CategoryId,
  "brand": Text,
  "rating": Nat,
  "price": Nat,
  "reviewCount": Nat
});
const VendorType$1 = Variant({
  "rawMaterial": Null,
  "brand": Null
});
const VendorProductView = Record({
  "id": Nat,
  "moq": Opt(Nat),
  "mrp": Opt(Nat),
  "finalPrice": Opt(Nat),
  "status": Variant({
    "pending": Null,
    "approved": Null,
    "rejected": Null
  }),
  "packagingCost": Opt(Nat),
  "taxPercent": Opt(Nat),
  "imageUrls": Vec(Text),
  "fssaiDocumentUrl": Opt(Text),
  "pricePerKg": Opt(Nat),
  "rejectionReason": Opt(Text),
  "supplyPrice": Opt(Nat),
  "submittedAt": Int,
  "description": Text,
  "productName": Text,
  "reviewedAt": Opt(Int),
  "availableQuantityKg": Opt(Nat),
  "vendorId": Principal$1,
  "category": Text,
  "basePrice": Nat,
  "vendorEmail": Text,
  "vendorName": Text,
  "vendorType": VendorType$1
});
const OrderId = Nat;
const OrderStatus$1 = Variant({
  "Delivered": Null,
  "Confirmed": Null,
  "Cancelled": Null,
  "Processing": Null,
  "Shipped": Null,
  "OutForDelivery": Null
});
const DeliveryAddress = Record({
  "street": Text,
  "city": Text,
  "name": Text,
  "district": Text,
  "state": Text,
  "landmark": Text,
  "phone": Text,
  "pincode": Text,
  "locality": Text,
  "houseNo": Text
});
const ShipmentUpdate = Record({
  "status": OrderStatus$1,
  "message": Text,
  "timestamp": Int
});
const DeliveryType$1 = Variant({
  "Standard": Null,
  "Express": Null
});
const OrderItem = Record({
  "title": Text,
  "discountPercent": Nat,
  "productId": Nat,
  "imageUrl": Text,
  "quantity": Nat,
  "price": Nat
});
const OrderPublic = Record({
  "id": OrderId,
  "status": OrderStatus$1,
  "deliveryAddress": DeliveryAddress,
  "shipmentUpdates": Vec(ShipmentUpdate),
  "paymentMethod": Text,
  "userId": Principal$1,
  "createdAt": Int,
  "estimatedDelivery": Opt(Int),
  "deliveryCost": Nat,
  "deliveryType": DeliveryType$1,
  "updatedAt": Int,
  "totalAmount": Nat,
  "items": Vec(OrderItem)
});
const ServiceRequestStatus$1 = Variant({
  "New": Null,
  "Contacted": Null,
  "Cancelled": Null,
  "Completed": Null
});
const ServiceType$1 = Variant({
  "Ambulance": Null,
  "FoodDelivery": Null,
  "Taxi": Null,
  "SchoolAdmissions": Null,
  "Medicines": Null,
  "Gifting": Null,
  "FuneralServices": Null,
  "Tourism": Null,
  "Doctors": Null,
  "VideoConferencing": Null,
  "EventManagement": Null,
  "WeddingsAnniversaries": Null,
  "Other": Null
});
const ServiceRequestPublic = Record({
  "id": Nat,
  "status": ServiceRequestStatus$1,
  "userName": Text,
  "serviceType": ServiceType$1,
  "userId": Text,
  "recipientPhone": Opt(Text),
  "submittedAt": Int,
  "description": Text,
  "userPhone": Text,
  "lastUpdatedAt": Int,
  "isRequestForSelf": Bool,
  "preferredDate": Text,
  "preferredTime": Text,
  "recipientAddress": Opt(Text),
  "recipientName": Opt(Text)
});
const VendorStatus = Variant({
  "pending": Null,
  "approved": Null,
  "rejected": Null,
  "suspended": Null
});
const VendorSummary = Record({
  "id": Principal$1,
  "bankAccountNumber": Text,
  "categories": Vec(Text),
  "status": VendorStatus,
  "assignedProductIds": Vec(Text),
  "ifscCode": Text,
  "fssaiDocumentUrl": Opt(Text),
  "approvedAt": Opt(Int),
  "businessName": Text,
  "address": Text,
  "contactEmail": Text,
  "brandName": Opt(Text),
  "phone": Text,
  "packagingDetails": Opt(Text),
  "registeredAt": Int,
  "vendorType": VendorType$1,
  "gstinNumber": Opt(Text)
});
const SocialLink = Record({
  "url": Text,
  "platform": Text,
  "enabled": Bool
});
const HowItWorksStep = Record({
  "title": Text,
  "description": Text
});
const CreateOrderInput = Record({
  "deliveryAddress": DeliveryAddress,
  "paymentMethod": Text,
  "deliveryCost": Nat,
  "deliveryType": DeliveryType$1,
  "items": Vec(
    Record({ "productId": Nat, "quantity": Nat })
  )
});
const VendorOrderSummary = Record({
  "productId": Text,
  "productName": Text,
  "orderId": Text,
  "placedAt": Int,
  "quantity": Nat,
  "totalPrice": Float64
});
const VendorProfile = Record({
  "id": Principal$1,
  "bankAccountNumber": Text,
  "categories": Vec(Text),
  "status": VendorStatus,
  "assignedProductIds": Vec(Text),
  "ifscCode": Text,
  "fssaiDocumentUrl": Opt(Text),
  "approvedAt": Opt(Int),
  "businessName": Text,
  "address": Text,
  "contactEmail": Text,
  "brandName": Opt(Text),
  "phone": Text,
  "packagingDetails": Opt(Text),
  "registeredAt": Int,
  "vendorType": VendorType$1,
  "gstinNumber": Opt(Text)
});
const CustomerReviewId = Nat;
const CustomerReview = Record({
  "id": CustomerReviewId,
  "createdAt": Int,
  "reviewText": Text,
  "reviewerName": Text,
  "productName": Text,
  "rating": Nat
});
const ProductFilter = Record({
  "categoryId": Opt(CategoryId),
  "inStockOnly": Bool,
  "offset": Nat,
  "maxPrice": Opt(Nat),
  "limit": Nat,
  "searchTerm": Opt(Text),
  "minPrice": Opt(Nat)
});
const ProductListResult = Record({
  "total": Nat,
  "products": Vec(Product)
});
const http_header = Record({
  "value": Text,
  "name": Text
});
const http_request_result = Record({
  "status": Nat,
  "body": Vec(Nat8),
  "headers": Vec(http_header)
});
const TransformationInput = Record({
  "context": Vec(Nat8),
  "response": http_request_result
});
const TransformationOutput = Record({
  "status": Nat,
  "body": Vec(Nat8),
  "headers": Vec(http_header)
});
const VendorRegistration = Record({
  "bankAccountNumber": Text,
  "categories": Vec(Text),
  "ifscCode": Text,
  "fssaiDocumentUrl": Opt(Text),
  "businessName": Text,
  "address": Text,
  "contactEmail": Text,
  "brandName": Opt(Text),
  "phone": Text,
  "packagingDetails": Opt(Text),
  "vendorType": VendorType$1,
  "gstinNumber": Opt(Text)
});
const CreateServiceRequestInput = Record({
  "userName": Text,
  "serviceType": ServiceType$1,
  "recipientPhone": Opt(Text),
  "description": Text,
  "userPhone": Text,
  "isRequestForSelf": Bool,
  "preferredDate": Text,
  "preferredTime": Text,
  "recipientAddress": Opt(Text),
  "recipientName": Opt(Text)
});
const UserProfileInput = Record({
  "name": Text,
  "email": Text,
  "phone": Text
});
const VendorProductInput = Record({
  "moq": Opt(Nat),
  "mrp": Opt(Nat),
  "imageUrls": Vec(Text),
  "fssaiDocumentUrl": Opt(Text),
  "pricePerKg": Opt(Nat),
  "supplyPrice": Opt(Nat),
  "description": Text,
  "productName": Text,
  "availableQuantityKg": Opt(Nat),
  "category": Text,
  "basePrice": Nat,
  "vendorName": Text,
  "vendorType": VendorType$1
});
Service({
  "_immutableObjectStorageBlobsAreLive": Func(
    [Vec(Vec(Nat8))],
    [Vec(Bool)],
    ["query"]
  ),
  "_immutableObjectStorageBlobsToDelete": Func(
    [],
    [Vec(Vec(Nat8))],
    ["query"]
  ),
  "_immutableObjectStorageConfirmBlobDeletion": Func(
    [Vec(Vec(Nat8))],
    [],
    []
  ),
  "_immutableObjectStorageCreateCertificate": Func(
    [Text],
    [_ImmutableObjectStorageCreateCertificateResult],
    []
  ),
  "_immutableObjectStorageRefillCashier": Func(
    [Opt(_ImmutableObjectStorageRefillInformation)],
    [_ImmutableObjectStorageRefillResult],
    []
  ),
  "_immutableObjectStorageUpdateGatewayPrincipals": Func([], [], []),
  "addMyAddress": Func([Address], [UserProfilePublic], []),
  "addToCart": Func([Nat, Nat], [CartPublic], []),
  "adminAddCategory": Func(
    [Text, Text, Text, Text, Text],
    [Variant({ "ok": Category, "err": Text })],
    []
  ),
  "adminAddFeaturedBlock": Func(
    [Text, FeaturedBlockInput],
    [FeaturedBlock],
    []
  ),
  "adminAddHeroBanner": Func(
    [Text, HeroBannerInput],
    [HeroBanner],
    []
  ),
  "adminAddProduct": Func([Text, ProductInput], [Product], []),
  "adminAddReview": Func(
    [Text, Text, Nat, Text, Text],
    [Nat],
    []
  ),
  "adminAddSubCategory": Func(
    [Text, CategoryId, Text, Text],
    [Variant({ "ok": Category, "err": Text })],
    []
  ),
  "adminApproveVendor": Func(
    [Text, Principal$1],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "adminApproveVendorProduct": Func(
    [Text, Nat, Nat, Opt(Nat)],
    [Variant({ "ok": VendorProductView, "err": Text })],
    []
  ),
  "adminAssignProductToVendor": Func(
    [Text, Principal$1, Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "adminDeleteCategory": Func(
    [Text, CategoryId],
    [Variant({ "ok": Bool, "err": Text })],
    []
  ),
  "adminDeleteFeaturedBlock": Func(
    [Text, FeaturedBlockId],
    [Variant({ "ok": Bool, "err": Text })],
    []
  ),
  "adminDeleteHeroBanner": Func(
    [Text, HeroBannerId],
    [Variant({ "ok": Bool, "err": Text })],
    []
  ),
  "adminDeleteProduct": Func([Text, ProductId], [Bool], []),
  "adminDeleteReview": Func([Text, Nat], [Bool], []),
  "adminDeleteServiceRequest": Func([Text, Nat], [Bool], []),
  "adminDeleteSubCategory": Func(
    [Text, CategoryId, SubCategoryId],
    [Variant({ "ok": Category, "err": Text })],
    []
  ),
  "adminGetAllOrders": Func(
    [Nat, Nat],
    [Vec(OrderPublic)],
    ["query"]
  ),
  "adminGetCategories": Func([Text], [Vec(Category)], ["query"]),
  "adminGetServiceRequests": Func(
    [Text],
    [Vec(ServiceRequestPublic)],
    ["query"]
  ),
  "adminListFeaturedBlocks": Func(
    [Text],
    [Vec(FeaturedBlock)],
    ["query"]
  ),
  "adminListHeroBanners": Func(
    [Text],
    [Vec(HeroBanner)],
    ["query"]
  ),
  "adminListVendorProducts": Func(
    [Text],
    [Vec(VendorProductView)],
    ["query"]
  ),
  "adminListVendorProductsByVendor": Func(
    [Text, Principal$1],
    [Vec(VendorProductView)],
    ["query"]
  ),
  "adminListVendors": Func(
    [Opt(VendorStatus)],
    [Vec(VendorSummary)],
    ["query"]
  ),
  "adminLogin": Func([Text, Text], [Opt(Text)], []),
  "adminLogout": Func([Text], [], []),
  "adminRegisterImageHash": Func([Text, Text], [Text], []),
  "adminRejectVendor": Func(
    [Text, Principal$1, Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "adminRejectVendorProduct": Func(
    [Text, Nat, Text],
    [Variant({ "ok": VendorProductView, "err": Text })],
    []
  ),
  "adminReorderHeroBanner": Func(
    [Text, HeroBannerId, Nat],
    [Variant({ "ok": HeroBanner, "err": Text })],
    []
  ),
  "adminRequestOtp": Func(
    [],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "adminSetDiscount": Func(
    [Text, ProductId, Nat],
    [Opt(Product)],
    []
  ),
  "adminSetUserAdmin": Func([Principal$1, Bool], [Bool], []),
  "adminSuspendVendor": Func(
    [Text, Principal$1],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "adminUnassignProductFromVendor": Func(
    [Text, Principal$1, Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "adminUpdateCategory": Func(
    [Text, CategoryId, Text, Text, Text, Text],
    [Variant({ "ok": Category, "err": Text })],
    []
  ),
  "adminUpdateFeaturedBlock": Func(
    [Text, FeaturedBlockId, FeaturedBlockInput],
    [Variant({ "ok": FeaturedBlock, "err": Text })],
    []
  ),
  "adminUpdateFooterSettings": Func(
    [Text, Text, Text, Text, Vec(SocialLink)],
    [Bool],
    []
  ),
  "adminUpdateHeroAndHowitworks": Func(
    [Text, Text, Text, Vec(HowItWorksStep)],
    [],
    []
  ),
  "adminUpdateHeroBanner": Func(
    [Text, HeroBannerId, HeroBannerInput],
    [Variant({ "ok": HeroBanner, "err": Text })],
    []
  ),
  "adminUpdateOrderStatus": Func(
    [OrderId, OrderStatus$1, Text],
    [Opt(OrderPublic)],
    []
  ),
  "adminUpdatePolicyContent": Func([Text, Text], [Bool], []),
  "adminUpdateProduct": Func(
    [Text, ProductId, ProductInput],
    [Opt(Product)],
    []
  ),
  "adminUpdateReview": Func(
    [Text, Nat, Text, Nat, Text, Text],
    [Bool],
    []
  ),
  "adminUpdateServiceRequestStatus": Func(
    [Text, Nat, ServiceRequestStatus$1],
    [Opt(ServiceRequestPublic)],
    []
  ),
  "adminUpdateServicesAvailability": Func(
    [Text, Bool, Text],
    [],
    []
  ),
  "adminUpdateSiteSettings": Func(
    [Text, Opt(Text), Opt(Text)],
    [
      Record({
        "logoUrl": Opt(Text),
        "faviconUrl": Opt(Text)
      })
    ],
    []
  ),
  "adminUpdateStock": Func(
    [Text, ProductId, Nat],
    [Opt(Product)],
    []
  ),
  "adminUpdateSubCategory": Func(
    [Text, CategoryId, SubCategoryId, Text, Text],
    [Variant({ "ok": Category, "err": Text })],
    []
  ),
  "adminUpdateVendorProductQuantity": Func(
    [Text, Nat, Nat],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "adminUpdateVideoByte": Func(
    [Text, Text, Bool, Text],
    [],
    []
  ),
  "adminVerifyKey": Func(
    [Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "adminVerifyOtp": Func(
    [Text],
    [Variant({ "ok": Text, "err": Text })],
    []
  ),
  "claimAdminIfFirst": Func([], [Bool], []),
  "clearMyCart": Func([], [], []),
  "createOrder": Func([CreateOrderInput], [OrderPublic], []),
  "createRazorpayOrder": Func(
    [Nat, Text],
    [
      Variant({
        "ok": Record({
          "orderId": Text,
          "currency": Text,
          "amount": Nat
        }),
        "err": Text
      })
    ],
    []
  ),
  "getCategory": Func([CategoryId], [Opt(Category)], ["query"]),
  "getCategoryBySlug": Func([Text], [Opt(Category)], ["query"]),
  "getFeaturedBlock": Func(
    [FeaturedBlockId],
    [Opt(FeaturedBlock)],
    ["query"]
  ),
  "getFooterSettings": Func(
    [],
    [
      Record({
        "tagline": Text,
        "socialLinks": Vec(SocialLink),
        "policyContent": Text,
        "aboutContent": Text,
        "copyright": Text
      })
    ],
    ["query"]
  ),
  "getHeroBanner": Func([HeroBannerId], [Opt(HeroBanner)], ["query"]),
  "getMyCart": Func([], [CartPublic], []),
  "getMyOrders": Func([], [Vec(OrderPublic)], ["query"]),
  "getMyProfile": Func([], [UserProfilePublic], []),
  "getMyVendorOrders": Func([], [Vec(VendorOrderSummary)], ["query"]),
  "getMyVendorProfile": Func(
    [],
    [Variant({ "ok": VendorProfile, "err": Text })],
    ["query"]
  ),
  "getOrder": Func([OrderId], [Opt(OrderPublic)], ["query"]),
  "getProduct": Func([ProductId], [Opt(Product)], ["query"]),
  "getReviews": Func([], [Vec(CustomerReview)], ["query"]),
  "getServicesAvailability": Func(
    [],
    [Record({ "available": Bool, "message": Text })],
    ["query"]
  ),
  "getSiteSettings": Func(
    [],
    [
      Record({
        "heroSubtitle": Text,
        "howitworksSteps": Vec(HowItWorksStep),
        "logoUrl": Opt(Text),
        "faviconUrl": Opt(Text),
        "heroTagline": Text
      })
    ],
    ["query"]
  ),
  "getVendorForProduct": Func(
    [Text],
    [Opt(VendorSummary)],
    ["query"]
  ),
  "getVendorStatusBySession": Func(
    [Text],
    [Opt(VendorStatus)],
    ["query"]
  ),
  "getVideoByte": Func(
    [],
    [
      Record({
        "url": Text,
        "title": Text,
        "enabled": Bool
      })
    ],
    ["query"]
  ),
  "isAdminSession": Func([Text], [Bool], ["query"]),
  "isCurrentUserAdmin": Func([], [Bool], ["query"]),
  "listBestSellers": Func([Nat], [Vec(Product)], ["query"]),
  "listCategories": Func([], [Vec(Category)], ["query"]),
  "listFeaturedBlocks": Func([], [Vec(FeaturedBlock)], ["query"]),
  "listHeroBanners": Func([], [Vec(HeroBanner)], ["query"]),
  "listNewArrivals": Func([Nat], [Vec(Product)], ["query"]),
  "listProducts": Func([ProductFilter], [ProductListResult], ["query"]),
  "listProductsByCategory": Func(
    [CategoryId, Nat, Nat],
    [ProductListResult],
    ["query"]
  ),
  "processVendorActionToken": Func(
    [Text, Variant({ "reject": Null, "approve": Null })],
    [Variant({ "ok": Text, "err": Text })],
    []
  ),
  "razorpayTransform": Func(
    [TransformationInput],
    [TransformationOutput],
    ["query"]
  ),
  "registerVendor": Func(
    [VendorRegistration],
    [Variant({ "ok": Text, "err": Text })],
    []
  ),
  "removeFromCart": Func([Nat], [CartPublic], []),
  "requestOtp": Func(
    [Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "searchProducts": Func(
    [Text, Nat, Nat],
    [ProductListResult],
    ["query"]
  ),
  "submitServiceRequest": Func(
    [CreateServiceRequestInput],
    [ServiceRequestPublic],
    []
  ),
  "updateCartItem": Func([Nat, Nat], [CartPublic], []),
  "updateMyProfile": Func([UserProfileInput], [UserProfilePublic], []),
  "vendorGetMyProducts": Func(
    [Text],
    [Variant({ "ok": Vec(VendorProductView), "err": Text })],
    []
  ),
  "vendorSubmitProduct": Func(
    [Text, VendorProductInput],
    [Variant({ "ok": VendorProductView, "err": Text })],
    []
  ),
  "vendorUpdateProductQuantity": Func(
    [Text, Nat, Nat],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "verifyOtp": Func(
    [Text, Text],
    [Variant({ "ok": Text, "err": Text })],
    []
  ),
  "verifyRazorpayPayment": Func(
    [Text, Text, Text],
    [Variant({ "ok": Bool, "err": Text })],
    []
  ),
  "verifyVendorOtp": Func(
    [Text, Text],
    [
      Variant({
        "ok": Record({ "status": VendorStatus, "token": Text }),
        "err": Text
      })
    ],
    []
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const _ImmutableObjectStorageCreateCertificateResult2 = IDL2.Record({
    "method": IDL2.Text,
    "blob_hash": IDL2.Text
  });
  const _ImmutableObjectStorageRefillInformation2 = IDL2.Record({
    "proposed_top_up_amount": IDL2.Opt(IDL2.Nat)
  });
  const _ImmutableObjectStorageRefillResult2 = IDL2.Record({
    "success": IDL2.Opt(IDL2.Bool),
    "topped_up_amount": IDL2.Opt(IDL2.Nat)
  });
  const Address2 = IDL2.Record({
    "city": IDL2.Text,
    "name": IDL2.Text,
    "line1": IDL2.Text,
    "line2": IDL2.Text,
    "state": IDL2.Text,
    "isDefault": IDL2.Bool,
    "phone": IDL2.Text,
    "pincode": IDL2.Text
  });
  const UserId2 = IDL2.Principal;
  const UserProfilePublic2 = IDL2.Record({
    "id": UserId2,
    "name": IDL2.Text,
    "createdAt": IDL2.Int,
    "email": IDL2.Text,
    "updatedAt": IDL2.Int,
    "addresses": IDL2.Vec(Address2),
    "isAdmin": IDL2.Bool,
    "phone": IDL2.Text
  });
  const CartItem2 = IDL2.Record({
    "productId": IDL2.Nat,
    "addedAt": IDL2.Int,
    "quantity": IDL2.Nat
  });
  const CartPublic2 = IDL2.Record({
    "userId": IDL2.Principal,
    "updatedAt": IDL2.Int,
    "items": IDL2.Vec(CartItem2)
  });
  const CategoryId2 = IDL2.Nat;
  const SubCategoryId2 = IDL2.Nat;
  const SubCategory2 = IDL2.Record({
    "id": SubCategoryId2,
    "name": IDL2.Text,
    "imageUrl": IDL2.Text
  });
  const Category2 = IDL2.Record({
    "id": CategoryId2,
    "name": IDL2.Text,
    "slug": IDL2.Text,
    "description": IDL2.Text,
    "imageUrl": IDL2.Text,
    "subCategories": IDL2.Vec(SubCategory2)
  });
  const FeaturedBlockInput2 = IDL2.Record({
    "title": IDL2.Text,
    "content": IDL2.Text,
    "thumbnailUrl": IDL2.Text,
    "order": IDL2.Nat,
    "isActive": IDL2.Bool,
    "contentImages": IDL2.Vec(IDL2.Text)
  });
  const FeaturedBlockId2 = IDL2.Nat;
  const FeaturedBlock2 = IDL2.Record({
    "id": FeaturedBlockId2,
    "title": IDL2.Text,
    "content": IDL2.Text,
    "thumbnailUrl": IDL2.Text,
    "order": IDL2.Nat,
    "createdAt": IDL2.Int,
    "isActive": IDL2.Bool,
    "contentImages": IDL2.Vec(IDL2.Text)
  });
  const HeroBannerInput2 = IDL2.Record({
    "title": IDL2.Text,
    "order": IDL2.Nat,
    "isActive": IDL2.Bool,
    "imageUrl": IDL2.Text,
    "ctaSlug": IDL2.Text,
    "ctaText": IDL2.Text,
    "durationSeconds": IDL2.Nat,
    "subtitle": IDL2.Text
  });
  const HeroBannerId2 = IDL2.Nat;
  const HeroBanner2 = IDL2.Record({
    "id": HeroBannerId2,
    "title": IDL2.Text,
    "order": IDL2.Nat,
    "isActive": IDL2.Bool,
    "imageUrl": IDL2.Text,
    "ctaSlug": IDL2.Text,
    "ctaText": IDL2.Text,
    "durationSeconds": IDL2.Nat,
    "subtitle": IDL2.Text
  });
  const ProductInput2 = IDL2.Record({
    "subCategory": IDL2.Text,
    "title": IDL2.Text,
    "imageUrls": IDL2.Vec(IDL2.Text),
    "tags": IDL2.Vec(IDL2.Text),
    "description": IDL2.Text,
    "discountPercent": IDL2.Nat,
    "stock": IDL2.Nat,
    "category": CategoryId2,
    "brand": IDL2.Text,
    "rating": IDL2.Nat,
    "price": IDL2.Nat,
    "reviewCount": IDL2.Nat
  });
  const ProductId2 = IDL2.Nat;
  const Product2 = IDL2.Record({
    "id": ProductId2,
    "subCategory": IDL2.Text,
    "title": IDL2.Text,
    "imageUrls": IDL2.Vec(IDL2.Text),
    "createdAt": IDL2.Int,
    "tags": IDL2.Vec(IDL2.Text),
    "description": IDL2.Text,
    "discountPercent": IDL2.Nat,
    "isActive": IDL2.Bool,
    "updatedAt": IDL2.Int,
    "stock": IDL2.Nat,
    "category": CategoryId2,
    "brand": IDL2.Text,
    "rating": IDL2.Nat,
    "price": IDL2.Nat,
    "reviewCount": IDL2.Nat
  });
  const VendorType2 = IDL2.Variant({
    "rawMaterial": IDL2.Null,
    "brand": IDL2.Null
  });
  const VendorProductView2 = IDL2.Record({
    "id": IDL2.Nat,
    "moq": IDL2.Opt(IDL2.Nat),
    "mrp": IDL2.Opt(IDL2.Nat),
    "finalPrice": IDL2.Opt(IDL2.Nat),
    "status": IDL2.Variant({
      "pending": IDL2.Null,
      "approved": IDL2.Null,
      "rejected": IDL2.Null
    }),
    "packagingCost": IDL2.Opt(IDL2.Nat),
    "taxPercent": IDL2.Opt(IDL2.Nat),
    "imageUrls": IDL2.Vec(IDL2.Text),
    "fssaiDocumentUrl": IDL2.Opt(IDL2.Text),
    "pricePerKg": IDL2.Opt(IDL2.Nat),
    "rejectionReason": IDL2.Opt(IDL2.Text),
    "supplyPrice": IDL2.Opt(IDL2.Nat),
    "submittedAt": IDL2.Int,
    "description": IDL2.Text,
    "productName": IDL2.Text,
    "reviewedAt": IDL2.Opt(IDL2.Int),
    "availableQuantityKg": IDL2.Opt(IDL2.Nat),
    "vendorId": IDL2.Principal,
    "category": IDL2.Text,
    "basePrice": IDL2.Nat,
    "vendorEmail": IDL2.Text,
    "vendorName": IDL2.Text,
    "vendorType": VendorType2
  });
  const OrderId2 = IDL2.Nat;
  const OrderStatus2 = IDL2.Variant({
    "Delivered": IDL2.Null,
    "Confirmed": IDL2.Null,
    "Cancelled": IDL2.Null,
    "Processing": IDL2.Null,
    "Shipped": IDL2.Null,
    "OutForDelivery": IDL2.Null
  });
  const DeliveryAddress2 = IDL2.Record({
    "street": IDL2.Text,
    "city": IDL2.Text,
    "name": IDL2.Text,
    "district": IDL2.Text,
    "state": IDL2.Text,
    "landmark": IDL2.Text,
    "phone": IDL2.Text,
    "pincode": IDL2.Text,
    "locality": IDL2.Text,
    "houseNo": IDL2.Text
  });
  const ShipmentUpdate2 = IDL2.Record({
    "status": OrderStatus2,
    "message": IDL2.Text,
    "timestamp": IDL2.Int
  });
  const DeliveryType2 = IDL2.Variant({
    "Standard": IDL2.Null,
    "Express": IDL2.Null
  });
  const OrderItem2 = IDL2.Record({
    "title": IDL2.Text,
    "discountPercent": IDL2.Nat,
    "productId": IDL2.Nat,
    "imageUrl": IDL2.Text,
    "quantity": IDL2.Nat,
    "price": IDL2.Nat
  });
  const OrderPublic2 = IDL2.Record({
    "id": OrderId2,
    "status": OrderStatus2,
    "deliveryAddress": DeliveryAddress2,
    "shipmentUpdates": IDL2.Vec(ShipmentUpdate2),
    "paymentMethod": IDL2.Text,
    "userId": IDL2.Principal,
    "createdAt": IDL2.Int,
    "estimatedDelivery": IDL2.Opt(IDL2.Int),
    "deliveryCost": IDL2.Nat,
    "deliveryType": DeliveryType2,
    "updatedAt": IDL2.Int,
    "totalAmount": IDL2.Nat,
    "items": IDL2.Vec(OrderItem2)
  });
  const ServiceRequestStatus2 = IDL2.Variant({
    "New": IDL2.Null,
    "Contacted": IDL2.Null,
    "Cancelled": IDL2.Null,
    "Completed": IDL2.Null
  });
  const ServiceType2 = IDL2.Variant({
    "Ambulance": IDL2.Null,
    "FoodDelivery": IDL2.Null,
    "Taxi": IDL2.Null,
    "SchoolAdmissions": IDL2.Null,
    "Medicines": IDL2.Null,
    "Gifting": IDL2.Null,
    "FuneralServices": IDL2.Null,
    "Tourism": IDL2.Null,
    "Doctors": IDL2.Null,
    "VideoConferencing": IDL2.Null,
    "EventManagement": IDL2.Null,
    "WeddingsAnniversaries": IDL2.Null,
    "Other": IDL2.Null
  });
  const ServiceRequestPublic2 = IDL2.Record({
    "id": IDL2.Nat,
    "status": ServiceRequestStatus2,
    "userName": IDL2.Text,
    "serviceType": ServiceType2,
    "userId": IDL2.Text,
    "recipientPhone": IDL2.Opt(IDL2.Text),
    "submittedAt": IDL2.Int,
    "description": IDL2.Text,
    "userPhone": IDL2.Text,
    "lastUpdatedAt": IDL2.Int,
    "isRequestForSelf": IDL2.Bool,
    "preferredDate": IDL2.Text,
    "preferredTime": IDL2.Text,
    "recipientAddress": IDL2.Opt(IDL2.Text),
    "recipientName": IDL2.Opt(IDL2.Text)
  });
  const VendorStatus2 = IDL2.Variant({
    "pending": IDL2.Null,
    "approved": IDL2.Null,
    "rejected": IDL2.Null,
    "suspended": IDL2.Null
  });
  const VendorSummary2 = IDL2.Record({
    "id": IDL2.Principal,
    "bankAccountNumber": IDL2.Text,
    "categories": IDL2.Vec(IDL2.Text),
    "status": VendorStatus2,
    "assignedProductIds": IDL2.Vec(IDL2.Text),
    "ifscCode": IDL2.Text,
    "fssaiDocumentUrl": IDL2.Opt(IDL2.Text),
    "approvedAt": IDL2.Opt(IDL2.Int),
    "businessName": IDL2.Text,
    "address": IDL2.Text,
    "contactEmail": IDL2.Text,
    "brandName": IDL2.Opt(IDL2.Text),
    "phone": IDL2.Text,
    "packagingDetails": IDL2.Opt(IDL2.Text),
    "registeredAt": IDL2.Int,
    "vendorType": VendorType2,
    "gstinNumber": IDL2.Opt(IDL2.Text)
  });
  const SocialLink2 = IDL2.Record({
    "url": IDL2.Text,
    "platform": IDL2.Text,
    "enabled": IDL2.Bool
  });
  const HowItWorksStep2 = IDL2.Record({
    "title": IDL2.Text,
    "description": IDL2.Text
  });
  const CreateOrderInput2 = IDL2.Record({
    "deliveryAddress": DeliveryAddress2,
    "paymentMethod": IDL2.Text,
    "deliveryCost": IDL2.Nat,
    "deliveryType": DeliveryType2,
    "items": IDL2.Vec(
      IDL2.Record({ "productId": IDL2.Nat, "quantity": IDL2.Nat })
    )
  });
  const VendorOrderSummary2 = IDL2.Record({
    "productId": IDL2.Text,
    "productName": IDL2.Text,
    "orderId": IDL2.Text,
    "placedAt": IDL2.Int,
    "quantity": IDL2.Nat,
    "totalPrice": IDL2.Float64
  });
  const VendorProfile2 = IDL2.Record({
    "id": IDL2.Principal,
    "bankAccountNumber": IDL2.Text,
    "categories": IDL2.Vec(IDL2.Text),
    "status": VendorStatus2,
    "assignedProductIds": IDL2.Vec(IDL2.Text),
    "ifscCode": IDL2.Text,
    "fssaiDocumentUrl": IDL2.Opt(IDL2.Text),
    "approvedAt": IDL2.Opt(IDL2.Int),
    "businessName": IDL2.Text,
    "address": IDL2.Text,
    "contactEmail": IDL2.Text,
    "brandName": IDL2.Opt(IDL2.Text),
    "phone": IDL2.Text,
    "packagingDetails": IDL2.Opt(IDL2.Text),
    "registeredAt": IDL2.Int,
    "vendorType": VendorType2,
    "gstinNumber": IDL2.Opt(IDL2.Text)
  });
  const CustomerReviewId2 = IDL2.Nat;
  const CustomerReview2 = IDL2.Record({
    "id": CustomerReviewId2,
    "createdAt": IDL2.Int,
    "reviewText": IDL2.Text,
    "reviewerName": IDL2.Text,
    "productName": IDL2.Text,
    "rating": IDL2.Nat
  });
  const ProductFilter2 = IDL2.Record({
    "categoryId": IDL2.Opt(CategoryId2),
    "inStockOnly": IDL2.Bool,
    "offset": IDL2.Nat,
    "maxPrice": IDL2.Opt(IDL2.Nat),
    "limit": IDL2.Nat,
    "searchTerm": IDL2.Opt(IDL2.Text),
    "minPrice": IDL2.Opt(IDL2.Nat)
  });
  const ProductListResult2 = IDL2.Record({
    "total": IDL2.Nat,
    "products": IDL2.Vec(Product2)
  });
  const http_header2 = IDL2.Record({ "value": IDL2.Text, "name": IDL2.Text });
  const http_request_result2 = IDL2.Record({
    "status": IDL2.Nat,
    "body": IDL2.Vec(IDL2.Nat8),
    "headers": IDL2.Vec(http_header2)
  });
  const TransformationInput2 = IDL2.Record({
    "context": IDL2.Vec(IDL2.Nat8),
    "response": http_request_result2
  });
  const TransformationOutput2 = IDL2.Record({
    "status": IDL2.Nat,
    "body": IDL2.Vec(IDL2.Nat8),
    "headers": IDL2.Vec(http_header2)
  });
  const VendorRegistration2 = IDL2.Record({
    "bankAccountNumber": IDL2.Text,
    "categories": IDL2.Vec(IDL2.Text),
    "ifscCode": IDL2.Text,
    "fssaiDocumentUrl": IDL2.Opt(IDL2.Text),
    "businessName": IDL2.Text,
    "address": IDL2.Text,
    "contactEmail": IDL2.Text,
    "brandName": IDL2.Opt(IDL2.Text),
    "phone": IDL2.Text,
    "packagingDetails": IDL2.Opt(IDL2.Text),
    "vendorType": VendorType2,
    "gstinNumber": IDL2.Opt(IDL2.Text)
  });
  const CreateServiceRequestInput2 = IDL2.Record({
    "userName": IDL2.Text,
    "serviceType": ServiceType2,
    "recipientPhone": IDL2.Opt(IDL2.Text),
    "description": IDL2.Text,
    "userPhone": IDL2.Text,
    "isRequestForSelf": IDL2.Bool,
    "preferredDate": IDL2.Text,
    "preferredTime": IDL2.Text,
    "recipientAddress": IDL2.Opt(IDL2.Text),
    "recipientName": IDL2.Opt(IDL2.Text)
  });
  const UserProfileInput2 = IDL2.Record({
    "name": IDL2.Text,
    "email": IDL2.Text,
    "phone": IDL2.Text
  });
  const VendorProductInput2 = IDL2.Record({
    "moq": IDL2.Opt(IDL2.Nat),
    "mrp": IDL2.Opt(IDL2.Nat),
    "imageUrls": IDL2.Vec(IDL2.Text),
    "fssaiDocumentUrl": IDL2.Opt(IDL2.Text),
    "pricePerKg": IDL2.Opt(IDL2.Nat),
    "supplyPrice": IDL2.Opt(IDL2.Nat),
    "description": IDL2.Text,
    "productName": IDL2.Text,
    "availableQuantityKg": IDL2.Opt(IDL2.Nat),
    "category": IDL2.Text,
    "basePrice": IDL2.Nat,
    "vendorName": IDL2.Text,
    "vendorType": VendorType2
  });
  return IDL2.Service({
    "_immutableObjectStorageBlobsAreLive": IDL2.Func(
      [IDL2.Vec(IDL2.Vec(IDL2.Nat8))],
      [IDL2.Vec(IDL2.Bool)],
      ["query"]
    ),
    "_immutableObjectStorageBlobsToDelete": IDL2.Func(
      [],
      [IDL2.Vec(IDL2.Vec(IDL2.Nat8))],
      ["query"]
    ),
    "_immutableObjectStorageConfirmBlobDeletion": IDL2.Func(
      [IDL2.Vec(IDL2.Vec(IDL2.Nat8))],
      [],
      []
    ),
    "_immutableObjectStorageCreateCertificate": IDL2.Func(
      [IDL2.Text],
      [_ImmutableObjectStorageCreateCertificateResult2],
      []
    ),
    "_immutableObjectStorageRefillCashier": IDL2.Func(
      [IDL2.Opt(_ImmutableObjectStorageRefillInformation2)],
      [_ImmutableObjectStorageRefillResult2],
      []
    ),
    "_immutableObjectStorageUpdateGatewayPrincipals": IDL2.Func([], [], []),
    "addMyAddress": IDL2.Func([Address2], [UserProfilePublic2], []),
    "addToCart": IDL2.Func([IDL2.Nat, IDL2.Nat], [CartPublic2], []),
    "adminAddCategory": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Text],
      [IDL2.Variant({ "ok": Category2, "err": IDL2.Text })],
      []
    ),
    "adminAddFeaturedBlock": IDL2.Func(
      [IDL2.Text, FeaturedBlockInput2],
      [FeaturedBlock2],
      []
    ),
    "adminAddHeroBanner": IDL2.Func(
      [IDL2.Text, HeroBannerInput2],
      [HeroBanner2],
      []
    ),
    "adminAddProduct": IDL2.Func([IDL2.Text, ProductInput2], [Product2], []),
    "adminAddReview": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Nat, IDL2.Text, IDL2.Text],
      [IDL2.Nat],
      []
    ),
    "adminAddSubCategory": IDL2.Func(
      [IDL2.Text, CategoryId2, IDL2.Text, IDL2.Text],
      [IDL2.Variant({ "ok": Category2, "err": IDL2.Text })],
      []
    ),
    "adminApproveVendor": IDL2.Func(
      [IDL2.Text, IDL2.Principal],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "adminApproveVendorProduct": IDL2.Func(
      [IDL2.Text, IDL2.Nat, IDL2.Nat, IDL2.Opt(IDL2.Nat)],
      [IDL2.Variant({ "ok": VendorProductView2, "err": IDL2.Text })],
      []
    ),
    "adminAssignProductToVendor": IDL2.Func(
      [IDL2.Text, IDL2.Principal, IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "adminDeleteCategory": IDL2.Func(
      [IDL2.Text, CategoryId2],
      [IDL2.Variant({ "ok": IDL2.Bool, "err": IDL2.Text })],
      []
    ),
    "adminDeleteFeaturedBlock": IDL2.Func(
      [IDL2.Text, FeaturedBlockId2],
      [IDL2.Variant({ "ok": IDL2.Bool, "err": IDL2.Text })],
      []
    ),
    "adminDeleteHeroBanner": IDL2.Func(
      [IDL2.Text, HeroBannerId2],
      [IDL2.Variant({ "ok": IDL2.Bool, "err": IDL2.Text })],
      []
    ),
    "adminDeleteProduct": IDL2.Func([IDL2.Text, ProductId2], [IDL2.Bool], []),
    "adminDeleteReview": IDL2.Func([IDL2.Text, IDL2.Nat], [IDL2.Bool], []),
    "adminDeleteServiceRequest": IDL2.Func([IDL2.Text, IDL2.Nat], [IDL2.Bool], []),
    "adminDeleteSubCategory": IDL2.Func(
      [IDL2.Text, CategoryId2, SubCategoryId2],
      [IDL2.Variant({ "ok": Category2, "err": IDL2.Text })],
      []
    ),
    "adminGetAllOrders": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [IDL2.Vec(OrderPublic2)],
      ["query"]
    ),
    "adminGetCategories": IDL2.Func([IDL2.Text], [IDL2.Vec(Category2)], ["query"]),
    "adminGetServiceRequests": IDL2.Func(
      [IDL2.Text],
      [IDL2.Vec(ServiceRequestPublic2)],
      ["query"]
    ),
    "adminListFeaturedBlocks": IDL2.Func(
      [IDL2.Text],
      [IDL2.Vec(FeaturedBlock2)],
      ["query"]
    ),
    "adminListHeroBanners": IDL2.Func(
      [IDL2.Text],
      [IDL2.Vec(HeroBanner2)],
      ["query"]
    ),
    "adminListVendorProducts": IDL2.Func(
      [IDL2.Text],
      [IDL2.Vec(VendorProductView2)],
      ["query"]
    ),
    "adminListVendorProductsByVendor": IDL2.Func(
      [IDL2.Text, IDL2.Principal],
      [IDL2.Vec(VendorProductView2)],
      ["query"]
    ),
    "adminListVendors": IDL2.Func(
      [IDL2.Opt(VendorStatus2)],
      [IDL2.Vec(VendorSummary2)],
      ["query"]
    ),
    "adminLogin": IDL2.Func([IDL2.Text, IDL2.Text], [IDL2.Opt(IDL2.Text)], []),
    "adminLogout": IDL2.Func([IDL2.Text], [], []),
    "adminRegisterImageHash": IDL2.Func([IDL2.Text, IDL2.Text], [IDL2.Text], []),
    "adminRejectVendor": IDL2.Func(
      [IDL2.Text, IDL2.Principal, IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "adminRejectVendorProduct": IDL2.Func(
      [IDL2.Text, IDL2.Nat, IDL2.Text],
      [IDL2.Variant({ "ok": VendorProductView2, "err": IDL2.Text })],
      []
    ),
    "adminReorderHeroBanner": IDL2.Func(
      [IDL2.Text, HeroBannerId2, IDL2.Nat],
      [IDL2.Variant({ "ok": HeroBanner2, "err": IDL2.Text })],
      []
    ),
    "adminRequestOtp": IDL2.Func(
      [],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "adminSetDiscount": IDL2.Func(
      [IDL2.Text, ProductId2, IDL2.Nat],
      [IDL2.Opt(Product2)],
      []
    ),
    "adminSetUserAdmin": IDL2.Func([IDL2.Principal, IDL2.Bool], [IDL2.Bool], []),
    "adminSuspendVendor": IDL2.Func(
      [IDL2.Text, IDL2.Principal],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "adminUnassignProductFromVendor": IDL2.Func(
      [IDL2.Text, IDL2.Principal, IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "adminUpdateCategory": IDL2.Func(
      [IDL2.Text, CategoryId2, IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Text],
      [IDL2.Variant({ "ok": Category2, "err": IDL2.Text })],
      []
    ),
    "adminUpdateFeaturedBlock": IDL2.Func(
      [IDL2.Text, FeaturedBlockId2, FeaturedBlockInput2],
      [IDL2.Variant({ "ok": FeaturedBlock2, "err": IDL2.Text })],
      []
    ),
    "adminUpdateFooterSettings": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Vec(SocialLink2)],
      [IDL2.Bool],
      []
    ),
    "adminUpdateHeroAndHowitworks": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Vec(HowItWorksStep2)],
      [],
      []
    ),
    "adminUpdateHeroBanner": IDL2.Func(
      [IDL2.Text, HeroBannerId2, HeroBannerInput2],
      [IDL2.Variant({ "ok": HeroBanner2, "err": IDL2.Text })],
      []
    ),
    "adminUpdateOrderStatus": IDL2.Func(
      [OrderId2, OrderStatus2, IDL2.Text],
      [IDL2.Opt(OrderPublic2)],
      []
    ),
    "adminUpdatePolicyContent": IDL2.Func([IDL2.Text, IDL2.Text], [IDL2.Bool], []),
    "adminUpdateProduct": IDL2.Func(
      [IDL2.Text, ProductId2, ProductInput2],
      [IDL2.Opt(Product2)],
      []
    ),
    "adminUpdateReview": IDL2.Func(
      [IDL2.Text, IDL2.Nat, IDL2.Text, IDL2.Nat, IDL2.Text, IDL2.Text],
      [IDL2.Bool],
      []
    ),
    "adminUpdateServiceRequestStatus": IDL2.Func(
      [IDL2.Text, IDL2.Nat, ServiceRequestStatus2],
      [IDL2.Opt(ServiceRequestPublic2)],
      []
    ),
    "adminUpdateServicesAvailability": IDL2.Func(
      [IDL2.Text, IDL2.Bool, IDL2.Text],
      [],
      []
    ),
    "adminUpdateSiteSettings": IDL2.Func(
      [IDL2.Text, IDL2.Opt(IDL2.Text), IDL2.Opt(IDL2.Text)],
      [
        IDL2.Record({
          "logoUrl": IDL2.Opt(IDL2.Text),
          "faviconUrl": IDL2.Opt(IDL2.Text)
        })
      ],
      []
    ),
    "adminUpdateStock": IDL2.Func(
      [IDL2.Text, ProductId2, IDL2.Nat],
      [IDL2.Opt(Product2)],
      []
    ),
    "adminUpdateSubCategory": IDL2.Func(
      [IDL2.Text, CategoryId2, SubCategoryId2, IDL2.Text, IDL2.Text],
      [IDL2.Variant({ "ok": Category2, "err": IDL2.Text })],
      []
    ),
    "adminUpdateVendorProductQuantity": IDL2.Func(
      [IDL2.Text, IDL2.Nat, IDL2.Nat],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "adminUpdateVideoByte": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Bool, IDL2.Text],
      [],
      []
    ),
    "adminVerifyKey": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "adminVerifyOtp": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Text, "err": IDL2.Text })],
      []
    ),
    "claimAdminIfFirst": IDL2.Func([], [IDL2.Bool], []),
    "clearMyCart": IDL2.Func([], [], []),
    "createOrder": IDL2.Func([CreateOrderInput2], [OrderPublic2], []),
    "createRazorpayOrder": IDL2.Func(
      [IDL2.Nat, IDL2.Text],
      [
        IDL2.Variant({
          "ok": IDL2.Record({
            "orderId": IDL2.Text,
            "currency": IDL2.Text,
            "amount": IDL2.Nat
          }),
          "err": IDL2.Text
        })
      ],
      []
    ),
    "getCategory": IDL2.Func([CategoryId2], [IDL2.Opt(Category2)], ["query"]),
    "getCategoryBySlug": IDL2.Func([IDL2.Text], [IDL2.Opt(Category2)], ["query"]),
    "getFeaturedBlock": IDL2.Func(
      [FeaturedBlockId2],
      [IDL2.Opt(FeaturedBlock2)],
      ["query"]
    ),
    "getFooterSettings": IDL2.Func(
      [],
      [
        IDL2.Record({
          "tagline": IDL2.Text,
          "socialLinks": IDL2.Vec(SocialLink2),
          "policyContent": IDL2.Text,
          "aboutContent": IDL2.Text,
          "copyright": IDL2.Text
        })
      ],
      ["query"]
    ),
    "getHeroBanner": IDL2.Func(
      [HeroBannerId2],
      [IDL2.Opt(HeroBanner2)],
      ["query"]
    ),
    "getMyCart": IDL2.Func([], [CartPublic2], []),
    "getMyOrders": IDL2.Func([], [IDL2.Vec(OrderPublic2)], ["query"]),
    "getMyProfile": IDL2.Func([], [UserProfilePublic2], []),
    "getMyVendorOrders": IDL2.Func(
      [],
      [IDL2.Vec(VendorOrderSummary2)],
      ["query"]
    ),
    "getMyVendorProfile": IDL2.Func(
      [],
      [IDL2.Variant({ "ok": VendorProfile2, "err": IDL2.Text })],
      ["query"]
    ),
    "getOrder": IDL2.Func([OrderId2], [IDL2.Opt(OrderPublic2)], ["query"]),
    "getProduct": IDL2.Func([ProductId2], [IDL2.Opt(Product2)], ["query"]),
    "getReviews": IDL2.Func([], [IDL2.Vec(CustomerReview2)], ["query"]),
    "getServicesAvailability": IDL2.Func(
      [],
      [IDL2.Record({ "available": IDL2.Bool, "message": IDL2.Text })],
      ["query"]
    ),
    "getSiteSettings": IDL2.Func(
      [],
      [
        IDL2.Record({
          "heroSubtitle": IDL2.Text,
          "howitworksSteps": IDL2.Vec(HowItWorksStep2),
          "logoUrl": IDL2.Opt(IDL2.Text),
          "faviconUrl": IDL2.Opt(IDL2.Text),
          "heroTagline": IDL2.Text
        })
      ],
      ["query"]
    ),
    "getVendorForProduct": IDL2.Func(
      [IDL2.Text],
      [IDL2.Opt(VendorSummary2)],
      ["query"]
    ),
    "getVendorStatusBySession": IDL2.Func(
      [IDL2.Text],
      [IDL2.Opt(VendorStatus2)],
      ["query"]
    ),
    "getVideoByte": IDL2.Func(
      [],
      [
        IDL2.Record({
          "url": IDL2.Text,
          "title": IDL2.Text,
          "enabled": IDL2.Bool
        })
      ],
      ["query"]
    ),
    "isAdminSession": IDL2.Func([IDL2.Text], [IDL2.Bool], ["query"]),
    "isCurrentUserAdmin": IDL2.Func([], [IDL2.Bool], ["query"]),
    "listBestSellers": IDL2.Func([IDL2.Nat], [IDL2.Vec(Product2)], ["query"]),
    "listCategories": IDL2.Func([], [IDL2.Vec(Category2)], ["query"]),
    "listFeaturedBlocks": IDL2.Func([], [IDL2.Vec(FeaturedBlock2)], ["query"]),
    "listHeroBanners": IDL2.Func([], [IDL2.Vec(HeroBanner2)], ["query"]),
    "listNewArrivals": IDL2.Func([IDL2.Nat], [IDL2.Vec(Product2)], ["query"]),
    "listProducts": IDL2.Func([ProductFilter2], [ProductListResult2], ["query"]),
    "listProductsByCategory": IDL2.Func(
      [CategoryId2, IDL2.Nat, IDL2.Nat],
      [ProductListResult2],
      ["query"]
    ),
    "processVendorActionToken": IDL2.Func(
      [IDL2.Text, IDL2.Variant({ "reject": IDL2.Null, "approve": IDL2.Null })],
      [IDL2.Variant({ "ok": IDL2.Text, "err": IDL2.Text })],
      []
    ),
    "razorpayTransform": IDL2.Func(
      [TransformationInput2],
      [TransformationOutput2],
      ["query"]
    ),
    "registerVendor": IDL2.Func(
      [VendorRegistration2],
      [IDL2.Variant({ "ok": IDL2.Text, "err": IDL2.Text })],
      []
    ),
    "removeFromCart": IDL2.Func([IDL2.Nat], [CartPublic2], []),
    "requestOtp": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "searchProducts": IDL2.Func(
      [IDL2.Text, IDL2.Nat, IDL2.Nat],
      [ProductListResult2],
      ["query"]
    ),
    "submitServiceRequest": IDL2.Func(
      [CreateServiceRequestInput2],
      [ServiceRequestPublic2],
      []
    ),
    "updateCartItem": IDL2.Func([IDL2.Nat, IDL2.Nat], [CartPublic2], []),
    "updateMyProfile": IDL2.Func([UserProfileInput2], [UserProfilePublic2], []),
    "vendorGetMyProducts": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Vec(VendorProductView2), "err": IDL2.Text })],
      []
    ),
    "vendorSubmitProduct": IDL2.Func(
      [IDL2.Text, VendorProductInput2],
      [IDL2.Variant({ "ok": VendorProductView2, "err": IDL2.Text })],
      []
    ),
    "vendorUpdateProductQuantity": IDL2.Func(
      [IDL2.Text, IDL2.Nat, IDL2.Nat],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "verifyOtp": IDL2.Func(
      [IDL2.Text, IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Text, "err": IDL2.Text })],
      []
    ),
    "verifyRazorpayPayment": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Bool, "err": IDL2.Text })],
      []
    ),
    "verifyVendorOtp": IDL2.Func(
      [IDL2.Text, IDL2.Text],
      [
        IDL2.Variant({
          "ok": IDL2.Record({ "status": VendorStatus2, "token": IDL2.Text }),
          "err": IDL2.Text
        })
      ],
      []
    )
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
class ExternalBlob {
  constructor(directURL, blob) {
    __publicField(this, "_blob");
    __publicField(this, "directURL");
    __publicField(this, "onProgress");
    if (blob) {
      this._blob = blob;
    }
    this.directURL = directURL;
  }
  static fromURL(url) {
    return new ExternalBlob(url, null);
  }
  static fromBytes(blob) {
    const url = URL.createObjectURL(new Blob([
      new Uint8Array(blob)
    ], {
      type: "application/octet-stream"
    }));
    return new ExternalBlob(url, blob);
  }
  async getBytes() {
    if (this._blob) {
      return this._blob;
    }
    const response = await fetch(this.directURL);
    const blob = await response.blob();
    this._blob = new Uint8Array(await blob.arrayBuffer());
    return this._blob;
  }
  getDirectURL() {
    return this.directURL;
  }
  withUploadProgress(onProgress) {
    this.onProgress = onProgress;
    return this;
  }
}
var DeliveryType = /* @__PURE__ */ ((DeliveryType2) => {
  DeliveryType2["Standard"] = "Standard";
  DeliveryType2["Express"] = "Express";
  return DeliveryType2;
})(DeliveryType || {});
var OrderStatus = /* @__PURE__ */ ((OrderStatus2) => {
  OrderStatus2["Delivered"] = "Delivered";
  OrderStatus2["Confirmed"] = "Confirmed";
  OrderStatus2["Cancelled"] = "Cancelled";
  OrderStatus2["Processing"] = "Processing";
  OrderStatus2["Shipped"] = "Shipped";
  OrderStatus2["OutForDelivery"] = "OutForDelivery";
  return OrderStatus2;
})(OrderStatus || {});
var ServiceRequestStatus = /* @__PURE__ */ ((ServiceRequestStatus2) => {
  ServiceRequestStatus2["New"] = "New";
  ServiceRequestStatus2["Contacted"] = "Contacted";
  ServiceRequestStatus2["Cancelled"] = "Cancelled";
  ServiceRequestStatus2["Completed"] = "Completed";
  return ServiceRequestStatus2;
})(ServiceRequestStatus || {});
var ServiceType = /* @__PURE__ */ ((ServiceType2) => {
  ServiceType2["Ambulance"] = "Ambulance";
  ServiceType2["FoodDelivery"] = "FoodDelivery";
  ServiceType2["Taxi"] = "Taxi";
  ServiceType2["SchoolAdmissions"] = "SchoolAdmissions";
  ServiceType2["Medicines"] = "Medicines";
  ServiceType2["Gifting"] = "Gifting";
  ServiceType2["FuneralServices"] = "FuneralServices";
  ServiceType2["Tourism"] = "Tourism";
  ServiceType2["Doctors"] = "Doctors";
  ServiceType2["VideoConferencing"] = "VideoConferencing";
  ServiceType2["EventManagement"] = "EventManagement";
  ServiceType2["WeddingsAnniversaries"] = "WeddingsAnniversaries";
  ServiceType2["Other"] = "Other";
  return ServiceType2;
})(ServiceType || {});
var Variant_pending_approved_rejected = /* @__PURE__ */ ((Variant_pending_approved_rejected2) => {
  Variant_pending_approved_rejected2["pending"] = "pending";
  Variant_pending_approved_rejected2["approved"] = "approved";
  Variant_pending_approved_rejected2["rejected"] = "rejected";
  return Variant_pending_approved_rejected2;
})(Variant_pending_approved_rejected || {});
var Variant_reject_approve = /* @__PURE__ */ ((Variant_reject_approve2) => {
  Variant_reject_approve2["reject"] = "reject";
  Variant_reject_approve2["approve"] = "approve";
  return Variant_reject_approve2;
})(Variant_reject_approve || {});
var VendorType = /* @__PURE__ */ ((VendorType2) => {
  VendorType2["rawMaterial"] = "rawMaterial";
  VendorType2["brand"] = "brand";
  return VendorType2;
})(VendorType || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async _immutableObjectStorageBlobsAreLive(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageBlobsAreLive(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageBlobsAreLive(arg0);
      return result;
    }
  }
  async _immutableObjectStorageBlobsToDelete() {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageBlobsToDelete();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageBlobsToDelete();
      return result;
    }
  }
  async _immutableObjectStorageConfirmBlobDeletion(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageConfirmBlobDeletion(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageConfirmBlobDeletion(arg0);
      return result;
    }
  }
  async _immutableObjectStorageCreateCertificate(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageCreateCertificate(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageCreateCertificate(arg0);
      return result;
    }
  }
  async _immutableObjectStorageRefillCashier(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageRefillCashier(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0));
        return from_candid__ImmutableObjectStorageRefillResult_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageRefillCashier(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0));
      return from_candid__ImmutableObjectStorageRefillResult_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async _immutableObjectStorageUpdateGatewayPrincipals() {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageUpdateGatewayPrincipals();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageUpdateGatewayPrincipals();
      return result;
    }
  }
  async addMyAddress(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.addMyAddress(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addMyAddress(arg0);
      return result;
    }
  }
  async addToCart(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.addToCart(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addToCart(arg0, arg1);
      return result;
    }
  }
  async adminAddCategory(arg0, arg1, arg2, arg3, arg4) {
    if (this.processError) {
      try {
        const result = await this.actor.adminAddCategory(arg0, arg1, arg2, arg3, arg4);
        return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminAddCategory(arg0, arg1, arg2, arg3, arg4);
      return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminAddFeaturedBlock(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminAddFeaturedBlock(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminAddFeaturedBlock(arg0, arg1);
      return result;
    }
  }
  async adminAddHeroBanner(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminAddHeroBanner(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminAddHeroBanner(arg0, arg1);
      return result;
    }
  }
  async adminAddProduct(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminAddProduct(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminAddProduct(arg0, arg1);
      return result;
    }
  }
  async adminAddReview(arg0, arg1, arg2, arg3, arg4) {
    if (this.processError) {
      try {
        const result = await this.actor.adminAddReview(arg0, arg1, arg2, arg3, arg4);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminAddReview(arg0, arg1, arg2, arg3, arg4);
      return result;
    }
  }
  async adminAddSubCategory(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.adminAddSubCategory(arg0, arg1, arg2, arg3);
        return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminAddSubCategory(arg0, arg1, arg2, arg3);
      return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminApproveVendor(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminApproveVendor(arg0, arg1);
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminApproveVendor(arg0, arg1);
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminApproveVendorProduct(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.adminApproveVendorProduct(arg0, arg1, arg2, to_candid_opt_n10(this._uploadFile, this._downloadFile, arg3));
        return from_candid_variant_n11(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminApproveVendorProduct(arg0, arg1, arg2, to_candid_opt_n10(this._uploadFile, this._downloadFile, arg3));
      return from_candid_variant_n11(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminAssignProductToVendor(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminAssignProductToVendor(arg0, arg1, arg2);
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminAssignProductToVendor(arg0, arg1, arg2);
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminDeleteCategory(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminDeleteCategory(arg0, arg1);
        return from_candid_variant_n19(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminDeleteCategory(arg0, arg1);
      return from_candid_variant_n19(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminDeleteFeaturedBlock(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminDeleteFeaturedBlock(arg0, arg1);
        return from_candid_variant_n19(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminDeleteFeaturedBlock(arg0, arg1);
      return from_candid_variant_n19(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminDeleteHeroBanner(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminDeleteHeroBanner(arg0, arg1);
        return from_candid_variant_n19(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminDeleteHeroBanner(arg0, arg1);
      return from_candid_variant_n19(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminDeleteProduct(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminDeleteProduct(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminDeleteProduct(arg0, arg1);
      return result;
    }
  }
  async adminDeleteReview(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminDeleteReview(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminDeleteReview(arg0, arg1);
      return result;
    }
  }
  async adminDeleteServiceRequest(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminDeleteServiceRequest(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminDeleteServiceRequest(arg0, arg1);
      return result;
    }
  }
  async adminDeleteSubCategory(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminDeleteSubCategory(arg0, arg1, arg2);
        return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminDeleteSubCategory(arg0, arg1, arg2);
      return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminGetAllOrders(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminGetAllOrders(arg0, arg1);
        return from_candid_vec_n20(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminGetAllOrders(arg0, arg1);
      return from_candid_vec_n20(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminGetCategories(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminGetCategories(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminGetCategories(arg0);
      return result;
    }
  }
  async adminGetServiceRequests(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminGetServiceRequests(arg0);
        return from_candid_vec_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminGetServiceRequests(arg0);
      return from_candid_vec_n30(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminListFeaturedBlocks(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminListFeaturedBlocks(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminListFeaturedBlocks(arg0);
      return result;
    }
  }
  async adminListHeroBanners(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminListHeroBanners(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminListHeroBanners(arg0);
      return result;
    }
  }
  async adminListVendorProducts(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminListVendorProducts(arg0);
        return from_candid_vec_n37(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminListVendorProducts(arg0);
      return from_candid_vec_n37(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminListVendorProductsByVendor(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminListVendorProductsByVendor(arg0, arg1);
        return from_candid_vec_n37(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminListVendorProductsByVendor(arg0, arg1);
      return from_candid_vec_n37(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminListVendors(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminListVendors(to_candid_opt_n38(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n41(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminListVendors(to_candid_opt_n38(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n41(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminLogin(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminLogin(arg0, arg1);
        return from_candid_opt_n15(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminLogin(arg0, arg1);
      return from_candid_opt_n15(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminLogout(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminLogout(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminLogout(arg0);
      return result;
    }
  }
  async adminRegisterImageHash(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminRegisterImageHash(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminRegisterImageHash(arg0, arg1);
      return result;
    }
  }
  async adminRejectVendor(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminRejectVendor(arg0, arg1, arg2);
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminRejectVendor(arg0, arg1, arg2);
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminRejectVendorProduct(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminRejectVendorProduct(arg0, arg1, arg2);
        return from_candid_variant_n11(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminRejectVendorProduct(arg0, arg1, arg2);
      return from_candid_variant_n11(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminReorderHeroBanner(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminReorderHeroBanner(arg0, arg1, arg2);
        return from_candid_variant_n46(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminReorderHeroBanner(arg0, arg1, arg2);
      return from_candid_variant_n46(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminRequestOtp() {
    if (this.processError) {
      try {
        const result = await this.actor.adminRequestOtp();
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminRequestOtp();
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminSetDiscount(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminSetDiscount(arg0, arg1, arg2);
        return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminSetDiscount(arg0, arg1, arg2);
      return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminSetUserAdmin(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminSetUserAdmin(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminSetUserAdmin(arg0, arg1);
      return result;
    }
  }
  async adminSuspendVendor(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminSuspendVendor(arg0, arg1);
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminSuspendVendor(arg0, arg1);
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUnassignProductFromVendor(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUnassignProductFromVendor(arg0, arg1, arg2);
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUnassignProductFromVendor(arg0, arg1, arg2);
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateCategory(arg0, arg1, arg2, arg3, arg4, arg5) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateCategory(arg0, arg1, arg2, arg3, arg4, arg5);
        return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateCategory(arg0, arg1, arg2, arg3, arg4, arg5);
      return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateFeaturedBlock(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateFeaturedBlock(arg0, arg1, arg2);
        return from_candid_variant_n48(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateFeaturedBlock(arg0, arg1, arg2);
      return from_candid_variant_n48(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateFooterSettings(arg0, arg1, arg2, arg3, arg4) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateFooterSettings(arg0, arg1, arg2, arg3, arg4);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateFooterSettings(arg0, arg1, arg2, arg3, arg4);
      return result;
    }
  }
  async adminUpdateHeroAndHowitworks(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateHeroAndHowitworks(arg0, arg1, arg2, arg3);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateHeroAndHowitworks(arg0, arg1, arg2, arg3);
      return result;
    }
  }
  async adminUpdateHeroBanner(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateHeroBanner(arg0, arg1, arg2);
        return from_candid_variant_n46(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateHeroBanner(arg0, arg1, arg2);
      return from_candid_variant_n46(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateOrderStatus(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateOrderStatus(arg0, to_candid_OrderStatus_n49(this._uploadFile, this._downloadFile, arg1), arg2);
        return from_candid_opt_n51(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateOrderStatus(arg0, to_candid_OrderStatus_n49(this._uploadFile, this._downloadFile, arg1), arg2);
      return from_candid_opt_n51(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdatePolicyContent(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdatePolicyContent(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdatePolicyContent(arg0, arg1);
      return result;
    }
  }
  async adminUpdateProduct(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateProduct(arg0, arg1, arg2);
        return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateProduct(arg0, arg1, arg2);
      return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateReview(arg0, arg1, arg2, arg3, arg4, arg5) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateReview(arg0, arg1, arg2, arg3, arg4, arg5);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateReview(arg0, arg1, arg2, arg3, arg4, arg5);
      return result;
    }
  }
  async adminUpdateServiceRequestStatus(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateServiceRequestStatus(arg0, arg1, to_candid_ServiceRequestStatus_n52(this._uploadFile, this._downloadFile, arg2));
        return from_candid_opt_n54(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateServiceRequestStatus(arg0, arg1, to_candid_ServiceRequestStatus_n52(this._uploadFile, this._downloadFile, arg2));
      return from_candid_opt_n54(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateServicesAvailability(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateServicesAvailability(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateServicesAvailability(arg0, arg1, arg2);
      return result;
    }
  }
  async adminUpdateSiteSettings(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateSiteSettings(arg0, to_candid_opt_n55(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n55(this._uploadFile, this._downloadFile, arg2));
        return from_candid_record_n56(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateSiteSettings(arg0, to_candid_opt_n55(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n55(this._uploadFile, this._downloadFile, arg2));
      return from_candid_record_n56(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateStock(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateStock(arg0, arg1, arg2);
        return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateStock(arg0, arg1, arg2);
      return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateSubCategory(arg0, arg1, arg2, arg3, arg4) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateSubCategory(arg0, arg1, arg2, arg3, arg4);
        return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateSubCategory(arg0, arg1, arg2, arg3, arg4);
      return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateVendorProductQuantity(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateVendorProductQuantity(arg0, arg1, arg2);
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateVendorProductQuantity(arg0, arg1, arg2);
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateVideoByte(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateVideoByte(arg0, arg1, arg2, arg3);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateVideoByte(arg0, arg1, arg2, arg3);
      return result;
    }
  }
  async adminVerifyKey(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminVerifyKey(arg0);
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminVerifyKey(arg0);
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminVerifyOtp(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminVerifyOtp(arg0);
        return from_candid_variant_n57(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminVerifyOtp(arg0);
      return from_candid_variant_n57(this._uploadFile, this._downloadFile, result);
    }
  }
  async claimAdminIfFirst() {
    if (this.processError) {
      try {
        const result = await this.actor.claimAdminIfFirst();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.claimAdminIfFirst();
      return result;
    }
  }
  async clearMyCart() {
    if (this.processError) {
      try {
        const result = await this.actor.clearMyCart();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.clearMyCart();
      return result;
    }
  }
  async createOrder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createOrder(to_candid_CreateOrderInput_n58(this._uploadFile, this._downloadFile, arg0));
        return from_candid_OrderPublic_n21(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createOrder(to_candid_CreateOrderInput_n58(this._uploadFile, this._downloadFile, arg0));
      return from_candid_OrderPublic_n21(this._uploadFile, this._downloadFile, result);
    }
  }
  async createRazorpayOrder(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.createRazorpayOrder(arg0, arg1);
        return from_candid_variant_n62(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createRazorpayOrder(arg0, arg1);
      return from_candid_variant_n62(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCategory(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCategory(arg0);
        return from_candid_opt_n63(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCategory(arg0);
      return from_candid_opt_n63(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCategoryBySlug(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCategoryBySlug(arg0);
        return from_candid_opt_n63(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCategoryBySlug(arg0);
      return from_candid_opt_n63(this._uploadFile, this._downloadFile, result);
    }
  }
  async getFeaturedBlock(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getFeaturedBlock(arg0);
        return from_candid_opt_n64(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getFeaturedBlock(arg0);
      return from_candid_opt_n64(this._uploadFile, this._downloadFile, result);
    }
  }
  async getFooterSettings() {
    if (this.processError) {
      try {
        const result = await this.actor.getFooterSettings();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getFooterSettings();
      return result;
    }
  }
  async getHeroBanner(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getHeroBanner(arg0);
        return from_candid_opt_n65(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getHeroBanner(arg0);
      return from_candid_opt_n65(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyCart() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyCart();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyCart();
      return result;
    }
  }
  async getMyOrders() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyOrders();
        return from_candid_vec_n20(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyOrders();
      return from_candid_vec_n20(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyProfile() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyProfile();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyProfile();
      return result;
    }
  }
  async getMyVendorOrders() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyVendorOrders();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyVendorOrders();
      return result;
    }
  }
  async getMyVendorProfile() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyVendorProfile();
        return from_candid_variant_n66(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyVendorProfile();
      return from_candid_variant_n66(this._uploadFile, this._downloadFile, result);
    }
  }
  async getOrder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getOrder(arg0);
        return from_candid_opt_n51(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getOrder(arg0);
      return from_candid_opt_n51(this._uploadFile, this._downloadFile, result);
    }
  }
  async getProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getProduct(arg0);
        return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProduct(arg0);
      return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
    }
  }
  async getReviews() {
    if (this.processError) {
      try {
        const result = await this.actor.getReviews();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReviews();
      return result;
    }
  }
  async getServicesAvailability() {
    if (this.processError) {
      try {
        const result = await this.actor.getServicesAvailability();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getServicesAvailability();
      return result;
    }
  }
  async getSiteSettings() {
    if (this.processError) {
      try {
        const result = await this.actor.getSiteSettings();
        return from_candid_record_n68(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSiteSettings();
      return from_candid_record_n68(this._uploadFile, this._downloadFile, result);
    }
  }
  async getVendorForProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getVendorForProduct(arg0);
        return from_candid_opt_n69(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getVendorForProduct(arg0);
      return from_candid_opt_n69(this._uploadFile, this._downloadFile, result);
    }
  }
  async getVendorStatusBySession(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getVendorStatusBySession(arg0);
        return from_candid_opt_n70(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getVendorStatusBySession(arg0);
      return from_candid_opt_n70(this._uploadFile, this._downloadFile, result);
    }
  }
  async getVideoByte() {
    if (this.processError) {
      try {
        const result = await this.actor.getVideoByte();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getVideoByte();
      return result;
    }
  }
  async isAdminSession(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.isAdminSession(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isAdminSession(arg0);
      return result;
    }
  }
  async isCurrentUserAdmin() {
    if (this.processError) {
      try {
        const result = await this.actor.isCurrentUserAdmin();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isCurrentUserAdmin();
      return result;
    }
  }
  async listBestSellers(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listBestSellers(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listBestSellers(arg0);
      return result;
    }
  }
  async listCategories() {
    if (this.processError) {
      try {
        const result = await this.actor.listCategories();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listCategories();
      return result;
    }
  }
  async listFeaturedBlocks() {
    if (this.processError) {
      try {
        const result = await this.actor.listFeaturedBlocks();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listFeaturedBlocks();
      return result;
    }
  }
  async listHeroBanners() {
    if (this.processError) {
      try {
        const result = await this.actor.listHeroBanners();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listHeroBanners();
      return result;
    }
  }
  async listNewArrivals(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listNewArrivals(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listNewArrivals(arg0);
      return result;
    }
  }
  async listProducts(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listProducts(to_candid_ProductFilter_n71(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listProducts(to_candid_ProductFilter_n71(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async listProductsByCategory(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.listProductsByCategory(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listProductsByCategory(arg0, arg1, arg2);
      return result;
    }
  }
  async processVendorActionToken(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.processVendorActionToken(arg0, to_candid_variant_n73(this._uploadFile, this._downloadFile, arg1));
        return from_candid_variant_n57(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.processVendorActionToken(arg0, to_candid_variant_n73(this._uploadFile, this._downloadFile, arg1));
      return from_candid_variant_n57(this._uploadFile, this._downloadFile, result);
    }
  }
  async razorpayTransform(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.razorpayTransform(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.razorpayTransform(arg0);
      return result;
    }
  }
  async registerVendor(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.registerVendor(to_candid_VendorRegistration_n74(this._uploadFile, this._downloadFile, arg0));
        return from_candid_variant_n57(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.registerVendor(to_candid_VendorRegistration_n74(this._uploadFile, this._downloadFile, arg0));
      return from_candid_variant_n57(this._uploadFile, this._downloadFile, result);
    }
  }
  async removeFromCart(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removeFromCart(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeFromCart(arg0);
      return result;
    }
  }
  async requestOtp(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.requestOtp(arg0);
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.requestOtp(arg0);
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async searchProducts(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.searchProducts(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchProducts(arg0, arg1, arg2);
      return result;
    }
  }
  async submitServiceRequest(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.submitServiceRequest(to_candid_CreateServiceRequestInput_n78(this._uploadFile, this._downloadFile, arg0));
        return from_candid_ServiceRequestPublic_n31(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitServiceRequest(to_candid_CreateServiceRequestInput_n78(this._uploadFile, this._downloadFile, arg0));
      return from_candid_ServiceRequestPublic_n31(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateCartItem(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateCartItem(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateCartItem(arg0, arg1);
      return result;
    }
  }
  async updateMyProfile(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateMyProfile(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateMyProfile(arg0);
      return result;
    }
  }
  async vendorGetMyProducts(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.vendorGetMyProducts(arg0);
        return from_candid_variant_n82(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.vendorGetMyProducts(arg0);
      return from_candid_variant_n82(this._uploadFile, this._downloadFile, result);
    }
  }
  async vendorSubmitProduct(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.vendorSubmitProduct(arg0, to_candid_VendorProductInput_n83(this._uploadFile, this._downloadFile, arg1));
        return from_candid_variant_n11(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.vendorSubmitProduct(arg0, to_candid_VendorProductInput_n83(this._uploadFile, this._downloadFile, arg1));
      return from_candid_variant_n11(this._uploadFile, this._downloadFile, result);
    }
  }
  async vendorUpdateProductQuantity(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.vendorUpdateProductQuantity(arg0, arg1, arg2);
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.vendorUpdateProductQuantity(arg0, arg1, arg2);
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async verifyOtp(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.verifyOtp(arg0, arg1);
        return from_candid_variant_n57(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.verifyOtp(arg0, arg1);
      return from_candid_variant_n57(this._uploadFile, this._downloadFile, result);
    }
  }
  async verifyRazorpayPayment(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.verifyRazorpayPayment(arg0, arg1, arg2);
        return from_candid_variant_n19(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.verifyRazorpayPayment(arg0, arg1, arg2);
      return from_candid_variant_n19(this._uploadFile, this._downloadFile, result);
    }
  }
  async verifyVendorOtp(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.verifyVendorOtp(arg0, arg1);
        return from_candid_variant_n85(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.verifyVendorOtp(arg0, arg1);
      return from_candid_variant_n85(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_DeliveryType_n28(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n29(_uploadFile, _downloadFile, value);
}
function from_candid_OrderPublic_n21(_uploadFile, _downloadFile, value) {
  return from_candid_record_n22(_uploadFile, _downloadFile, value);
}
function from_candid_OrderStatus_n23(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n24(_uploadFile, _downloadFile, value);
}
function from_candid_ServiceRequestPublic_n31(_uploadFile, _downloadFile, value) {
  return from_candid_record_n32(_uploadFile, _downloadFile, value);
}
function from_candid_ServiceRequestStatus_n33(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n34(_uploadFile, _downloadFile, value);
}
function from_candid_ServiceType_n35(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n36(_uploadFile, _downloadFile, value);
}
function from_candid_ShipmentUpdate_n26(_uploadFile, _downloadFile, value) {
  return from_candid_record_n27(_uploadFile, _downloadFile, value);
}
function from_candid_VendorProductView_n12(_uploadFile, _downloadFile, value) {
  return from_candid_record_n13(_uploadFile, _downloadFile, value);
}
function from_candid_VendorProfile_n67(_uploadFile, _downloadFile, value) {
  return from_candid_record_n43(_uploadFile, _downloadFile, value);
}
function from_candid_VendorStatus_n44(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n45(_uploadFile, _downloadFile, value);
}
function from_candid_VendorSummary_n42(_uploadFile, _downloadFile, value) {
  return from_candid_record_n43(_uploadFile, _downloadFile, value);
}
function from_candid_VendorType_n17(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n18(_uploadFile, _downloadFile, value);
}
function from_candid__ImmutableObjectStorageRefillResult_n4(_uploadFile, _downloadFile, value) {
  return from_candid_record_n5(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n15(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n16(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n47(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n51(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_OrderPublic_n21(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n54(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_ServiceRequestPublic_n31(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n6(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n63(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n64(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n65(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n69(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_VendorSummary_n42(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n70(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_VendorStatus_n44(_uploadFile, _downloadFile, value[0]);
}
function from_candid_record_n13(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    moq: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.moq)),
    mrp: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.mrp)),
    finalPrice: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.finalPrice)),
    status: from_candid_variant_n14(_uploadFile, _downloadFile, value.status),
    packagingCost: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.packagingCost)),
    taxPercent: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.taxPercent)),
    imageUrls: value.imageUrls,
    fssaiDocumentUrl: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.fssaiDocumentUrl)),
    pricePerKg: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.pricePerKg)),
    rejectionReason: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.rejectionReason)),
    supplyPrice: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.supplyPrice)),
    submittedAt: value.submittedAt,
    description: value.description,
    productName: value.productName,
    reviewedAt: record_opt_to_undefined(from_candid_opt_n16(_uploadFile, _downloadFile, value.reviewedAt)),
    availableQuantityKg: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.availableQuantityKg)),
    vendorId: value.vendorId,
    category: value.category,
    basePrice: value.basePrice,
    vendorEmail: value.vendorEmail,
    vendorName: value.vendorName,
    vendorType: from_candid_VendorType_n17(_uploadFile, _downloadFile, value.vendorType)
  };
}
function from_candid_record_n22(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_OrderStatus_n23(_uploadFile, _downloadFile, value.status),
    deliveryAddress: value.deliveryAddress,
    shipmentUpdates: from_candid_vec_n25(_uploadFile, _downloadFile, value.shipmentUpdates),
    paymentMethod: value.paymentMethod,
    userId: value.userId,
    createdAt: value.createdAt,
    estimatedDelivery: record_opt_to_undefined(from_candid_opt_n16(_uploadFile, _downloadFile, value.estimatedDelivery)),
    deliveryCost: value.deliveryCost,
    deliveryType: from_candid_DeliveryType_n28(_uploadFile, _downloadFile, value.deliveryType),
    updatedAt: value.updatedAt,
    totalAmount: value.totalAmount,
    items: value.items
  };
}
function from_candid_record_n27(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_OrderStatus_n23(_uploadFile, _downloadFile, value.status),
    message: value.message,
    timestamp: value.timestamp
  };
}
function from_candid_record_n32(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_ServiceRequestStatus_n33(_uploadFile, _downloadFile, value.status),
    userName: value.userName,
    serviceType: from_candid_ServiceType_n35(_uploadFile, _downloadFile, value.serviceType),
    userId: value.userId,
    recipientPhone: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.recipientPhone)),
    submittedAt: value.submittedAt,
    description: value.description,
    userPhone: value.userPhone,
    lastUpdatedAt: value.lastUpdatedAt,
    isRequestForSelf: value.isRequestForSelf,
    preferredDate: value.preferredDate,
    preferredTime: value.preferredTime,
    recipientAddress: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.recipientAddress)),
    recipientName: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.recipientName))
  };
}
function from_candid_record_n43(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    bankAccountNumber: value.bankAccountNumber,
    categories: value.categories,
    status: from_candid_VendorStatus_n44(_uploadFile, _downloadFile, value.status),
    assignedProductIds: value.assignedProductIds,
    ifscCode: value.ifscCode,
    fssaiDocumentUrl: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.fssaiDocumentUrl)),
    approvedAt: record_opt_to_undefined(from_candid_opt_n16(_uploadFile, _downloadFile, value.approvedAt)),
    businessName: value.businessName,
    address: value.address,
    contactEmail: value.contactEmail,
    brandName: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.brandName)),
    phone: value.phone,
    packagingDetails: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.packagingDetails)),
    registeredAt: value.registeredAt,
    vendorType: from_candid_VendorType_n17(_uploadFile, _downloadFile, value.vendorType),
    gstinNumber: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.gstinNumber))
  };
}
function from_candid_record_n5(_uploadFile, _downloadFile, value) {
  return {
    success: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.success)),
    topped_up_amount: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.topped_up_amount))
  };
}
function from_candid_record_n56(_uploadFile, _downloadFile, value) {
  return {
    logoUrl: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.logoUrl)),
    faviconUrl: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.faviconUrl))
  };
}
function from_candid_record_n68(_uploadFile, _downloadFile, value) {
  return {
    heroSubtitle: value.heroSubtitle,
    howitworksSteps: value.howitworksSteps,
    logoUrl: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.logoUrl)),
    faviconUrl: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.faviconUrl)),
    heroTagline: value.heroTagline
  };
}
function from_candid_record_n86(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_VendorStatus_n44(_uploadFile, _downloadFile, value.status),
    token: value.token
  };
}
function from_candid_variant_n11(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_VendorProductView_n12(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n14(_uploadFile, _downloadFile, value) {
  return "pending" in value ? "pending" : "approved" in value ? "approved" : "rejected" in value ? "rejected" : value;
}
function from_candid_variant_n18(_uploadFile, _downloadFile, value) {
  return "rawMaterial" in value ? "rawMaterial" : "brand" in value ? "brand" : value;
}
function from_candid_variant_n19(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n24(_uploadFile, _downloadFile, value) {
  return "Delivered" in value ? "Delivered" : "Confirmed" in value ? "Confirmed" : "Cancelled" in value ? "Cancelled" : "Processing" in value ? "Processing" : "Shipped" in value ? "Shipped" : "OutForDelivery" in value ? "OutForDelivery" : value;
}
function from_candid_variant_n29(_uploadFile, _downloadFile, value) {
  return "Standard" in value ? "Standard" : "Express" in value ? "Express" : value;
}
function from_candid_variant_n34(_uploadFile, _downloadFile, value) {
  return "New" in value ? "New" : "Contacted" in value ? "Contacted" : "Cancelled" in value ? "Cancelled" : "Completed" in value ? "Completed" : value;
}
function from_candid_variant_n36(_uploadFile, _downloadFile, value) {
  return "Ambulance" in value ? "Ambulance" : "FoodDelivery" in value ? "FoodDelivery" : "Taxi" in value ? "Taxi" : "SchoolAdmissions" in value ? "SchoolAdmissions" : "Medicines" in value ? "Medicines" : "Gifting" in value ? "Gifting" : "FuneralServices" in value ? "FuneralServices" : "Tourism" in value ? "Tourism" : "Doctors" in value ? "Doctors" : "VideoConferencing" in value ? "VideoConferencing" : "EventManagement" in value ? "EventManagement" : "WeddingsAnniversaries" in value ? "WeddingsAnniversaries" : "Other" in value ? "Other" : value;
}
function from_candid_variant_n45(_uploadFile, _downloadFile, value) {
  return "pending" in value ? "pending" : "approved" in value ? "approved" : "rejected" in value ? "rejected" : "suspended" in value ? "suspended" : value;
}
function from_candid_variant_n46(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n48(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n57(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n62(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n66(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_VendorProfile_n67(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n8(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n82(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_vec_n37(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n85(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_record_n86(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n9(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_vec_n20(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_OrderPublic_n21(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n25(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ShipmentUpdate_n26(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n30(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ServiceRequestPublic_n31(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n37(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_VendorProductView_n12(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n41(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_VendorSummary_n42(_uploadFile, _downloadFile, x));
}
function to_candid_CreateOrderInput_n58(_uploadFile, _downloadFile, value) {
  return to_candid_record_n59(_uploadFile, _downloadFile, value);
}
function to_candid_CreateServiceRequestInput_n78(_uploadFile, _downloadFile, value) {
  return to_candid_record_n79(_uploadFile, _downloadFile, value);
}
function to_candid_DeliveryType_n60(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n61(_uploadFile, _downloadFile, value);
}
function to_candid_OrderStatus_n49(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n50(_uploadFile, _downloadFile, value);
}
function to_candid_ProductFilter_n71(_uploadFile, _downloadFile, value) {
  return to_candid_record_n72(_uploadFile, _downloadFile, value);
}
function to_candid_ServiceRequestStatus_n52(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n53(_uploadFile, _downloadFile, value);
}
function to_candid_ServiceType_n80(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n81(_uploadFile, _downloadFile, value);
}
function to_candid_VendorProductInput_n83(_uploadFile, _downloadFile, value) {
  return to_candid_record_n84(_uploadFile, _downloadFile, value);
}
function to_candid_VendorRegistration_n74(_uploadFile, _downloadFile, value) {
  return to_candid_record_n75(_uploadFile, _downloadFile, value);
}
function to_candid_VendorStatus_n39(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n40(_uploadFile, _downloadFile, value);
}
function to_candid_VendorType_n76(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n77(_uploadFile, _downloadFile, value);
}
function to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value) {
  return to_candid_record_n3(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n1(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value));
}
function to_candid_opt_n10(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_opt_n38(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(to_candid_VendorStatus_n39(_uploadFile, _downloadFile, value));
}
function to_candid_opt_n55(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_record_n3(_uploadFile, _downloadFile, value) {
  return {
    proposed_top_up_amount: value.proposed_top_up_amount ? candid_some(value.proposed_top_up_amount) : candid_none()
  };
}
function to_candid_record_n59(_uploadFile, _downloadFile, value) {
  return {
    deliveryAddress: value.deliveryAddress,
    paymentMethod: value.paymentMethod,
    deliveryCost: value.deliveryCost,
    deliveryType: to_candid_DeliveryType_n60(_uploadFile, _downloadFile, value.deliveryType),
    items: value.items
  };
}
function to_candid_record_n72(_uploadFile, _downloadFile, value) {
  return {
    categoryId: value.categoryId ? candid_some(value.categoryId) : candid_none(),
    inStockOnly: value.inStockOnly,
    offset: value.offset,
    maxPrice: value.maxPrice ? candid_some(value.maxPrice) : candid_none(),
    limit: value.limit,
    searchTerm: value.searchTerm ? candid_some(value.searchTerm) : candid_none(),
    minPrice: value.minPrice ? candid_some(value.minPrice) : candid_none()
  };
}
function to_candid_record_n75(_uploadFile, _downloadFile, value) {
  return {
    bankAccountNumber: value.bankAccountNumber,
    categories: value.categories,
    ifscCode: value.ifscCode,
    fssaiDocumentUrl: value.fssaiDocumentUrl ? candid_some(value.fssaiDocumentUrl) : candid_none(),
    businessName: value.businessName,
    address: value.address,
    contactEmail: value.contactEmail,
    brandName: value.brandName ? candid_some(value.brandName) : candid_none(),
    phone: value.phone,
    packagingDetails: value.packagingDetails ? candid_some(value.packagingDetails) : candid_none(),
    vendorType: to_candid_VendorType_n76(_uploadFile, _downloadFile, value.vendorType),
    gstinNumber: value.gstinNumber ? candid_some(value.gstinNumber) : candid_none()
  };
}
function to_candid_record_n79(_uploadFile, _downloadFile, value) {
  return {
    userName: value.userName,
    serviceType: to_candid_ServiceType_n80(_uploadFile, _downloadFile, value.serviceType),
    recipientPhone: value.recipientPhone ? candid_some(value.recipientPhone) : candid_none(),
    description: value.description,
    userPhone: value.userPhone,
    isRequestForSelf: value.isRequestForSelf,
    preferredDate: value.preferredDate,
    preferredTime: value.preferredTime,
    recipientAddress: value.recipientAddress ? candid_some(value.recipientAddress) : candid_none(),
    recipientName: value.recipientName ? candid_some(value.recipientName) : candid_none()
  };
}
function to_candid_record_n84(_uploadFile, _downloadFile, value) {
  return {
    moq: value.moq ? candid_some(value.moq) : candid_none(),
    mrp: value.mrp ? candid_some(value.mrp) : candid_none(),
    imageUrls: value.imageUrls,
    fssaiDocumentUrl: value.fssaiDocumentUrl ? candid_some(value.fssaiDocumentUrl) : candid_none(),
    pricePerKg: value.pricePerKg ? candid_some(value.pricePerKg) : candid_none(),
    supplyPrice: value.supplyPrice ? candid_some(value.supplyPrice) : candid_none(),
    description: value.description,
    productName: value.productName,
    availableQuantityKg: value.availableQuantityKg ? candid_some(value.availableQuantityKg) : candid_none(),
    category: value.category,
    basePrice: value.basePrice,
    vendorName: value.vendorName,
    vendorType: to_candid_VendorType_n76(_uploadFile, _downloadFile, value.vendorType)
  };
}
function to_candid_variant_n40(_uploadFile, _downloadFile, value) {
  return value == "pending" ? {
    pending: null
  } : value == "approved" ? {
    approved: null
  } : value == "rejected" ? {
    rejected: null
  } : value == "suspended" ? {
    suspended: null
  } : value;
}
function to_candid_variant_n50(_uploadFile, _downloadFile, value) {
  return value == "Delivered" ? {
    Delivered: null
  } : value == "Confirmed" ? {
    Confirmed: null
  } : value == "Cancelled" ? {
    Cancelled: null
  } : value == "Processing" ? {
    Processing: null
  } : value == "Shipped" ? {
    Shipped: null
  } : value == "OutForDelivery" ? {
    OutForDelivery: null
  } : value;
}
function to_candid_variant_n53(_uploadFile, _downloadFile, value) {
  return value == "New" ? {
    New: null
  } : value == "Contacted" ? {
    Contacted: null
  } : value == "Cancelled" ? {
    Cancelled: null
  } : value == "Completed" ? {
    Completed: null
  } : value;
}
function to_candid_variant_n61(_uploadFile, _downloadFile, value) {
  return value == "Standard" ? {
    Standard: null
  } : value == "Express" ? {
    Express: null
  } : value;
}
function to_candid_variant_n73(_uploadFile, _downloadFile, value) {
  return value == "reject" ? {
    reject: null
  } : value == "approve" ? {
    approve: null
  } : value;
}
function to_candid_variant_n77(_uploadFile, _downloadFile, value) {
  return value == "rawMaterial" ? {
    rawMaterial: null
  } : value == "brand" ? {
    brand: null
  } : value;
}
function to_candid_variant_n81(_uploadFile, _downloadFile, value) {
  return value == "Ambulance" ? {
    Ambulance: null
  } : value == "FoodDelivery" ? {
    FoodDelivery: null
  } : value == "Taxi" ? {
    Taxi: null
  } : value == "SchoolAdmissions" ? {
    SchoolAdmissions: null
  } : value == "Medicines" ? {
    Medicines: null
  } : value == "Gifting" ? {
    Gifting: null
  } : value == "FuneralServices" ? {
    FuneralServices: null
  } : value == "Tourism" ? {
    Tourism: null
  } : value == "Doctors" ? {
    Doctors: null
  } : value == "VideoConferencing" ? {
    VideoConferencing: null
  } : value == "EventManagement" ? {
    EventManagement: null
  } : value == "WeddingsAnniversaries" ? {
    WeddingsAnniversaries: null
  } : value == "Other" ? {
    Other: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
export {
  Backend,
  DeliveryType,
  ExternalBlob,
  OrderStatus,
  ServiceRequestStatus,
  ServiceType,
  Variant_pending_approved_rejected,
  Variant_reject_approve,
  VendorType,
  createActor
};
