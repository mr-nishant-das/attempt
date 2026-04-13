import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, h as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, l as lookupResultToBuffer, i as RequestStatusResponseStatus, U as UnknownError, k as RequestStatusDoneNoReplyErrorCode, m as RejectError, n as CertifiedRejectErrorCode, p as UNREACHABLE_ERROR, I as InputError, q as InvalidReadStateRequestErrorCode, s as ReadRequestType, t as Principal, v as IDL, w as MissingCanisterIdErrorCode, H as HttpAgent, x as encode, Q as QueryResponseStatus, y as UncertifiedRejectErrorCode, z as isV3ResponseBody, A as isV2ResponseBody, B as UncertifiedRejectUpdateErrorCode, D as UnexpectedErrorCode, F as decode, G as Record, V as Vec, J as Variant, O as Opt, N as Nat, K as Service, W as Func, X as Text, Y as Null, Z as Bool, _ as Int, $ as Principal$1 } from "./index-D4oc9L-H.js";
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
  "city": Text,
  "name": Text,
  "line1": Text,
  "line2": Text,
  "state": Text,
  "phone": Text,
  "pincode": Text
});
const ShipmentUpdate = Record({
  "status": OrderStatus$1,
  "message": Text,
  "timestamp": Int
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
  "userId": Principal$1,
  "createdAt": Int,
  "estimatedDelivery": Opt(Int),
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
const CreateOrderInput = Record({
  "deliveryAddress": DeliveryAddress,
  "items": Vec(
    Record({ "productId": Nat, "quantity": Nat })
  )
});
const Category = Record({
  "id": CategoryId,
  "name": Text,
  "slug": Text,
  "description": Text,
  "imageUrl": Text,
  "subCategories": Vec(Text)
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
Service({
  "addMyAddress": Func([Address], [UserProfilePublic], []),
  "addToCart": Func([Nat, Nat], [CartPublic], []),
  "adminAddProduct": Func([ProductInput], [Product], []),
  "adminDeleteProduct": Func([ProductId], [Bool], []),
  "adminDeleteServiceRequest": Func([Nat], [Bool], []),
  "adminGetAllOrders": Func(
    [Nat, Nat],
    [Vec(OrderPublic)],
    ["query"]
  ),
  "adminGetServiceRequests": Func(
    [],
    [Vec(ServiceRequestPublic)],
    ["query"]
  ),
  "adminSetDiscount": Func([ProductId, Nat], [Opt(Product)], []),
  "adminSetUserAdmin": Func([Principal$1, Bool], [Bool], []),
  "adminUpdateOrderStatus": Func(
    [OrderId, OrderStatus$1, Text],
    [Opt(OrderPublic)],
    []
  ),
  "adminUpdateProduct": Func(
    [ProductId, ProductInput],
    [Opt(Product)],
    []
  ),
  "adminUpdateServiceRequestStatus": Func(
    [Nat, ServiceRequestStatus$1],
    [Opt(ServiceRequestPublic)],
    []
  ),
  "adminUpdateStock": Func([ProductId, Nat], [Opt(Product)], []),
  "claimAdminIfFirst": Func([], [Bool], []),
  "clearMyCart": Func([], [], []),
  "createOrder": Func([CreateOrderInput], [OrderPublic], []),
  "getCategory": Func([CategoryId], [Opt(Category)], ["query"]),
  "getCategoryBySlug": Func([Text], [Opt(Category)], ["query"]),
  "getMyCart": Func([], [CartPublic], []),
  "getMyOrders": Func([], [Vec(OrderPublic)], ["query"]),
  "getMyProfile": Func([], [UserProfilePublic], []),
  "getOrder": Func([OrderId], [Opt(OrderPublic)], ["query"]),
  "getProduct": Func([ProductId], [Opt(Product)], ["query"]),
  "isCurrentUserAdmin": Func([], [Bool], ["query"]),
  "listCategories": Func([], [Vec(Category)], ["query"]),
  "listProducts": Func([ProductFilter], [ProductListResult], ["query"]),
  "listProductsByCategory": Func(
    [CategoryId, Nat, Nat],
    [ProductListResult],
    ["query"]
  ),
  "removeFromCart": Func([Nat], [CartPublic], []),
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
  "updateMyProfile": Func([UserProfileInput], [UserProfilePublic], [])
});
const idlFactory = ({ IDL: IDL2 }) => {
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
    "city": IDL2.Text,
    "name": IDL2.Text,
    "line1": IDL2.Text,
    "line2": IDL2.Text,
    "state": IDL2.Text,
    "phone": IDL2.Text,
    "pincode": IDL2.Text
  });
  const ShipmentUpdate2 = IDL2.Record({
    "status": OrderStatus2,
    "message": IDL2.Text,
    "timestamp": IDL2.Int
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
    "userId": IDL2.Principal,
    "createdAt": IDL2.Int,
    "estimatedDelivery": IDL2.Opt(IDL2.Int),
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
  const CreateOrderInput2 = IDL2.Record({
    "deliveryAddress": DeliveryAddress2,
    "items": IDL2.Vec(
      IDL2.Record({ "productId": IDL2.Nat, "quantity": IDL2.Nat })
    )
  });
  const Category2 = IDL2.Record({
    "id": CategoryId2,
    "name": IDL2.Text,
    "slug": IDL2.Text,
    "description": IDL2.Text,
    "imageUrl": IDL2.Text,
    "subCategories": IDL2.Vec(IDL2.Text)
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
  return IDL2.Service({
    "addMyAddress": IDL2.Func([Address2], [UserProfilePublic2], []),
    "addToCart": IDL2.Func([IDL2.Nat, IDL2.Nat], [CartPublic2], []),
    "adminAddProduct": IDL2.Func([ProductInput2], [Product2], []),
    "adminDeleteProduct": IDL2.Func([ProductId2], [IDL2.Bool], []),
    "adminDeleteServiceRequest": IDL2.Func([IDL2.Nat], [IDL2.Bool], []),
    "adminGetAllOrders": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [IDL2.Vec(OrderPublic2)],
      ["query"]
    ),
    "adminGetServiceRequests": IDL2.Func(
      [],
      [IDL2.Vec(ServiceRequestPublic2)],
      ["query"]
    ),
    "adminSetDiscount": IDL2.Func([ProductId2, IDL2.Nat], [IDL2.Opt(Product2)], []),
    "adminSetUserAdmin": IDL2.Func([IDL2.Principal, IDL2.Bool], [IDL2.Bool], []),
    "adminUpdateOrderStatus": IDL2.Func(
      [OrderId2, OrderStatus2, IDL2.Text],
      [IDL2.Opt(OrderPublic2)],
      []
    ),
    "adminUpdateProduct": IDL2.Func(
      [ProductId2, ProductInput2],
      [IDL2.Opt(Product2)],
      []
    ),
    "adminUpdateServiceRequestStatus": IDL2.Func(
      [IDL2.Nat, ServiceRequestStatus2],
      [IDL2.Opt(ServiceRequestPublic2)],
      []
    ),
    "adminUpdateStock": IDL2.Func([ProductId2, IDL2.Nat], [IDL2.Opt(Product2)], []),
    "claimAdminIfFirst": IDL2.Func([], [IDL2.Bool], []),
    "clearMyCart": IDL2.Func([], [], []),
    "createOrder": IDL2.Func([CreateOrderInput2], [OrderPublic2], []),
    "getCategory": IDL2.Func([CategoryId2], [IDL2.Opt(Category2)], ["query"]),
    "getCategoryBySlug": IDL2.Func([IDL2.Text], [IDL2.Opt(Category2)], ["query"]),
    "getMyCart": IDL2.Func([], [CartPublic2], []),
    "getMyOrders": IDL2.Func([], [IDL2.Vec(OrderPublic2)], ["query"]),
    "getMyProfile": IDL2.Func([], [UserProfilePublic2], []),
    "getOrder": IDL2.Func([OrderId2], [IDL2.Opt(OrderPublic2)], ["query"]),
    "getProduct": IDL2.Func([ProductId2], [IDL2.Opt(Product2)], ["query"]),
    "isCurrentUserAdmin": IDL2.Func([], [IDL2.Bool], ["query"]),
    "listCategories": IDL2.Func([], [IDL2.Vec(Category2)], ["query"]),
    "listProducts": IDL2.Func([ProductFilter2], [ProductListResult2], ["query"]),
    "listProductsByCategory": IDL2.Func(
      [CategoryId2, IDL2.Nat, IDL2.Nat],
      [ProductListResult2],
      ["query"]
    ),
    "removeFromCart": IDL2.Func([IDL2.Nat], [CartPublic2], []),
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
    "updateMyProfile": IDL2.Func([UserProfileInput2], [UserProfilePublic2], [])
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
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
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
  async adminAddProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminAddProduct(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminAddProduct(arg0);
      return result;
    }
  }
  async adminDeleteProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminDeleteProduct(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminDeleteProduct(arg0);
      return result;
    }
  }
  async adminDeleteServiceRequest(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminDeleteServiceRequest(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminDeleteServiceRequest(arg0);
      return result;
    }
  }
  async adminGetAllOrders(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminGetAllOrders(arg0, arg1);
        return from_candid_vec_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminGetAllOrders(arg0, arg1);
      return from_candid_vec_n1(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminGetServiceRequests() {
    if (this.processError) {
      try {
        const result = await this.actor.adminGetServiceRequests();
        return from_candid_vec_n10(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminGetServiceRequests();
      return from_candid_vec_n10(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminSetDiscount(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminSetDiscount(arg0, arg1);
        return from_candid_opt_n18(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminSetDiscount(arg0, arg1);
      return from_candid_opt_n18(this._uploadFile, this._downloadFile, result);
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
  async adminUpdateOrderStatus(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateOrderStatus(arg0, to_candid_OrderStatus_n19(this._uploadFile, this._downloadFile, arg1), arg2);
        return from_candid_opt_n21(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateOrderStatus(arg0, to_candid_OrderStatus_n19(this._uploadFile, this._downloadFile, arg1), arg2);
      return from_candid_opt_n21(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateProduct(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateProduct(arg0, arg1);
        return from_candid_opt_n18(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateProduct(arg0, arg1);
      return from_candid_opt_n18(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateServiceRequestStatus(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateServiceRequestStatus(arg0, to_candid_ServiceRequestStatus_n22(this._uploadFile, this._downloadFile, arg1));
        return from_candid_opt_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateServiceRequestStatus(arg0, to_candid_ServiceRequestStatus_n22(this._uploadFile, this._downloadFile, arg1));
      return from_candid_opt_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateStock(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateStock(arg0, arg1);
        return from_candid_opt_n18(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateStock(arg0, arg1);
      return from_candid_opt_n18(this._uploadFile, this._downloadFile, result);
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
        const result = await this.actor.createOrder(arg0);
        return from_candid_OrderPublic_n2(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createOrder(arg0);
      return from_candid_OrderPublic_n2(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCategory(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCategory(arg0);
        return from_candid_opt_n25(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCategory(arg0);
      return from_candid_opt_n25(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCategoryBySlug(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCategoryBySlug(arg0);
        return from_candid_opt_n25(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCategoryBySlug(arg0);
      return from_candid_opt_n25(this._uploadFile, this._downloadFile, result);
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
        return from_candid_vec_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyOrders();
      return from_candid_vec_n1(this._uploadFile, this._downloadFile, result);
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
  async getOrder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getOrder(arg0);
        return from_candid_opt_n21(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getOrder(arg0);
      return from_candid_opt_n21(this._uploadFile, this._downloadFile, result);
    }
  }
  async getProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getProduct(arg0);
        return from_candid_opt_n18(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProduct(arg0);
      return from_candid_opt_n18(this._uploadFile, this._downloadFile, result);
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
  async listProducts(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listProducts(to_candid_ProductFilter_n26(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listProducts(to_candid_ProductFilter_n26(this._uploadFile, this._downloadFile, arg0));
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
        const result = await this.actor.submitServiceRequest(to_candid_CreateServiceRequestInput_n28(this._uploadFile, this._downloadFile, arg0));
        return from_candid_ServiceRequestPublic_n11(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitServiceRequest(to_candid_CreateServiceRequestInput_n28(this._uploadFile, this._downloadFile, arg0));
      return from_candid_ServiceRequestPublic_n11(this._uploadFile, this._downloadFile, result);
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
}
function from_candid_OrderPublic_n2(_uploadFile, _downloadFile, value) {
  return from_candid_record_n3(_uploadFile, _downloadFile, value);
}
function from_candid_OrderStatus_n4(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n5(_uploadFile, _downloadFile, value);
}
function from_candid_ServiceRequestPublic_n11(_uploadFile, _downloadFile, value) {
  return from_candid_record_n12(_uploadFile, _downloadFile, value);
}
function from_candid_ServiceRequestStatus_n13(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n14(_uploadFile, _downloadFile, value);
}
function from_candid_ServiceType_n15(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n16(_uploadFile, _downloadFile, value);
}
function from_candid_ShipmentUpdate_n7(_uploadFile, _downloadFile, value) {
  return from_candid_record_n8(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n17(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n18(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n21(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_OrderPublic_n2(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n24(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_ServiceRequestPublic_n11(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n25(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n9(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n12(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_ServiceRequestStatus_n13(_uploadFile, _downloadFile, value.status),
    userName: value.userName,
    serviceType: from_candid_ServiceType_n15(_uploadFile, _downloadFile, value.serviceType),
    userId: value.userId,
    recipientPhone: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.recipientPhone)),
    submittedAt: value.submittedAt,
    description: value.description,
    userPhone: value.userPhone,
    lastUpdatedAt: value.lastUpdatedAt,
    isRequestForSelf: value.isRequestForSelf,
    preferredDate: value.preferredDate,
    preferredTime: value.preferredTime,
    recipientAddress: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.recipientAddress)),
    recipientName: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.recipientName))
  };
}
function from_candid_record_n3(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_OrderStatus_n4(_uploadFile, _downloadFile, value.status),
    deliveryAddress: value.deliveryAddress,
    shipmentUpdates: from_candid_vec_n6(_uploadFile, _downloadFile, value.shipmentUpdates),
    userId: value.userId,
    createdAt: value.createdAt,
    estimatedDelivery: record_opt_to_undefined(from_candid_opt_n9(_uploadFile, _downloadFile, value.estimatedDelivery)),
    updatedAt: value.updatedAt,
    totalAmount: value.totalAmount,
    items: value.items
  };
}
function from_candid_record_n8(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_OrderStatus_n4(_uploadFile, _downloadFile, value.status),
    message: value.message,
    timestamp: value.timestamp
  };
}
function from_candid_variant_n14(_uploadFile, _downloadFile, value) {
  return "New" in value ? "New" : "Contacted" in value ? "Contacted" : "Cancelled" in value ? "Cancelled" : "Completed" in value ? "Completed" : value;
}
function from_candid_variant_n16(_uploadFile, _downloadFile, value) {
  return "Ambulance" in value ? "Ambulance" : "FoodDelivery" in value ? "FoodDelivery" : "Taxi" in value ? "Taxi" : "SchoolAdmissions" in value ? "SchoolAdmissions" : "Medicines" in value ? "Medicines" : "Gifting" in value ? "Gifting" : "FuneralServices" in value ? "FuneralServices" : "Tourism" in value ? "Tourism" : "Doctors" in value ? "Doctors" : "VideoConferencing" in value ? "VideoConferencing" : "EventManagement" in value ? "EventManagement" : "WeddingsAnniversaries" in value ? "WeddingsAnniversaries" : "Other" in value ? "Other" : value;
}
function from_candid_variant_n5(_uploadFile, _downloadFile, value) {
  return "Delivered" in value ? "Delivered" : "Confirmed" in value ? "Confirmed" : "Cancelled" in value ? "Cancelled" : "Processing" in value ? "Processing" : "Shipped" in value ? "Shipped" : "OutForDelivery" in value ? "OutForDelivery" : value;
}
function from_candid_vec_n1(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_OrderPublic_n2(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n10(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ServiceRequestPublic_n11(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n6(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ShipmentUpdate_n7(_uploadFile, _downloadFile, x));
}
function to_candid_CreateServiceRequestInput_n28(_uploadFile, _downloadFile, value) {
  return to_candid_record_n29(_uploadFile, _downloadFile, value);
}
function to_candid_OrderStatus_n19(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n20(_uploadFile, _downloadFile, value);
}
function to_candid_ProductFilter_n26(_uploadFile, _downloadFile, value) {
  return to_candid_record_n27(_uploadFile, _downloadFile, value);
}
function to_candid_ServiceRequestStatus_n22(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n23(_uploadFile, _downloadFile, value);
}
function to_candid_ServiceType_n30(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n31(_uploadFile, _downloadFile, value);
}
function to_candid_record_n27(_uploadFile, _downloadFile, value) {
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
function to_candid_record_n29(_uploadFile, _downloadFile, value) {
  return {
    userName: value.userName,
    serviceType: to_candid_ServiceType_n30(_uploadFile, _downloadFile, value.serviceType),
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
function to_candid_variant_n20(_uploadFile, _downloadFile, value) {
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
function to_candid_variant_n23(_uploadFile, _downloadFile, value) {
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
function to_candid_variant_n31(_uploadFile, _downloadFile, value) {
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
  OrderStatus as O,
  ServiceRequestStatus as S,
  ServiceType as a,
  createActor as c
};
