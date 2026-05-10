var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentResult, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn, _a;
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, C as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, D as Certificate, F as lookupResultToBuffer, G as RequestStatusResponseStatus, U as UnknownError, H as RequestStatusDoneNoReplyErrorCode, I as RejectError, J as CertifiedRejectErrorCode, K as UNREACHABLE_ERROR, N as InputError, O as InvalidReadStateRequestErrorCode, Q as ReadRequestType, V as Principal, W as IDL, X as MissingCanisterIdErrorCode, Y as HttpAgent, Z as encode, $ as QueryResponseStatus, a0 as UncertifiedRejectErrorCode, a1 as isV3ResponseBody, a2 as isV2ResponseBody, a3 as UncertifiedRejectUpdateErrorCode, a4 as UnexpectedErrorCode, a5 as decode, g as Subscribable, s as shallowEqualObjects, a6 as hashKey, a7 as getDefaultState, x as notifyManager, z as useQueryClient, r as reactExports, n as noop, y as shouldThrowError, a8 as useRouterState, j as jsxRuntimeExports, L as Link, u as useNavigate, a9 as Record, aa as Opt, ab as Vec, ac as Variant, ad as Nat, ae as Service, af as Func, ag as Text, ah as Nat8, ai as Null, aj as Bool, ak as Int, al as Principal$1 } from "./index-BbgXscAi.js";
import { c as createLucideIcon } from "./createLucideIcon-B6ccG8eC.js";
import { u as useActor, a as useQuery } from "./useActor-AG09Vf65.js";
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
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
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
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
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
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
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
var MutationObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client).getMutationCache().build(__privateGet(this, _client), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client = new WeakMap(), _currentResult = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn = function(action) {
  notifyManager.batch(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult).variables;
      const onMutateResult = __privateGet(this, _currentResult).context;
      const context = {
        client: __privateGet(this, _client),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult));
    });
  });
}, _a);
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function useLocation(opts) {
  return useRouterState({
    select: (state) => state.location
  });
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
  ["path", { d: "M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662", key: "154egf" }]
];
const CircleUser = createLucideIcon("circle-user", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
];
const Grid3x3 = createLucideIcon("grid-3x3", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  [
    "path",
    {
      d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
      key: "9zh506"
    }
  ]
];
const ShoppingCart = createLucideIcon("shopping-cart", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
      key: "cbrjhi"
    }
  ]
];
const Wrench = createLucideIcon("wrench", __iconNode);
const NAV_ITEMS = [
  {
    label: "Home",
    to: "/home",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 20 }),
    ocid: "bottom-nav-home"
  },
  {
    label: "Categories",
    to: "/categories",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { size: 20 }),
    ocid: "bottom-nav-categories"
  },
  {
    label: "Search",
    to: "/products",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 20 }),
    ocid: "bottom-nav-search",
    search: {
      q: void 0,
      category: void 0
    }
  },
  {
    label: "Services",
    to: "/services",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { size: 20 }),
    ocid: "bottom-nav-services"
  },
  {
    label: "Cart",
    to: "/cart",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 20 }),
    ocid: "bottom-nav-cart"
  },
  {
    label: "Profile",
    to: "/profile",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 20 }),
    ocid: "bottom-nav-profile"
  }
];
function BottomNav({ cartCount = 0 }) {
  const location = useLocation();
  const pathname = location.pathname;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "nav",
    {
      className: "fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-2px_12px_rgba(0,0,0,0.08)] lg:hidden",
      "aria-label": "Main navigation",
      "data-ocid": "bottom-nav",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-stretch h-16 max-w-lg mx-auto", children: NAV_ITEMS.map((item) => {
          const isActive = item.to === "/home" ? pathname === "/" || pathname === "/home" : pathname.startsWith(item.to);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.to,
              search: "search" in item ? item.search : void 0,
              className: `bottom-nav-item flex-1 relative px-0.5 ${isActive ? "bottom-nav-item-active" : "text-muted-foreground"}`,
              "aria-current": isActive ? "page" : void 0,
              "data-ocid": item.ocid,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative inline-flex", children: [
                  item.icon,
                  item.to === "/cart" && cartCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1 leading-none",
                      "aria-label": `${cartCount} items in cart`,
                      children: cartCount > 99 ? "99+" : cartCount
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] mt-0.5 leading-tight", children: item.label })
              ]
            },
            item.to
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "env(safe-area-inset-bottom)" } })
      ]
    }
  );
}
const ALL_CATEGORIES = [
  {
    id: 1n,
    name: "Assam Tea",
    slug: "assam-tea",
    description: "Authentic teas from the world's finest Brahmaputra valley gardens. CTC, Orthodox, Green, White, and rare single-estate teas.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
    subCategories: [
      "All",
      "CTC Tea",
      "Orthodox Tea",
      "Green Tea",
      "White Tea",
      "Flavoured Tea",
      "Premium Single Estate"
    ],
    emoji: "🍵",
    bannerColor: "bg-accent/20"
  },
  {
    id: 2n,
    name: "Assamese Food",
    slug: "assamese-food",
    description: "Traditional Assamese pantry staples — GI-tagged Joha rice, organic grains, pulses, pickles, and dried produce.",
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
    subCategories: [
      "All",
      "Dried Vegetables",
      "Grains & Rice",
      "Pulses & Lentils",
      "Pickles & Chutneys",
      "Oils & Ghee",
      "Sweets & Snacks"
    ],
    emoji: "🍚",
    bannerColor: "bg-accent/15"
  },
  {
    id: 3n,
    name: "Spices & Herbs",
    slug: "spices-herbs",
    description: "Aromatic spices and culinary herbs sourced from the hills and plains of Assam, including the world-famous Bhut Jolokia.",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    subCategories: [
      "All",
      "Whole Spices",
      "Ground Spices",
      "Herb Blends",
      "Chilli Products",
      "Rare & Exotic Spices"
    ],
    emoji: "🌶️",
    bannerColor: "bg-destructive/10"
  },
  {
    id: 4n,
    name: "Medicine & Herbs",
    slug: "medicine-herbs",
    description: "Traditional Assamese medicinal herbs, herbal teas, and natural wellness products rooted in centuries of indigenous knowledge.",
    imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80",
    subCategories: [
      "All",
      "Medicinal Herbs",
      "Herbal Tea Blends",
      "Ayurvedic Products",
      "Traditional Remedies"
    ],
    emoji: "🌿",
    bannerColor: "bg-primary/10"
  },
  {
    id: 5n,
    name: "Assamese Attire",
    slug: "assamese-attire",
    description: "Handwoven clothing from Assam's rich subcultures — Assamese, Boro, Mising, and Karbi traditions for all occasions.",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
    subCategories: [
      "All",
      "Assamese Traditional",
      "Boro Attire",
      "Mising Attire",
      "Karbi Attire",
      "Festival Wear",
      "Kids Wear"
    ],
    emoji: "👘",
    bannerColor: "bg-secondary/15"
  },
  {
    id: 6n,
    name: "Handloom & Textiles",
    slug: "handloom-textiles",
    description: "Fine handwoven textiles from master weavers in Sualkuchi and Majuli — Muga silk, Eri silk, Mekhela Chador, and Gamosa.",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
    subCategories: [
      "All",
      "Mekhela Chador",
      "Gamosa",
      "Muga Silk",
      "Eri Silk",
      "Stoles & Shawls",
      "Fabric Rolls"
    ],
    emoji: "🧵",
    bannerColor: "bg-secondary/15"
  },
  {
    id: 7n,
    name: "Handicrafts",
    slug: "handicrafts",
    description: "Intricate Assamese craftsmanship — bamboo, cane, bell metal, pottery, and woodwork by skilled artisans.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    subCategories: [
      "All",
      "Bamboo Crafts",
      "Cane Crafts",
      "Bell Metal Craft",
      "Pottery & Clay",
      "Wood Crafts",
      "Tribal Crafts"
    ],
    emoji: "🎋",
    bannerColor: "bg-primary/10"
  },
  {
    id: 8n,
    name: "Art & Paintings",
    slug: "art-paintings",
    description: "Authentic Assamese artwork — traditional Sattriya art, folk paintings, and contemporary Assamese expressions.",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
    subCategories: [
      "All",
      "Traditional Art",
      "Sattriya Art",
      "Folk Paintings",
      "Modern Assamese Art",
      "Prints & Posters"
    ],
    emoji: "🎨",
    bannerColor: "bg-muted"
  },
  {
    id: 9n,
    name: "Books & Literature",
    slug: "books-literature",
    description: "Assamese novels, poetry, history, and literature celebrating the heritage and culture of Assam.",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
    subCategories: [
      "All",
      "Assamese Novels",
      "Poetry & Drama",
      "History & Culture",
      "Children Books",
      "Academic & Reference"
    ],
    emoji: "📚",
    bannerColor: "bg-muted"
  },
  {
    id: 10n,
    name: "Chronicles & Magazines",
    slug: "chronicles-magazines",
    description: "Assamese periodicals, cultural magazines, and chronicles documenting Assamese life and thought.",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80",
    subCategories: [
      "All",
      "Monthly Magazines",
      "Cultural Chronicles",
      "Literary Journals",
      "Collector Editions"
    ],
    emoji: "📰",
    bannerColor: "bg-muted"
  },
  {
    id: 11n,
    name: "Musical Instruments",
    slug: "musical-instruments",
    description: "Traditional Assamese musical instruments — dhol, dotara, pepa, tokari, and more, handcrafted by local artisans.",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80",
    subCategories: [
      "All",
      "String Instruments",
      "Wind Instruments",
      "Percussion Instruments",
      "Traditional Sets",
      "Accessories"
    ],
    emoji: "🥁",
    bannerColor: "bg-accent/15"
  },
  {
    id: 12n,
    name: "Religious & Puja Items",
    slug: "religious-puja",
    description: "Sacred items for Assamese rituals — idols, diyas, incense, puja sets, and spiritual accessories.",
    imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80",
    subCategories: [
      "All",
      "Idols & Figurines",
      "Diyas & Lamps",
      "Incense & Dhoop",
      "Puja Sets",
      "Prayer Accessories"
    ],
    emoji: "🪔",
    bannerColor: "bg-accent/20"
  },
  {
    id: 13n,
    name: "Decorative Items",
    slug: "decorative-items",
    description: "Beautiful Assamese decorative pieces — wall art, table decor, and traditional ornaments that bring Assam home.",
    imageUrl: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80",
    subCategories: [
      "All",
      "Wall Decor",
      "Table Decor",
      "Traditional Ornaments",
      "Seasonal Decor",
      "Gifting Items"
    ],
    emoji: "🏺",
    bannerColor: "bg-secondary/15"
  },
  {
    id: 14n,
    name: "Kitchen & Cookware",
    slug: "kitchen-cookware",
    description: "Traditional Assamese kitchen essentials — bell metal (kah) utensils, bamboo cookware, and clay vessels.",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    subCategories: [
      "All",
      "Bell Metal Utensils",
      "Bamboo Kitchenware",
      "Clay Pots & Vessels",
      "Traditional Cookware",
      "Kitchen Accessories"
    ],
    emoji: "🍳",
    bannerColor: "bg-primary/10"
  },
  {
    id: 15n,
    name: "Living Room Decor",
    slug: "living-room-decor",
    description: "Assamese living room pieces — bamboo and cane furniture, traditional decor, and artisan crafts that tell a story.",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    subCategories: [
      "All",
      "Bamboo Furniture",
      "Cane Furniture",
      "Traditional Decor",
      "Cushion Covers & Textiles",
      "Statement Pieces"
    ],
    emoji: "🛋️",
    bannerColor: "bg-secondary/15"
  }
];
const ALL_PRODUCTS = [
  // ── ASSAM TEA (cat 1) ──────────────────────────────────────────────────────
  {
    id: 101n,
    title: "Khagorijan CTC Tea — 500g",
    description: "Bold, malty CTC tea from the legendary Khagorijan estate in Dibrugarh.",
    price: 49900n,
    discountPercent: 10n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"
    ],
    category: 1n,
    subCategory: "CTC Tea",
    rating: 42n,
    reviewCount: 1280n,
    stock: 50n,
    brand: "Khagorijan Estate",
    tags: [
      "tea",
      "assam tea",
      "ctc",
      "black tea",
      "morning tea",
      "assam",
      "drink",
      "beverage",
      "khagorijan"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 102n,
    title: "Dibrugarh Orthodox Black Tea — 250g",
    description: "Whole-leaf orthodox black tea with rich amber liquor and muscatel notes.",
    price: 68000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"
    ],
    category: 1n,
    subCategory: "Orthodox Tea",
    rating: 46n,
    reviewCount: 534n,
    stock: 35n,
    brand: "Dibrugarh Estates",
    tags: [
      "tea",
      "assam tea",
      "orthodox",
      "black tea",
      "whole leaf",
      "assam",
      "beverage",
      "dibrugarh"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 103n,
    title: "Halmari Premium Green Tea — 100g",
    description: "Delicate first-flush green tea from award-winning Halmari garden.",
    price: 85000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"
    ],
    category: 1n,
    subCategory: "Green Tea",
    rating: 48n,
    reviewCount: 312n,
    stock: 20n,
    brand: "Halmari Tea",
    tags: [
      "tea",
      "assam tea",
      "green tea",
      "halmari",
      "first flush",
      "assam",
      "beverage",
      "premium"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 104n,
    title: "Manohari Gold White Tea — 50g",
    description: "Rare, hand-rolled white tea from the Manohari gold reserve garden.",
    price: 129000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"
    ],
    category: 1n,
    subCategory: "White Tea",
    rating: 49n,
    reviewCount: 98n,
    stock: 10n,
    brand: "Manohari Estate",
    tags: [
      "tea",
      "assam tea",
      "white tea",
      "rare",
      "premium",
      "manohari",
      "assam",
      "beverage"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 105n,
    title: "Kaziranga Masala Chai Blend — 250g",
    description: "Assam CTC base blended with cardamom, ginger, and cinnamon for a perfect masala chai.",
    price: 35000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"
    ],
    category: 1n,
    subCategory: "Flavoured Tea",
    rating: 46n,
    reviewCount: 720n,
    stock: 80n,
    brand: "Kaziranga Naturals",
    tags: [
      "tea",
      "assam tea",
      "masala tea",
      "chai",
      "masala chai",
      "flavoured tea",
      "spiced tea",
      "assam",
      "beverage"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 106n,
    title: "Bihu Special Estate Tea — 200g",
    description: "Limited-edition Bihu harvest tea blended from three top Assam estates.",
    price: 79000n,
    discountPercent: 12n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"
    ],
    category: 1n,
    subCategory: "Premium Single Estate",
    rating: 47n,
    reviewCount: 241n,
    stock: 25n,
    brand: "Heritage Tea Co.",
    tags: [
      "tea",
      "assam tea",
      "bihu",
      "estate tea",
      "premium",
      "limited edition",
      "assam",
      "beverage"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 107n,
    title: "Assam Morning Blend CTC — 1kg",
    description: "Everyday Assam CTC blend — strong, full-bodied, perfect for a morning cup.",
    price: 89900n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"
    ],
    category: 1n,
    subCategory: "CTC Tea",
    rating: 44n,
    reviewCount: 1890n,
    stock: 150n,
    brand: "Brahmaputra Blends",
    tags: [
      "tea",
      "assam tea",
      "ctc",
      "morning tea",
      "everyday tea",
      "black tea",
      "assam",
      "beverage"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 108n,
    title: "Doomur Dolong First Flush Orthodox — 100g",
    description: "Prized first-flush orthodox tea from Doomur Dolong garden with floral aroma.",
    price: 95000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"
    ],
    category: 1n,
    subCategory: "Orthodox Tea",
    rating: 50n,
    reviewCount: 78n,
    stock: 12n,
    brand: "Doomur Dolong Estate",
    tags: [
      "tea",
      "assam tea",
      "orthodox",
      "first flush",
      "premium",
      "single estate",
      "assam",
      "beverage"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── ASSAMESE FOOD (cat 2) ─────────────────────────────────────────────────
  {
    id: 201n,
    title: "Jolphai Achar — Assamese Olive Pickle 250g",
    description: "Tangy and spicy pickle made from fresh Jolphai (Indian olive) grown in Assam.",
    price: 19900n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80"
    ],
    category: 2n,
    subCategory: "Pickles & Chutneys",
    rating: 46n,
    reviewCount: 430n,
    stock: 75n,
    brand: "Kamrup Organics",
    tags: [
      "pickle",
      "jolphai",
      "achar",
      "olive pickle",
      "assamese food",
      "food",
      "assam",
      "traditional"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 202n,
    title: "Khorisa — Fermented Bamboo Shoot Pickle 300g",
    description: "Traditional fermented bamboo shoot pickle with a pungent, tangy flavour.",
    price: 24900n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80"
    ],
    category: 2n,
    subCategory: "Pickles & Chutneys",
    rating: 44n,
    reviewCount: 312n,
    stock: 60n,
    brand: "Tezpur Spice House",
    tags: [
      "khorisa",
      "bamboo shoot",
      "pickle",
      "fermented",
      "assamese food",
      "food",
      "assam",
      "traditional"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 203n,
    title: "Til Pitha Mix — Ready to Make 500g",
    description: "Ready mix for traditional Assamese sesame rice cake (Til Pitha) for Bihu.",
    price: 15900n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80"
    ],
    category: 2n,
    subCategory: "Sweets & Snacks",
    rating: 47n,
    reviewCount: 189n,
    stock: 100n,
    brand: "Assam Heritage Foods",
    tags: [
      "til pitha",
      "pitha",
      "sesame",
      "bihu",
      "sweets",
      "snacks",
      "assamese food",
      "food",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 204n,
    title: "Black Rice — Bora Chaul 1kg",
    description: "Sticky glutinous black rice (Bora Chaul) traditionally used for pithas and desserts.",
    price: 28000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80"
    ],
    category: 2n,
    subCategory: "Grains & Rice",
    rating: 46n,
    reviewCount: 245n,
    stock: 80n,
    brand: "Kamrup Organics",
    tags: [
      "black rice",
      "bora chaul",
      "rice",
      "glutinous rice",
      "assamese food",
      "food",
      "assam",
      "grain"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 205n,
    title: "Joha Scented Rice — 1kg",
    description: "Prized aromatic GI-tagged short-grain Joha rice from Kamrup.",
    price: 18000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80"
    ],
    category: 2n,
    subCategory: "Grains & Rice",
    rating: 48n,
    reviewCount: 560n,
    stock: 200n,
    brand: "Kamrup Organics",
    tags: [
      "joha rice",
      "rice",
      "scented rice",
      "aromatic rice",
      "assamese food",
      "food",
      "assam",
      "grain",
      "joha"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 206n,
    title: "Assamese Cold-Pressed Mustard Oil — 500ml",
    description: "Pure, cold-pressed kachi ghani mustard oil, essential in Assamese cooking.",
    price: 32000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80"
    ],
    category: 2n,
    subCategory: "Oils & Ghee",
    rating: 47n,
    reviewCount: 380n,
    stock: 90n,
    brand: "Nagaon Naturals",
    tags: [
      "mustard oil",
      "oil",
      "cooking oil",
      "assamese food",
      "food",
      "assam",
      "kachi ghani"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 207n,
    title: "Korai Mah Dal — Assamese Horse Gram 500g",
    description: "Protein-rich horse gram (korai mah) traditionally consumed in Assamese households.",
    price: 12000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80"
    ],
    category: 2n,
    subCategory: "Pulses & Lentils",
    rating: 44n,
    reviewCount: 120n,
    stock: 150n,
    brand: "Assam Heritage Foods",
    tags: [
      "korai mah",
      "horse gram",
      "dal",
      "lentil",
      "pulse",
      "assamese food",
      "food",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 208n,
    title: "Pani Tenga Pickle — Sour Lemon Pickle 250g",
    description: "Classic Assamese sour lemon pickle (Pani Tenga) fermented with mustard.",
    price: 17500n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80"
    ],
    category: 2n,
    subCategory: "Pickles & Chutneys",
    rating: 45n,
    reviewCount: 210n,
    stock: 65n,
    brand: "Kamrup Organics",
    tags: [
      "pani tenga",
      "lemon pickle",
      "pickle",
      "sour pickle",
      "assamese food",
      "food",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── SPICES & HERBS (cat 3) ────────────────────────────────────────────────
  {
    id: 301n,
    title: "Bhut Jolokia Chilli Powder — 100g",
    description: "World's hottest chilli powder from Tezpur — use sparingly for extreme heat.",
    price: 22000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"
    ],
    category: 3n,
    subCategory: "Chilli Products",
    rating: 46n,
    reviewCount: 720n,
    stock: 75n,
    brand: "Tezpur Spice House",
    tags: [
      "bhut jolokia",
      "ghost pepper",
      "chilli",
      "hot chilli",
      "spice",
      "assam spice",
      "assam",
      "chilli powder"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 302n,
    title: "Assamese Panch Phoron — 200g",
    description: "Classic five-spice blend (fenugreek, cumin, mustard, nigella, fennel) essential in Assamese cooking.",
    price: 18000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"
    ],
    category: 3n,
    subCategory: "Herb Blends",
    rating: 45n,
    reviewCount: 385n,
    stock: 100n,
    brand: "Assam Heritage Foods",
    tags: [
      "panch phoron",
      "five spice",
      "spice blend",
      "assam spice",
      "spice",
      "assam",
      "herb"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 303n,
    title: "Turmeric Powder Lakhi Sali — 200g",
    description: "Premium golden turmeric powder from Lakhi Sali variety grown in Assam.",
    price: 14000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"
    ],
    category: 3n,
    subCategory: "Ground Spices",
    rating: 48n,
    reviewCount: 560n,
    stock: 120n,
    brand: "Kamrup Organics",
    tags: [
      "turmeric",
      "haldi",
      "turmeric powder",
      "spice",
      "assam spice",
      "assam",
      "ground spice"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 304n,
    title: "Black Pepper Whole — 100g",
    description: "Bold, pungent whole black peppercorns sourced from the hills of Assam.",
    price: 29000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"
    ],
    category: 3n,
    subCategory: "Whole Spices",
    rating: 44n,
    reviewCount: 230n,
    stock: 80n,
    brand: "Hill Spice Co.",
    tags: [
      "black pepper",
      "pepper",
      "whole spice",
      "spice",
      "assam spice",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 305n,
    title: "Green Cardamom — 50g",
    description: "Fragrant Assam-grown green cardamom pods — sweet, aromatic, and intensely flavourful.",
    price: 45000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"
    ],
    category: 3n,
    subCategory: "Whole Spices",
    rating: 47n,
    reviewCount: 190n,
    stock: 50n,
    brand: "Hill Spice Co.",
    tags: [
      "cardamom",
      "green cardamom",
      "elaichi",
      "spice",
      "whole spice",
      "assam spice",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 306n,
    title: "Cinnamon Sticks — 100g",
    description: "Aromatic true cinnamon sticks ideal for biryanis, teas, and Assamese gravies.",
    price: 22000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"
    ],
    category: 3n,
    subCategory: "Whole Spices",
    rating: 45n,
    reviewCount: 145n,
    stock: 70n,
    brand: "Tezpur Spice House",
    tags: [
      "cinnamon",
      "dalchini",
      "whole spice",
      "spice",
      "assam spice",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 307n,
    title: "Mustard Seeds Yellow — 250g",
    description: "Yellow mustard seeds essential for tempering in Assamese dal and pickles.",
    price: 12000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"
    ],
    category: 3n,
    subCategory: "Whole Spices",
    rating: 43n,
    reviewCount: 280n,
    stock: 130n,
    brand: "Kamrup Organics",
    tags: [
      "mustard seeds",
      "mustard",
      "sarso",
      "spice",
      "whole spice",
      "assam spice",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 308n,
    title: "Dried Bay Leaves — 50g",
    description: "Sun-dried Assamese bay leaves (tejpata) with a warm, herbal aroma.",
    price: 8000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"
    ],
    category: 3n,
    subCategory: "Rare & Exotic Spices",
    rating: 42n,
    reviewCount: 165n,
    stock: 90n,
    brand: "Assam Heritage Foods",
    tags: [
      "bay leaves",
      "tejpata",
      "dried herb",
      "spice",
      "assam spice",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── MEDICINE & HERBS (cat 4) ──────────────────────────────────────────────
  {
    id: 401n,
    title: "Tulsi Ark — Holy Basil Drops 30ml",
    description: "Pure Tulsi (Holy Basil) extract for immunity, respiratory health, and daily wellness.",
    price: 15000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80"
    ],
    category: 4n,
    subCategory: "Ayurvedic Products",
    rating: 46n,
    reviewCount: 380n,
    stock: 80n,
    brand: "Ayurved Assam",
    tags: [
      "tulsi",
      "tulsi ark",
      "holy basil",
      "herb",
      "medicinal herb",
      "ayurvedic",
      "immunity",
      "medicine",
      "wellness"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 402n,
    title: "Brahmi Churna — Memory Herb Powder 100g",
    description: "Traditional Brahmi (Bacopa) powder to support memory, focus, and cognitive health.",
    price: 28000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80"
    ],
    category: 4n,
    subCategory: "Medicinal Herbs",
    rating: 45n,
    reviewCount: 220n,
    stock: 60n,
    brand: "Ayurved Assam",
    tags: [
      "brahmi",
      "memory herb",
      "herb",
      "medicinal herb",
      "ayurvedic",
      "medicine",
      "wellness",
      "brain"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 403n,
    title: "Triphala Powder — Digestive Blend 200g",
    description: "Classic Triphala blend of amla, baheda, and haritaki for gut health and detox.",
    price: 22000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80"
    ],
    category: 4n,
    subCategory: "Ayurvedic Products",
    rating: 47n,
    reviewCount: 310n,
    stock: 75n,
    brand: "Ayurved Assam",
    tags: [
      "triphala",
      "digestive",
      "herb",
      "medicinal herb",
      "ayurvedic",
      "medicine",
      "wellness",
      "gut health"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 404n,
    title: "Giloy Juice — Immunity Booster 500ml",
    description: "Pure Giloy (Guduchi) juice — Assam's traditional immunity-boosting herbal extract.",
    price: 35000n,
    discountPercent: 10n,
    imageUrls: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80"
    ],
    category: 4n,
    subCategory: "Traditional Remedies",
    rating: 46n,
    reviewCount: 265n,
    stock: 50n,
    brand: "Kamrup Herbals",
    tags: [
      "giloy",
      "guduchi",
      "immunity",
      "herbal juice",
      "herb",
      "medicinal herb",
      "medicine",
      "wellness",
      "ayurvedic"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 405n,
    title: "Shatavari Root Powder — 100g",
    description: "Organic Shatavari (Asparagus racemosus) powder for women's health and vitality.",
    price: 38000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80"
    ],
    category: 4n,
    subCategory: "Medicinal Herbs",
    rating: 45n,
    reviewCount: 180n,
    stock: 45n,
    brand: "Ayurved Assam",
    tags: [
      "shatavari",
      "herb",
      "medicinal herb",
      "ayurvedic",
      "medicine",
      "wellness",
      "women health"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 406n,
    title: "Ashwagandha Root Powder — 100g",
    description: "Premium Ashwagandha (Withania somnifera) root powder for strength and stress relief.",
    price: 32000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80"
    ],
    category: 4n,
    subCategory: "Ayurvedic Products",
    rating: 48n,
    reviewCount: 420n,
    stock: 65n,
    brand: "Kamrup Herbals",
    tags: [
      "ashwagandha",
      "herb",
      "medicinal herb",
      "ayurvedic",
      "medicine",
      "wellness",
      "stress relief"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 407n,
    title: "Neem Capsules — 60 Capsules",
    description: "Pure Neem leaf extract capsules for skin health, blood purification, and immunity.",
    price: 28000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80"
    ],
    category: 4n,
    subCategory: "Ayurvedic Products",
    rating: 44n,
    reviewCount: 195n,
    stock: 80n,
    brand: "Ayurved Assam",
    tags: [
      "neem",
      "neem capsules",
      "herb",
      "medicinal herb",
      "ayurvedic",
      "medicine",
      "skin health"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 408n,
    title: "Marich-Pippali Herbal Blend — 50g",
    description: "Traditional Marich-Pippali (black pepper + long pepper) blend for respiratory wellness.",
    price: 19000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80"
    ],
    category: 4n,
    subCategory: "Herbal Tea Blends",
    rating: 43n,
    reviewCount: 115n,
    stock: 55n,
    brand: "Kamrup Herbals",
    tags: [
      "marich pippali",
      "herbal blend",
      "herb",
      "medicinal herb",
      "ayurvedic",
      "medicine",
      "respiratory"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── ASSAMESE ATTIRE (cat 5) ────────────────────────────────────────────────
  {
    id: 501n,
    title: "Bihu Mekhela Chador Set — Silk",
    description: "Complete two-piece Mekhela Chador set in pure silk with traditional Assamese motifs for Bihu.",
    price: 395000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80"
    ],
    category: 5n,
    subCategory: "Festival Wear",
    rating: 48n,
    reviewCount: 312n,
    stock: 10n,
    brand: "Majuli Weavers",
    tags: [
      "mekhela chador",
      "mekhela",
      "chador",
      "bihu",
      "silk",
      "traditional",
      "assamese dress",
      "attire",
      "women",
      "clothing",
      "festival"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 502n,
    title: "Red Gamosa — Traditional Handwoven",
    description: "The iconic red-bordered cotton gamosa, symbol of Assamese identity and respect.",
    price: 24900n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80"
    ],
    category: 5n,
    subCategory: "Assamese Traditional",
    rating: 49n,
    reviewCount: 1500n,
    stock: 100n,
    brand: "Sualkuchi Textiles",
    tags: [
      "gamosa",
      "red gamosa",
      "traditional",
      "assamese",
      "cotton",
      "attire",
      "clothing",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 503n,
    title: "Assamese Dhoti Kurta Set — Men",
    description: "Traditional white cotton Dhoti-Kurta set for Assamese men, ideal for festivals and pujas.",
    price: 75000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80"
    ],
    category: 5n,
    subCategory: "Assamese Traditional",
    rating: 46n,
    reviewCount: 230n,
    stock: 30n,
    brand: "Assam Heritage Weaves",
    tags: [
      "dhoti kurta",
      "dhoti",
      "kurta",
      "men attire",
      "traditional",
      "assamese",
      "attire",
      "clothing",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 504n,
    title: "Girls Bihu Dress — Kids Festival Wear",
    description: "Colourful Assamese Bihu dress for girls with traditional embroidery and Muga accents.",
    price: 59000n,
    discountPercent: 10n,
    imageUrls: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80"
    ],
    category: 5n,
    subCategory: "Kids Wear",
    rating: 47n,
    reviewCount: 150n,
    stock: 25n,
    brand: "Little Assam",
    tags: [
      "girls dress",
      "bihu dress",
      "kids wear",
      "children",
      "assamese",
      "traditional",
      "attire",
      "clothing",
      "festival"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 505n,
    title: "Muga Silk Mekhela Chador — Premium",
    description: "Exquisite Muga silk Mekhela Chador in natural golden hue from Sualkuchi's finest weavers.",
    price: 895000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80"
    ],
    category: 5n,
    subCategory: "Assamese Traditional",
    rating: 50n,
    reviewCount: 89n,
    stock: 5n,
    brand: "Sualkuchi Weavers",
    tags: [
      "muga silk",
      "mekhela chador",
      "mekhela",
      "silk",
      "premium",
      "traditional",
      "assamese dress",
      "attire",
      "women",
      "clothing"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 506n,
    title: "Boro Dokhona Dress Set",
    description: "Traditional Boro tribal dokhona in vibrant colours with characteristic geometric patterns.",
    price: 125000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80"
    ],
    category: 5n,
    subCategory: "Boro Attire",
    rating: 47n,
    reviewCount: 120n,
    stock: 15n,
    brand: "Boro Weave Collective",
    tags: [
      "boro",
      "dokhona",
      "boro attire",
      "tribal",
      "traditional",
      "assamese",
      "attire",
      "clothing",
      "women"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 507n,
    title: "Cotton Gamosa Pack — Set of 3",
    description: "Multi-purpose cotton gamosas in traditional red-and-white pattern, pack of 3.",
    price: 65000n,
    discountPercent: 12n,
    imageUrls: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80"
    ],
    category: 5n,
    subCategory: "Assamese Traditional",
    rating: 48n,
    reviewCount: 870n,
    stock: 70n,
    brand: "Sualkuchi Textiles",
    tags: [
      "gamosa",
      "cotton gamosa",
      "gamosa pack",
      "traditional",
      "assamese",
      "attire",
      "clothing",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── HANDLOOM & TEXTILES (cat 6) ───────────────────────────────────────────
  {
    id: 601n,
    title: "Muga Silk Saree — Handwoven",
    description: "Premium Muga silk saree handwoven by master weavers in Sualkuchi with traditional Assamese border.",
    price: 745000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80"
    ],
    category: 6n,
    subCategory: "Muga Silk",
    rating: 49n,
    reviewCount: 120n,
    stock: 8n,
    brand: "Sualkuchi Weavers",
    tags: [
      "muga silk",
      "silk saree",
      "saree",
      "handloom",
      "woven",
      "assam",
      "textile",
      "weave"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 602n,
    title: "Pat Silk Dupatta — Traditional Motif",
    description: "Lightweight Pat silk dupatta with traditional Assamese floral motifs hand-woven in Majuli.",
    price: 189000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80"
    ],
    category: 6n,
    subCategory: "Stoles & Shawls",
    rating: 47n,
    reviewCount: 234n,
    stock: 20n,
    brand: "Majuli Weavers",
    tags: [
      "pat silk",
      "silk dupatta",
      "dupatta",
      "handloom",
      "woven",
      "assam",
      "textile",
      "weave"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 603n,
    title: "Eri Silk Stole — Natural Ahimsa Silk",
    description: "Cruelty-free Eri (Ahimsa) silk stole in natural off-white with earthy warmth and softness.",
    price: 235000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80"
    ],
    category: 6n,
    subCategory: "Eri Silk",
    rating: 48n,
    reviewCount: 178n,
    stock: 15n,
    brand: "Assam Silk House",
    tags: [
      "eri silk",
      "ahimsa silk",
      "stole",
      "silk stole",
      "handloom",
      "woven",
      "assam",
      "textile"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 604n,
    title: "Handloom Cotton Mekhela Chador — Daily Wear",
    description: "Everyday cotton Mekhela Chador in pastel shades with minimalist Assamese motifs.",
    price: 125000n,
    discountPercent: 10n,
    imageUrls: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80"
    ],
    category: 6n,
    subCategory: "Mekhela Chador",
    rating: 46n,
    reviewCount: 390n,
    stock: 30n,
    brand: "Sualkuchi Weavers",
    tags: [
      "mekhela chador",
      "mekhela",
      "cotton",
      "handloom",
      "woven",
      "assam",
      "textile",
      "daily wear"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 605n,
    title: "Gamosa — Handwoven Silk Border",
    description: "Special gamosa with golden Muga silk border, perfect as a gifting item or ritual offering.",
    price: 45000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80"
    ],
    category: 6n,
    subCategory: "Gamosa",
    rating: 49n,
    reviewCount: 560n,
    stock: 50n,
    brand: "Sualkuchi Weavers",
    tags: [
      "gamosa",
      "silk border gamosa",
      "handloom",
      "woven",
      "assam",
      "textile",
      "gift"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 606n,
    title: "Eri Silk Kurti — Women's Ethnic Wear",
    description: "Comfortable and breathable Eri silk kurti with traditional Assamese block print accents.",
    price: 189000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80"
    ],
    category: 6n,
    subCategory: "Eri Silk",
    rating: 47n,
    reviewCount: 195n,
    stock: 18n,
    brand: "Assam Silk House",
    tags: [
      "eri silk",
      "kurti",
      "women kurti",
      "handloom",
      "woven",
      "assam",
      "textile",
      "ethnic"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 607n,
    title: "Sualkuchi Muga Blouse Piece — 1m",
    description: "Authentic Muga silk blouse piece from Sualkuchi for pairing with any Assamese saree.",
    price: 95000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80"
    ],
    category: 6n,
    subCategory: "Fabric Rolls",
    rating: 46n,
    reviewCount: 145n,
    stock: 25n,
    brand: "Sualkuchi Weavers",
    tags: [
      "muga silk",
      "blouse piece",
      "fabric",
      "handloom",
      "woven",
      "assam",
      "textile",
      "sualkuchi"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── HANDICRAFTS (cat 7) ───────────────────────────────────────────────────
  {
    id: 701n,
    title: "Bamboo Flower Vase — Handcrafted",
    description: "Elegant hand-carved bamboo flower vase with intricate Assamese geometric engravings.",
    price: 45000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
    ],
    category: 7n,
    subCategory: "Bamboo Crafts",
    rating: 45n,
    reviewCount: 189n,
    stock: 30n,
    brand: "Bongaigaon Crafts",
    tags: [
      "bamboo vase",
      "bamboo",
      "craft",
      "handcraft",
      "handicraft",
      "assam craft",
      "assam",
      "home decor"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 702n,
    title: "Cane Picnic Basket — Large",
    description: "Traditional Assamese cane basket, handwoven with natural cane reeds for storage or picnics.",
    price: 75000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
    ],
    category: 7n,
    subCategory: "Cane Crafts",
    rating: 44n,
    reviewCount: 95n,
    stock: 20n,
    brand: "Bongaigaon Crafts",
    tags: [
      "cane basket",
      "basket",
      "cane",
      "craft",
      "handcraft",
      "handicraft",
      "assam craft",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 703n,
    title: "Bell Metal Xorai Tray — Decorative",
    description: "Traditional Assamese ceremonial Xorai (bell metal tray) used in rituals and as a decor piece.",
    price: 189000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
    ],
    category: 7n,
    subCategory: "Bell Metal Craft",
    rating: 48n,
    reviewCount: 230n,
    stock: 12n,
    brand: "Sarthebari Crafts",
    tags: [
      "xorai",
      "bell metal",
      "kah",
      "tray",
      "craft",
      "handcraft",
      "handicraft",
      "assam craft",
      "assam",
      "ritual"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 704n,
    title: "Clay Dokona Pot — Traditional Cooking",
    description: "Hand-thrown clay cooking pot (dokona) by the potters of Hajo — perfect for slow cooking.",
    price: 35000n,
    discountPercent: 10n,
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
    ],
    category: 7n,
    subCategory: "Pottery & Clay",
    rating: 46n,
    reviewCount: 145n,
    stock: 18n,
    brand: "Hajo Pottery",
    tags: [
      "clay pot",
      "clay",
      "pottery",
      "dokona",
      "craft",
      "handcraft",
      "handicraft",
      "assam craft",
      "assam",
      "cooking"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 705n,
    title: "Majuli Mask — Ravana Character",
    description: "Handcrafted traditional Majuli performance mask depicting the Ravana character from Sattriya theatre.",
    price: 129000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
    ],
    category: 7n,
    subCategory: "Tribal Crafts",
    rating: 49n,
    reviewCount: 78n,
    stock: 8n,
    brand: "Majuli Arts",
    tags: [
      "majuli mask",
      "mask",
      "ravana",
      "sattriya",
      "craft",
      "handcraft",
      "handicraft",
      "assam craft",
      "assam",
      "tribal"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 706n,
    title: "Bamboo Wind Chime — 5 Tubes",
    description: "Natural bamboo wind chime with 5 tuned hollow tubes and a driftwood top piece.",
    price: 28000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
    ],
    category: 7n,
    subCategory: "Bamboo Crafts",
    rating: 43n,
    reviewCount: 120n,
    stock: 35n,
    brand: "Bongaigaon Crafts",
    tags: [
      "bamboo wind chime",
      "wind chime",
      "bamboo",
      "craft",
      "handcraft",
      "handicraft",
      "assam craft",
      "assam",
      "home decor"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 707n,
    title: "Jaapi (Decorative) — Bell Metal Accent",
    description: "Decorative miniature Jaapi (Assamese hat) with bell metal ornamental border — a collector's piece.",
    price: 95000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
    ],
    category: 7n,
    subCategory: "Wood Crafts",
    rating: 47n,
    reviewCount: 65n,
    stock: 10n,
    brand: "Assam Heritage Crafts",
    tags: [
      "jaapi",
      "assamese hat",
      "bamboo hat",
      "craft",
      "handcraft",
      "handicraft",
      "assam craft",
      "assam",
      "decor"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── ART & PAINTINGS (cat 8) ───────────────────────────────────────────────
  {
    id: 801n,
    title: "Assam Landscape Oil Painting — 24x18 in",
    description: "Original oil painting of the Brahmaputra river at dusk by a Guwahati-based artist.",
    price: 485000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80"
    ],
    category: 8n,
    subCategory: "Modern Assamese Art",
    rating: 49n,
    reviewCount: 32n,
    stock: 1n,
    brand: "Assam Art Studio",
    tags: [
      "oil painting",
      "painting",
      "assam landscape",
      "brahmaputra",
      "art",
      "assam art",
      "assam",
      "wall art"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 802n,
    title: "Bihu Dance Watercolour — Framed Print",
    description: "Vibrant watercolour illustration of Bihu dancers in traditional attire, A3 framed print.",
    price: 125000n,
    discountPercent: 10n,
    imageUrls: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80"
    ],
    category: 8n,
    subCategory: "Prints & Posters",
    rating: 47n,
    reviewCount: 89n,
    stock: 20n,
    brand: "Assam Art Studio",
    tags: [
      "bihu dance",
      "watercolour",
      "print",
      "bihu",
      "art",
      "assam art",
      "assam",
      "wall art",
      "framed"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 803n,
    title: "Sattriya Dance Folk Print — A2 Poster",
    description: "Bold folk-art style print depicting Sattriya classical dance performance from Majuli.",
    price: 89000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80"
    ],
    category: 8n,
    subCategory: "Sattriya Art",
    rating: 46n,
    reviewCount: 65n,
    stock: 30n,
    brand: "Majuli Arts",
    tags: [
      "sattriya",
      "folk art",
      "print",
      "poster",
      "art",
      "assam art",
      "assam",
      "wall art",
      "dance"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 804n,
    title: "Brahmaputra Sunset Canvas — 30x20 in",
    description: "Acrylic canvas art of the Brahmaputra river's golden sunset, handpainted by local artist.",
    price: 350000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80"
    ],
    category: 8n,
    subCategory: "Traditional Art",
    rating: 48n,
    reviewCount: 28n,
    stock: 2n,
    brand: "Assam Art Studio",
    tags: [
      "brahmaputra",
      "sunset",
      "canvas",
      "painting",
      "art",
      "assam art",
      "assam",
      "wall art",
      "acrylic"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 805n,
    title: "Tribal Pattern Wall Art — Canvas 18x24",
    description: "Contemporary canvas featuring bold Bodo tribal geometric patterns in ochre and black.",
    price: 195000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80"
    ],
    category: 8n,
    subCategory: "Folk Paintings",
    rating: 47n,
    reviewCount: 52n,
    stock: 10n,
    brand: "Tribal Art Assam",
    tags: [
      "tribal art",
      "tribal pattern",
      "bodo",
      "wall art",
      "canvas",
      "art",
      "assam art",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 806n,
    title: "Assamese Village Life Sketch — Pen & Ink",
    description: "Detailed pen-and-ink sketch depicting daily life in a traditional Assamese village.",
    price: 78000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80"
    ],
    category: 8n,
    subCategory: "Traditional Art",
    rating: 46n,
    reviewCount: 41n,
    stock: 5n,
    brand: "Assam Art Studio",
    tags: [
      "sketch",
      "pen ink",
      "village life",
      "assam village",
      "art",
      "assam art",
      "assam",
      "wall art"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 807n,
    title: "Bodo Tribal Motif Print — Set of 4",
    description: "Set of four A4 Bodo tribal geometric motif prints, perfect for gallery wall arrangements.",
    price: 99000n,
    discountPercent: 10n,
    imageUrls: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80"
    ],
    category: 8n,
    subCategory: "Prints & Posters",
    rating: 45n,
    reviewCount: 38n,
    stock: 25n,
    brand: "Tribal Art Assam",
    tags: [
      "bodo",
      "tribal motif",
      "print set",
      "wall art",
      "art",
      "assam art",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── BOOKS & LITERATURE (cat 9) ─────────────────────────────────────────────
  {
    id: 901n,
    title: "Assamese Short Stories Collection",
    description: "An anthology of 20 classic short stories by Assam's greatest literary voices.",
    price: 39900n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"
    ],
    category: 9n,
    subCategory: "Assamese Novels",
    rating: 47n,
    reviewCount: 185n,
    stock: 60n,
    brand: "Purvoday Press",
    tags: [
      "assamese book",
      "short stories",
      "book",
      "literature",
      "assam",
      "reading",
      "assamese language"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 902n,
    title: "Lakshminath Bezbaruah Complete Works",
    description: "Comprehensive collected works of the father of modern Assamese literature.",
    price: 85000n,
    discountPercent: 10n,
    imageUrls: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"
    ],
    category: 9n,
    subCategory: "Assamese Novels",
    rating: 49n,
    reviewCount: 234n,
    stock: 40n,
    brand: "Purvoday Press",
    tags: [
      "lakshminath bezbaruah",
      "bezbaruah",
      "classic",
      "book",
      "literature",
      "assam",
      "reading"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 903n,
    title: "Assam History Illustrated — Hardcover",
    description: "Richly illustrated chronological history of Assam from the Ahom Kingdom to Independence.",
    price: 69000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"
    ],
    category: 9n,
    subCategory: "History & Culture",
    rating: 48n,
    reviewCount: 120n,
    stock: 35n,
    brand: "Guwahati University Press",
    tags: [
      "assam history",
      "history book",
      "assam",
      "culture",
      "book",
      "literature",
      "reading",
      "illustrated"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 904n,
    title: "Bihu Songs Anthology — With Notation",
    description: "Complete anthology of traditional Bihu songs with lyric transcription and musical notation.",
    price: 45000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"
    ],
    category: 9n,
    subCategory: "Poetry & Drama",
    rating: 46n,
    reviewCount: 95n,
    stock: 50n,
    brand: "Purvoday Press",
    tags: [
      "bihu songs",
      "bihu",
      "songs",
      "anthology",
      "music",
      "book",
      "literature",
      "assam",
      "reading"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 905n,
    title: "Assamese Language Grammar Guide",
    description: "Comprehensive guide to Assamese grammar and script for learners at all levels.",
    price: 32000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"
    ],
    category: 9n,
    subCategory: "Academic & Reference",
    rating: 45n,
    reviewCount: 180n,
    stock: 70n,
    brand: "Guwahati University Press",
    tags: [
      "assamese grammar",
      "language guide",
      "assamese language",
      "grammar",
      "book",
      "learning",
      "assam",
      "reading"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 906n,
    title: "Children's Assamese Tales — Illustrated",
    description: "Beautifully illustrated collection of traditional Assamese folk tales for young readers.",
    price: 28000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"
    ],
    category: 9n,
    subCategory: "Children Books",
    rating: 48n,
    reviewCount: 145n,
    stock: 80n,
    brand: "Little Assam",
    tags: [
      "children book",
      "folk tales",
      "kids book",
      "assamese tales",
      "book",
      "literature",
      "assam",
      "reading"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 907n,
    title: "Jyoti Prasad Agarwala — Life & Works",
    description: "Definitive biography of Rupkonwar Jyoti Prasad Agarwala — Assam's cultural icon.",
    price: 55000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"
    ],
    category: 9n,
    subCategory: "History & Culture",
    rating: 47n,
    reviewCount: 78n,
    stock: 45n,
    brand: "Purvoday Press",
    tags: [
      "jyoti prasad",
      "rupkonwar",
      "biography",
      "assam culture",
      "book",
      "literature",
      "assam",
      "reading"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── CHRONICLES & MAGAZINES (cat 10) ──────────────────────────────────────
  {
    id: 1001n,
    title: "Goriyoshi Monthly — Special Edition",
    description: "Landmark issue of Goriyoshi, one of Assam's most respected literary monthly magazines.",
    price: 8000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80"
    ],
    category: 10n,
    subCategory: "Monthly Magazines",
    rating: 45n,
    reviewCount: 220n,
    stock: 100n,
    brand: "Goriyoshi Publishing",
    tags: [
      "goriyoshi",
      "magazine",
      "assamese magazine",
      "monthly",
      "chronicles",
      "assam",
      "reading",
      "literature"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1002n,
    title: "Prantik Literary Magazine — Annual",
    description: "Annual edition of Prantik, Assam's premier literary magazine since 1976.",
    price: 15000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80"
    ],
    category: 10n,
    subCategory: "Literary Journals",
    rating: 47n,
    reviewCount: 145n,
    stock: 60n,
    brand: "Prantik Publishers",
    tags: [
      "prantik",
      "literary magazine",
      "magazine",
      "assamese magazine",
      "annual",
      "chronicles",
      "assam",
      "reading"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1003n,
    title: "Sadin Weekly — Collector Bundle (4 issues)",
    description: "Four-issue collector bundle of Sadin, Assam's leading Assamese-language newsmagazine.",
    price: 12000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80"
    ],
    category: 10n,
    subCategory: "Cultural Chronicles",
    rating: 44n,
    reviewCount: 95n,
    stock: 80n,
    brand: "Sadin Publications",
    tags: [
      "sadin",
      "weekly",
      "magazine",
      "assamese magazine",
      "collector",
      "chronicles",
      "assam",
      "reading"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1004n,
    title: "Xahitya Xabha Journal — Academic Issue",
    description: "Scholarly journal from the Asam Sahitya Sabha featuring academic essays on Assamese literature.",
    price: 18000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80"
    ],
    category: 10n,
    subCategory: "Literary Journals",
    rating: 46n,
    reviewCount: 58n,
    stock: 40n,
    brand: "Asam Sahitya Sabha",
    tags: [
      "xahitya xabha",
      "sahitya sabha",
      "journal",
      "assamese journal",
      "academic",
      "chronicles",
      "assam",
      "literature"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1005n,
    title: "Niyomiya Barta Annual Digest",
    description: "Comprehensive annual digest from Niyomiya Barta, Assam's top circulation newspaper.",
    price: 22000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80"
    ],
    category: 10n,
    subCategory: "Cultural Chronicles",
    rating: 43n,
    reviewCount: 75n,
    stock: 50n,
    brand: "Niyomiya Barta",
    tags: [
      "niyomiya barta",
      "newspaper",
      "annual",
      "digest",
      "assamese",
      "chronicles",
      "assam",
      "reading"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1006n,
    title: "Assam Tribune Heritage Edition — Collector",
    description: "Collector's edition commemorating Assam Tribune's 75th anniversary with archival prints.",
    price: 35000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80"
    ],
    category: 10n,
    subCategory: "Collector Editions",
    rating: 48n,
    reviewCount: 42n,
    stock: 20n,
    brand: "Assam Tribune",
    tags: [
      "assam tribune",
      "collector edition",
      "heritage",
      "newspaper",
      "chronicles",
      "assam",
      "reading"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── MUSICAL INSTRUMENTS (cat 11) ──────────────────────────────────────────
  {
    id: 1101n,
    title: "Dhol — Traditional Assamese Drum",
    description: "Authentic double-headed Assamese Dhol drum, handcrafted in wood with goat-skin heads.",
    price: 389000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80"
    ],
    category: 11n,
    subCategory: "Percussion Instruments",
    rating: 48n,
    reviewCount: 135n,
    stock: 10n,
    brand: "Assam Musical Heritage",
    tags: [
      "dhol",
      "drum",
      "assamese drum",
      "percussion",
      "instrument",
      "assam instrument",
      "assam",
      "music",
      "bihu"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1102n,
    title: "Pepa — Buffalo Horn Flute",
    description: "Traditional Assamese Pepa made from Buffalo horn, iconic instrument of Bihu celebrations.",
    price: 145000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80"
    ],
    category: 11n,
    subCategory: "Wind Instruments",
    rating: 47n,
    reviewCount: 98n,
    stock: 8n,
    brand: "Assam Musical Heritage",
    tags: [
      "pepa",
      "buffalo horn flute",
      "flute",
      "wind instrument",
      "instrument",
      "assam instrument",
      "assam",
      "music",
      "bihu"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1103n,
    title: "Gogona — Jaw Harp",
    description: "Delicate Assamese Gogona (jaw harp) made from bamboo, played by Bihu musicians.",
    price: 25000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80"
    ],
    category: 11n,
    subCategory: "Wind Instruments",
    rating: 46n,
    reviewCount: 78n,
    stock: 25n,
    brand: "Assam Musical Heritage",
    tags: [
      "gogona",
      "jaw harp",
      "bamboo instrument",
      "instrument",
      "assam instrument",
      "assam",
      "music",
      "bihu"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1104n,
    title: "Dotara — Four-String Folk Instrument",
    description: "Classic Assamese Dotara with four strings, used in Bhawaiya and folk music traditions.",
    price: 285000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80"
    ],
    category: 11n,
    subCategory: "String Instruments",
    rating: 48n,
    reviewCount: 65n,
    stock: 6n,
    brand: "Assam Musical Heritage",
    tags: [
      "dotara",
      "four string",
      "string instrument",
      "folk instrument",
      "instrument",
      "assam instrument",
      "assam",
      "music"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1105n,
    title: "Toka Bamboo Clappers — Pair",
    description: "Rhythmic bamboo clappers (Toka) used in Bihu dance and folk performances.",
    price: 18000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80"
    ],
    category: 11n,
    subCategory: "Percussion Instruments",
    rating: 43n,
    reviewCount: 55n,
    stock: 30n,
    brand: "Bongaigaon Crafts",
    tags: [
      "toka",
      "bamboo clappers",
      "clapper",
      "percussion",
      "instrument",
      "assam instrument",
      "assam",
      "music",
      "bihu"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1106n,
    title: "Xutuli Clay Flute — Traditional",
    description: "Hand-moulded clay Xutuli flute, a rustic wind instrument from rural Assam.",
    price: 12000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80"
    ],
    category: 11n,
    subCategory: "Wind Instruments",
    rating: 44n,
    reviewCount: 42n,
    stock: 20n,
    brand: "Hajo Pottery",
    tags: [
      "xutuli",
      "clay flute",
      "flute",
      "wind instrument",
      "instrument",
      "assam instrument",
      "assam",
      "music"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1107n,
    title: "Bahi Bamboo Flute — 8-hole",
    description: "8-hole Assamese Bahi bamboo flute for playing classical and folk Assamese melodies.",
    price: 35000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80"
    ],
    category: 11n,
    subCategory: "Wind Instruments",
    rating: 46n,
    reviewCount: 88n,
    stock: 15n,
    brand: "Assam Musical Heritage",
    tags: [
      "bahi",
      "bamboo flute",
      "flute",
      "wind instrument",
      "instrument",
      "assam instrument",
      "assam",
      "music"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1108n,
    title: "Nagara Drum — Festival Ceremonial",
    description: "Large ceremonial Nagara drum used in Namghars and Bihu festivals, handcrafted in Assam.",
    price: 549000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80"
    ],
    category: 11n,
    subCategory: "Percussion Instruments",
    rating: 49n,
    reviewCount: 22n,
    stock: 3n,
    brand: "Assam Musical Heritage",
    tags: [
      "nagara",
      "nagara drum",
      "drum",
      "ceremony",
      "percussion",
      "instrument",
      "assam instrument",
      "assam",
      "music",
      "festival"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── RELIGIOUS & PUJA ITEMS (cat 12) ───────────────────────────────────────
  {
    id: 1201n,
    title: "Brass Vishnu Idol — 6 inch",
    description: "Hand-cast brass Vishnu idol with fine detailing, ideal for home temples and gifting.",
    price: 145000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80"
    ],
    category: 12n,
    subCategory: "Idols & Figurines",
    rating: 48n,
    reviewCount: 230n,
    stock: 20n,
    brand: "Sarthebari Crafts",
    tags: [
      "vishnu idol",
      "brass idol",
      "idol",
      "puja",
      "religious",
      "assam puja",
      "assam",
      "worship",
      "temple"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1202n,
    title: "Copper Puja Thali Set — 7 Pieces",
    description: "Complete 7-piece copper puja thali set including diya, kalash, and incense holder.",
    price: 189000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80"
    ],
    category: 12n,
    subCategory: "Puja Sets",
    rating: 47n,
    reviewCount: 185n,
    stock: 15n,
    brand: "Sarthebari Crafts",
    tags: [
      "puja thali",
      "thali set",
      "copper puja",
      "puja set",
      "puja",
      "religious",
      "assam puja",
      "assam",
      "worship"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1203n,
    title: "Sandalwood Agarbatti — 100 Sticks",
    description: "Pure sandalwood incense sticks handrolled using traditional methods for a lasting fragrance.",
    price: 22000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80"
    ],
    category: 12n,
    subCategory: "Incense & Dhoop",
    rating: 46n,
    reviewCount: 420n,
    stock: 100n,
    brand: "Ayurved Assam",
    tags: [
      "agarbatti",
      "incense",
      "sandalwood",
      "dhoop",
      "puja",
      "religious",
      "fragrance",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1204n,
    title: "Tulsi Mala — 108 Beads",
    description: "Traditional 108-bead Tulsi (Holy Basil) mala for daily meditation and prayer.",
    price: 29000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80"
    ],
    category: 12n,
    subCategory: "Prayer Accessories",
    rating: 48n,
    reviewCount: 290n,
    stock: 60n,
    brand: "Ayurved Assam",
    tags: [
      "tulsi mala",
      "mala",
      "beads",
      "japa mala",
      "puja",
      "religious",
      "meditation",
      "assam",
      "prayer"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1205n,
    title: "Clay Diya Set — Pack of 12",
    description: "Hand-thrown clay diyas (oil lamps) for festivals and daily puja — set of 12.",
    price: 12000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80"
    ],
    category: 12n,
    subCategory: "Diyas & Lamps",
    rating: 47n,
    reviewCount: 890n,
    stock: 200n,
    brand: "Hajo Pottery",
    tags: [
      "diya",
      "clay diya",
      "oil lamp",
      "lamp",
      "puja",
      "religious",
      "festival",
      "diwali",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1206n,
    title: "Brass Laxmi Idol — 5 inch",
    description: "Beautifully cast brass Laxmi Mata idol with gold-like finish, for home altar.",
    price: 125000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80"
    ],
    category: 12n,
    subCategory: "Idols & Figurines",
    rating: 48n,
    reviewCount: 195n,
    stock: 18n,
    brand: "Sarthebari Crafts",
    tags: [
      "laxmi idol",
      "laxmi",
      "brass idol",
      "idol",
      "puja",
      "religious",
      "assam puja",
      "assam",
      "worship"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1207n,
    title: "Conch Shell (Shankh) — Ritual Grade",
    description: "Authentic ritual-grade Shankh (conch shell) with carved base, blown during Assamese puja.",
    price: 89000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80"
    ],
    category: 12n,
    subCategory: "Puja Sets",
    rating: 47n,
    reviewCount: 145n,
    stock: 12n,
    brand: "Assam Puja House",
    tags: [
      "shankh",
      "conch shell",
      "conch",
      "puja",
      "religious",
      "ritual",
      "assam puja",
      "assam",
      "worship"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1208n,
    title: "Ramayana Illustrated — Assamese Script",
    description: "Beautifully illustrated Ramayana in Assamese script, printed on premium art paper.",
    price: 55000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80"
    ],
    category: 12n,
    subCategory: "Prayer Accessories",
    rating: 49n,
    reviewCount: 120n,
    stock: 30n,
    brand: "Purvoday Press",
    tags: [
      "ramayana",
      "illustrated ramayana",
      "religious book",
      "puja",
      "religious",
      "assamese script",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── DECORATIVE ITEMS (cat 13) ─────────────────────────────────────────────
  {
    id: 1301n,
    title: "Assamese Motif Wall Clock — Bamboo",
    description: "Handmade bamboo wall clock with Assamese bihu dance motif printed dial.",
    price: 69000n,
    discountPercent: 10n,
    imageUrls: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80"
    ],
    category: 13n,
    subCategory: "Wall Decor",
    rating: 45n,
    reviewCount: 125n,
    stock: 20n,
    brand: "Bongaigaon Crafts",
    tags: [
      "wall clock",
      "clock",
      "bamboo",
      "assamese motif",
      "decor",
      "decorative",
      "assam decor",
      "assam",
      "home decor"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1302n,
    title: "Bamboo Photo Frame — 5x7 inch",
    description: "Eco-friendly bamboo photo frame with woven bamboo border and minimal Assamese carving.",
    price: 28000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80"
    ],
    category: 13n,
    subCategory: "Table Decor",
    rating: 43n,
    reviewCount: 95n,
    stock: 40n,
    brand: "Bongaigaon Crafts",
    tags: [
      "photo frame",
      "bamboo frame",
      "frame",
      "bamboo",
      "decor",
      "decorative",
      "assam decor",
      "assam",
      "home decor"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1303n,
    title: "Terracotta Figurine Set — Village Life",
    description: "Set of three hand-painted terracotta figurines depicting Assamese village life scenes.",
    price: 89000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80"
    ],
    category: 13n,
    subCategory: "Table Decor",
    rating: 46n,
    reviewCount: 68n,
    stock: 15n,
    brand: "Hajo Pottery",
    tags: [
      "terracotta figurine",
      "clay figurine",
      "terracotta",
      "figurine",
      "decor",
      "decorative",
      "assam decor",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1304n,
    title: "Hand-Painted Ceramic Vase — Assam Motif",
    description: "Premium ceramic vase with hand-painted Assamese floral and bird motifs in earthy tones.",
    price: 125000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80"
    ],
    category: 13n,
    subCategory: "Table Decor",
    rating: 47n,
    reviewCount: 55n,
    stock: 12n,
    brand: "Assam Ceramic Arts",
    tags: [
      "ceramic vase",
      "vase",
      "hand-painted",
      "assam motif",
      "decor",
      "decorative",
      "assam decor",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1305n,
    title: "Jaapi Wall Hanging — Large Decorative",
    description: "Oversized decorative Jaapi (Assamese traditional hat) for statement wall decor.",
    price: 185000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80"
    ],
    category: 13n,
    subCategory: "Wall Decor",
    rating: 48n,
    reviewCount: 89n,
    stock: 8n,
    brand: "Assam Heritage Crafts",
    tags: [
      "jaapi",
      "wall hanging",
      "assamese hat",
      "decor",
      "decorative",
      "wall decor",
      "assam decor",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1306n,
    title: "Cane Table Lamp — Handwoven",
    description: "Artisanal cane table lamp with natural cane woven shade and wooden base.",
    price: 169000n,
    discountPercent: 10n,
    imageUrls: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80"
    ],
    category: 13n,
    subCategory: "Traditional Ornaments",
    rating: 46n,
    reviewCount: 48n,
    stock: 10n,
    brand: "Bongaigaon Crafts",
    tags: [
      "table lamp",
      "cane lamp",
      "cane",
      "lamp",
      "decor",
      "decorative",
      "assam decor",
      "assam",
      "home decor"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1307n,
    title: "Assamese Pattern Cushion Cover — Set of 2",
    description: "Set of two cushion covers with traditional Assamese geometric woven patterns.",
    price: 55000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80"
    ],
    category: 13n,
    subCategory: "Gifting Items",
    rating: 44n,
    reviewCount: 78n,
    stock: 30n,
    brand: "Assam Textile House",
    tags: [
      "cushion cover",
      "cushion",
      "assamese pattern",
      "decor",
      "decorative",
      "assam decor",
      "assam",
      "home decor"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── KITCHEN & COOKWARE (cat 14) ───────────────────────────────────────────
  {
    id: 1401n,
    title: "Bell Metal Baan (Kahi) — Traditional",
    description: "Authentic Assamese bell metal Baan (Kahi) serving bowl, handcast in Sarthebari.",
    price: 145000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"
    ],
    category: 14n,
    subCategory: "Bell Metal Utensils",
    rating: 48n,
    reviewCount: 195n,
    stock: 15n,
    brand: "Sarthebari Crafts",
    tags: [
      "bell metal",
      "kahi",
      "baan",
      "bowl",
      "utensil",
      "kitchen",
      "assam kitchen",
      "assam",
      "traditional"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1402n,
    title: "Clay Cooking Pot — Assamese Dokona",
    description: "Hand-thrown clay cooking pot from Hajo for slow-cooked dals and curries.",
    price: 55000n,
    discountPercent: 10n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"
    ],
    category: 14n,
    subCategory: "Clay Pots & Vessels",
    rating: 46n,
    reviewCount: 125n,
    stock: 20n,
    brand: "Hajo Pottery",
    tags: [
      "clay pot",
      "cooking pot",
      "clay cooking pot",
      "clay",
      "kitchen",
      "assam kitchen",
      "assam",
      "traditional"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1403n,
    title: "Bamboo Serving Tray — Handpolished",
    description: "Hand-polished natural bamboo dining tray with raised edges, for serving and display.",
    price: 67000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"
    ],
    category: 14n,
    subCategory: "Bamboo Kitchenware",
    rating: 44n,
    reviewCount: 95n,
    stock: 25n,
    brand: "Bongaigaon Crafts",
    tags: [
      "bamboo tray",
      "serving tray",
      "bamboo",
      "tray",
      "kitchen",
      "assam kitchen",
      "assam",
      "dining"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1404n,
    title: "Bell Metal Spoon Set — 4 Pieces",
    description: "Traditional Assamese bell metal spoon set of 4, ideal for serving rice and curries.",
    price: 85000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"
    ],
    category: 14n,
    subCategory: "Bell Metal Utensils",
    rating: 47n,
    reviewCount: 112n,
    stock: 18n,
    brand: "Sarthebari Crafts",
    tags: [
      "bell metal spoon",
      "spoon set",
      "bell metal",
      "spoon",
      "utensil",
      "kitchen",
      "assam kitchen",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1405n,
    title: "Assamese Brass Pitcher — 1 Litre",
    description: "Elegant traditional brass pitcher (Kalash) for water, milk, or as a decorative piece.",
    price: 95000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"
    ],
    category: 14n,
    subCategory: "Traditional Cookware",
    rating: 46n,
    reviewCount: 78n,
    stock: 12n,
    brand: "Sarthebari Crafts",
    tags: [
      "brass pitcher",
      "kalash",
      "pitcher",
      "brass",
      "kitchen",
      "assam kitchen",
      "assam",
      "traditional"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1406n,
    title: "Bamboo Rice Steamer — Traditional Bhaat Patila",
    description: "Traditional bamboo rice steamer (Bhaat Patila) used for steaming rice and momos.",
    price: 48000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"
    ],
    category: 14n,
    subCategory: "Bamboo Kitchenware",
    rating: 45n,
    reviewCount: 65n,
    stock: 20n,
    brand: "Bongaigaon Crafts",
    tags: [
      "bamboo steamer",
      "rice steamer",
      "bhaat patila",
      "bamboo",
      "steamer",
      "kitchen",
      "assam kitchen",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1407n,
    title: "Earthen Water Pot — Matka",
    description: "Traditional unglazed earthen matka for keeping water naturally cool and earthy-tasting.",
    price: 25000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"
    ],
    category: 14n,
    subCategory: "Clay Pots & Vessels",
    rating: 47n,
    reviewCount: 340n,
    stock: 50n,
    brand: "Hajo Pottery",
    tags: [
      "matka",
      "earthen pot",
      "water pot",
      "clay pot",
      "clay",
      "kitchen",
      "assam kitchen",
      "assam",
      "traditional"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  // ── LIVING ROOM DECOR (cat 15) ────────────────────────────────────────────
  {
    id: 1501n,
    title: "Hand-Woven Assamese Rug — 3x5 ft",
    description: "Handwoven cotton rug with traditional Assamese geometric patterns in earth tones.",
    price: 285000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"
    ],
    category: 15n,
    subCategory: "Cushion Covers & Textiles",
    rating: 47n,
    reviewCount: 85n,
    stock: 10n,
    brand: "Assam Textile House",
    tags: [
      "rug",
      "assamese rug",
      "handwoven rug",
      "carpet",
      "living room",
      "decor",
      "assam decor",
      "assam",
      "home decor"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1502n,
    title: "Assamese Motif Cushion Cover Set — 4 Pieces",
    description: "Set of 4 cushion covers in Assamese Mising tribal motif woven fabric.",
    price: 89000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"
    ],
    category: 15n,
    subCategory: "Cushion Covers & Textiles",
    rating: 45n,
    reviewCount: 120n,
    stock: 25n,
    brand: "Assam Textile House",
    tags: [
      "cushion cover",
      "cushion set",
      "assamese motif",
      "mising",
      "living room",
      "decor",
      "assam decor",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1503n,
    title: "Bamboo Wall Hanging — Abstract Weave",
    description: "Contemporary bamboo wall hanging with abstract woven pattern, a modern Assamese statement piece.",
    price: 115000n,
    discountPercent: 10n,
    imageUrls: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"
    ],
    category: 15n,
    subCategory: "Traditional Decor",
    rating: 46n,
    reviewCount: 65n,
    stock: 15n,
    brand: "Bongaigaon Crafts",
    tags: [
      "bamboo wall hanging",
      "wall hanging",
      "bamboo",
      "living room",
      "decor",
      "wall decor",
      "assam decor",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1504n,
    title: "Traditional Saaki Lamp — Brass",
    description: "Ornate traditional Saaki (Assamese ceremonial lamp) in polished brass for living spaces.",
    price: 195000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"
    ],
    category: 15n,
    subCategory: "Statement Pieces",
    rating: 48n,
    reviewCount: 52n,
    stock: 8n,
    brand: "Sarthebari Crafts",
    tags: [
      "saaki lamp",
      "saaki",
      "traditional lamp",
      "brass lamp",
      "living room",
      "decor",
      "assam decor",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1505n,
    title: "Assamese Tapestry — Brahmaputra Scene",
    description: "Hand-woven tapestry depicting the Brahmaputra valley in earthy greens and blues.",
    price: 245000n,
    discountPercent: 0n,
    imageUrls: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"
    ],
    category: 15n,
    subCategory: "Traditional Decor",
    rating: 47n,
    reviewCount: 38n,
    stock: 6n,
    brand: "Assam Textile House",
    tags: [
      "tapestry",
      "assamese tapestry",
      "wall art",
      "brahmaputra",
      "living room",
      "decor",
      "assam decor",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1506n,
    title: "Cane Fruit Bowl — Handwoven",
    description: "Beautifully handwoven cane fruit bowl in natural finish — functional and decorative.",
    price: 45000n,
    discountPercent: 5n,
    imageUrls: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"
    ],
    category: 15n,
    subCategory: "Traditional Decor",
    rating: 44n,
    reviewCount: 78n,
    stock: 30n,
    brand: "Bongaigaon Crafts",
    tags: [
      "cane bowl",
      "fruit bowl",
      "cane",
      "bowl",
      "living room",
      "decor",
      "assam decor",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 1507n,
    title: "Tribal Motif Throw Blanket — Bodo Pattern",
    description: "Warm, soft throw blanket with Bodo tribal geometric patterns in bold earth tones.",
    price: 175000n,
    discountPercent: 8n,
    imageUrls: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"
    ],
    category: 15n,
    subCategory: "Cushion Covers & Textiles",
    rating: 46n,
    reviewCount: 48n,
    stock: 12n,
    brand: "Assam Textile House",
    tags: [
      "throw blanket",
      "blanket",
      "bodo pattern",
      "tribal",
      "living room",
      "decor",
      "assam decor",
      "assam"
    ],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  }
];
function searchProducts(query) {
  if (!query.trim()) return ALL_PRODUCTS;
  const q = query.toLowerCase().trim();
  return ALL_PRODUCTS.filter((p) => {
    if (p.title.toLowerCase().includes(q)) return true;
    if (p.description.toLowerCase().includes(q)) return true;
    if (p.brand.toLowerCase().includes(q)) return true;
    if (p.subCategory.toLowerCase().includes(q)) return true;
    if (p.tags.some((t) => t.toLowerCase().includes(q))) return true;
    const cat = ALL_CATEGORIES.find((c) => c.id === p.category);
    if (cat == null ? void 0 : cat.name.toLowerCase().includes(q)) return true;
    if (cat == null ? void 0 : cat.slug.toLowerCase().includes(q)) return true;
    return false;
  });
}
const QUICK_LINKS = [
  { label: "Tea", slug: "assam-tea" },
  { label: "Handloom", slug: "handloom-textiles" },
  { label: "Spices", slug: "spices-herbs" },
  { label: "Crafts", slug: "handicrafts" },
  { label: "Food", slug: "assamese-food" },
  { label: "Music", slug: "musical-instruments" }
];
function SearchBar({ initialFocus, placeholder }) {
  const [query, setQuery] = reactExports.useState("");
  const [focused, setFocused] = reactExports.useState(false);
  const containerRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    var _a2;
    if (initialFocus) (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
  }, [initialFocus]);
  const suggestions = reactExports.useMemo(() => {
    if (!query.trim()) return [];
    const results = searchProducts(query);
    const seen = /* @__PURE__ */ new Set();
    const titles = [];
    for (const p of results) {
      if (!seen.has(p.title) && titles.length < 7) {
        seen.add(p.title);
        titles.push(p.title);
      }
    }
    return titles;
  }, [query]);
  const handleSearch = reactExports.useCallback(
    (term) => {
      var _a2;
      if (!term.trim()) return;
      setFocused(false);
      (_a2 = inputRef.current) == null ? void 0 : _a2.blur();
      navigate({
        to: "/products",
        search: { q: term.trim(), category: void 0 }
      });
    },
    [navigate]
  );
  const handleKeyDown = (e) => {
    var _a2;
    if (e.key === "Enter") handleSearch(query);
    if (e.key === "Escape") {
      setFocused(false);
      (_a2 = inputRef.current) == null ? void 0 : _a2.blur();
    }
  };
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: "relative w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Search,
        {
          size: 16,
          className: "absolute left-4 text-muted-foreground pointer-events-none z-10"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          type: "search",
          value: query,
          placeholder: placeholder ?? "Search tea, spices, handloom, crafts…",
          className: "search-input w-full pl-12 pr-11 h-11 text-sm",
          onFocus: () => setFocused(true),
          onChange: (e) => setQuery(e.target.value),
          onKeyDown: handleKeyDown,
          "data-ocid": "search-input",
          "aria-label": "Search products"
        }
      ),
      query && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setQuery(""),
          className: "absolute right-4 text-muted-foreground hover:text-foreground transition-colors p-1",
          "aria-label": "Clear search",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-3 overflow-x-auto pb-0.5 scrollbar-none", children: QUICK_LINKS.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => navigate({ to: "/categories/$slug", params: { slug: link.slug } }),
        className: "flex-none px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-smooth whitespace-nowrap",
        "data-ocid": `search-quick-link-${link.slug}`,
        children: link.label
      },
      link.slug
    )) }),
    focused && suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden list-none p-0 m-0", children: suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors text-left",
        onMouseDown: (e) => {
          e.preventDefault();
          setQuery(s);
          handleSearch(s);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 13, className: "text-muted-foreground flex-none" }),
          s
        ]
      }
    ) }, s)) })
  ] });
}
const CART_KEY = "assam_roots_cart";
function replacer(_key, value) {
  if (typeof value === "bigint") return `${value.toString()}n`;
  return value;
}
function reviver(_key, value) {
  if (typeof value === "string" && /^-?\d+n$/.test(value)) {
    return BigInt(value.slice(0, -1));
  }
  return value;
}
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw, reviver);
  } catch {
    return [];
  }
}
function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items, replacer));
  } catch {
  }
}
function computeState(items) {
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => {
    const price = Number(i.product.price);
    const discount = Number(i.product.discountPercent);
    const final = price - price * discount / 100;
    return s + final * i.quantity;
  }, 0);
  return { items, totalItems, totalPrice };
}
function useCart() {
  const [items, setItems] = reactExports.useState(loadCart);
  reactExports.useEffect(() => {
    saveCart(items);
  }, [items]);
  const addItem = reactExports.useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => BigInt(i.product.id) === BigInt(product.id)
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + quantity
        };
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  }, []);
  const removeItem = reactExports.useCallback((productId) => {
    setItems(
      (prev) => prev.filter((i) => BigInt(i.product.id) !== BigInt(productId))
    );
  }, []);
  const updateQuantity = reactExports.useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems(
        (prev) => prev.filter((i) => BigInt(i.product.id) !== BigInt(productId))
      );
      return;
    }
    setItems(
      (prev) => prev.map(
        (i) => BigInt(i.product.id) === BigInt(productId) ? { ...i, quantity } : i
      )
    );
  }, []);
  const clearCart = reactExports.useCallback(() => {
    setItems([]);
  }, []);
  const getQuantity = reactExports.useCallback(
    (productId) => {
      var _a2;
      return ((_a2 = items.find((i) => BigInt(i.product.id) === BigInt(productId))) == null ? void 0 : _a2.quantity) ?? 0;
    },
    [items]
  );
  const isInCart = reactExports.useCallback(
    (productId) => {
      return items.some((i) => BigInt(i.product.id) === BigInt(productId));
    },
    [items]
  );
  return {
    ...computeState(items),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getQuantity,
    isInCart
  };
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
const CreateOrderInput = Record({
  "deliveryAddress": DeliveryAddress,
  "paymentMethod": Text,
  "deliveryCost": Nat,
  "deliveryType": DeliveryType$1,
  "items": Vec(
    Record({ "productId": Nat, "quantity": Nat })
  )
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
    [Text, Text, Text, Text],
    [Variant({ "ok": Category, "err": Text })],
    []
  ),
  "adminAddFeaturedBlock": Func([FeaturedBlockInput], [FeaturedBlock], []),
  "adminAddHeroBanner": Func([HeroBannerInput], [HeroBanner], []),
  "adminAddProduct": Func([ProductInput], [Product], []),
  "adminAddSubCategory": Func(
    [CategoryId, Text, Text],
    [Variant({ "ok": Category, "err": Text })],
    []
  ),
  "adminDeleteCategory": Func(
    [CategoryId],
    [Variant({ "ok": Bool, "err": Text })],
    []
  ),
  "adminDeleteFeaturedBlock": Func(
    [FeaturedBlockId],
    [Variant({ "ok": Bool, "err": Text })],
    []
  ),
  "adminDeleteHeroBanner": Func(
    [HeroBannerId],
    [Variant({ "ok": Bool, "err": Text })],
    []
  ),
  "adminDeleteProduct": Func([ProductId], [Bool], []),
  "adminDeleteServiceRequest": Func([Nat], [Bool], []),
  "adminDeleteSubCategory": Func(
    [CategoryId, SubCategoryId],
    [Variant({ "ok": Category, "err": Text })],
    []
  ),
  "adminGetAllOrders": Func(
    [Nat, Nat],
    [Vec(OrderPublic)],
    ["query"]
  ),
  "adminGetCategories": Func([], [Vec(Category)], ["query"]),
  "adminGetServiceRequests": Func(
    [],
    [Vec(ServiceRequestPublic)],
    ["query"]
  ),
  "adminListFeaturedBlocks": Func([], [Vec(FeaturedBlock)], ["query"]),
  "adminListHeroBanners": Func([], [Vec(HeroBanner)], ["query"]),
  "adminLogin": Func([Text, Text], [Opt(Text)], []),
  "adminLogout": Func([Text], [], []),
  "adminRegisterImageHash": Func([Text], [Text], []),
  "adminReorderHeroBanner": Func(
    [HeroBannerId, Nat],
    [Variant({ "ok": HeroBanner, "err": Text })],
    []
  ),
  "adminSetDiscount": Func([ProductId, Nat], [Opt(Product)], []),
  "adminSetUserAdmin": Func([Principal$1, Bool], [Bool], []),
  "adminUpdateCategory": Func(
    [CategoryId, Text, Text, Text, Text],
    [Variant({ "ok": Category, "err": Text })],
    []
  ),
  "adminUpdateFeaturedBlock": Func(
    [FeaturedBlockId, FeaturedBlockInput],
    [Variant({ "ok": FeaturedBlock, "err": Text })],
    []
  ),
  "adminUpdateHeroBanner": Func(
    [HeroBannerId, HeroBannerInput],
    [Variant({ "ok": HeroBanner, "err": Text })],
    []
  ),
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
  "adminUpdateServicesAvailability": Func([Bool, Text], [], []),
  "adminUpdateSiteSettings": Func(
    [Opt(Text), Opt(Text)],
    [
      Record({
        "logoUrl": Opt(Text),
        "faviconUrl": Opt(Text)
      })
    ],
    []
  ),
  "adminUpdateStock": Func([ProductId, Nat], [Opt(Product)], []),
  "adminUpdateSubCategory": Func(
    [CategoryId, SubCategoryId, Text, Text],
    [Variant({ "ok": Category, "err": Text })],
    []
  ),
  "adminUpdateVideoByte": Func([Text, Bool, Text], [], []),
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
  "getHeroBanner": Func([HeroBannerId], [Opt(HeroBanner)], ["query"]),
  "getMyCart": Func([], [CartPublic], []),
  "getMyOrders": Func([], [Vec(OrderPublic)], ["query"]),
  "getMyProfile": Func([], [UserProfilePublic], []),
  "getOrder": Func([OrderId], [Opt(OrderPublic)], ["query"]),
  "getProduct": Func([ProductId], [Opt(Product)], ["query"]),
  "getServicesAvailability": Func(
    [],
    [Record({ "available": Bool, "message": Text })],
    ["query"]
  ),
  "getSiteSettings": Func(
    [],
    [
      Record({
        "logoUrl": Opt(Text),
        "faviconUrl": Opt(Text)
      })
    ],
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
  "listCategories": Func([], [Vec(Category)], ["query"]),
  "listFeaturedBlocks": Func([], [Vec(FeaturedBlock)], ["query"]),
  "listHeroBanners": Func([], [Vec(HeroBanner)], ["query"]),
  "listProducts": Func([ProductFilter], [ProductListResult], ["query"]),
  "listProductsByCategory": Func(
    [CategoryId, Nat, Nat],
    [ProductListResult],
    ["query"]
  ),
  "razorpayTransform": Func(
    [TransformationInput],
    [TransformationOutput],
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
  "updateMyProfile": Func([UserProfileInput], [UserProfilePublic], []),
  "verifyRazorpayPayment": Func(
    [Text, Text, Text],
    [Variant({ "ok": Bool, "err": Text })],
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
  const CreateOrderInput2 = IDL2.Record({
    "deliveryAddress": DeliveryAddress2,
    "paymentMethod": IDL2.Text,
    "deliveryCost": IDL2.Nat,
    "deliveryType": DeliveryType2,
    "items": IDL2.Vec(
      IDL2.Record({ "productId": IDL2.Nat, "quantity": IDL2.Nat })
    )
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
      [IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Text],
      [IDL2.Variant({ "ok": Category2, "err": IDL2.Text })],
      []
    ),
    "adminAddFeaturedBlock": IDL2.Func(
      [FeaturedBlockInput2],
      [FeaturedBlock2],
      []
    ),
    "adminAddHeroBanner": IDL2.Func([HeroBannerInput2], [HeroBanner2], []),
    "adminAddProduct": IDL2.Func([ProductInput2], [Product2], []),
    "adminAddSubCategory": IDL2.Func(
      [CategoryId2, IDL2.Text, IDL2.Text],
      [IDL2.Variant({ "ok": Category2, "err": IDL2.Text })],
      []
    ),
    "adminDeleteCategory": IDL2.Func(
      [CategoryId2],
      [IDL2.Variant({ "ok": IDL2.Bool, "err": IDL2.Text })],
      []
    ),
    "adminDeleteFeaturedBlock": IDL2.Func(
      [FeaturedBlockId2],
      [IDL2.Variant({ "ok": IDL2.Bool, "err": IDL2.Text })],
      []
    ),
    "adminDeleteHeroBanner": IDL2.Func(
      [HeroBannerId2],
      [IDL2.Variant({ "ok": IDL2.Bool, "err": IDL2.Text })],
      []
    ),
    "adminDeleteProduct": IDL2.Func([ProductId2], [IDL2.Bool], []),
    "adminDeleteServiceRequest": IDL2.Func([IDL2.Nat], [IDL2.Bool], []),
    "adminDeleteSubCategory": IDL2.Func(
      [CategoryId2, SubCategoryId2],
      [IDL2.Variant({ "ok": Category2, "err": IDL2.Text })],
      []
    ),
    "adminGetAllOrders": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [IDL2.Vec(OrderPublic2)],
      ["query"]
    ),
    "adminGetCategories": IDL2.Func([], [IDL2.Vec(Category2)], ["query"]),
    "adminGetServiceRequests": IDL2.Func(
      [],
      [IDL2.Vec(ServiceRequestPublic2)],
      ["query"]
    ),
    "adminListFeaturedBlocks": IDL2.Func(
      [],
      [IDL2.Vec(FeaturedBlock2)],
      ["query"]
    ),
    "adminListHeroBanners": IDL2.Func([], [IDL2.Vec(HeroBanner2)], ["query"]),
    "adminLogin": IDL2.Func([IDL2.Text, IDL2.Text], [IDL2.Opt(IDL2.Text)], []),
    "adminLogout": IDL2.Func([IDL2.Text], [], []),
    "adminRegisterImageHash": IDL2.Func([IDL2.Text], [IDL2.Text], []),
    "adminReorderHeroBanner": IDL2.Func(
      [HeroBannerId2, IDL2.Nat],
      [IDL2.Variant({ "ok": HeroBanner2, "err": IDL2.Text })],
      []
    ),
    "adminSetDiscount": IDL2.Func([ProductId2, IDL2.Nat], [IDL2.Opt(Product2)], []),
    "adminSetUserAdmin": IDL2.Func([IDL2.Principal, IDL2.Bool], [IDL2.Bool], []),
    "adminUpdateCategory": IDL2.Func(
      [CategoryId2, IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Text],
      [IDL2.Variant({ "ok": Category2, "err": IDL2.Text })],
      []
    ),
    "adminUpdateFeaturedBlock": IDL2.Func(
      [FeaturedBlockId2, FeaturedBlockInput2],
      [IDL2.Variant({ "ok": FeaturedBlock2, "err": IDL2.Text })],
      []
    ),
    "adminUpdateHeroBanner": IDL2.Func(
      [HeroBannerId2, HeroBannerInput2],
      [IDL2.Variant({ "ok": HeroBanner2, "err": IDL2.Text })],
      []
    ),
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
    "adminUpdateServicesAvailability": IDL2.Func([IDL2.Bool, IDL2.Text], [], []),
    "adminUpdateSiteSettings": IDL2.Func(
      [IDL2.Opt(IDL2.Text), IDL2.Opt(IDL2.Text)],
      [
        IDL2.Record({
          "logoUrl": IDL2.Opt(IDL2.Text),
          "faviconUrl": IDL2.Opt(IDL2.Text)
        })
      ],
      []
    ),
    "adminUpdateStock": IDL2.Func([ProductId2, IDL2.Nat], [IDL2.Opt(Product2)], []),
    "adminUpdateSubCategory": IDL2.Func(
      [CategoryId2, SubCategoryId2, IDL2.Text, IDL2.Text],
      [IDL2.Variant({ "ok": Category2, "err": IDL2.Text })],
      []
    ),
    "adminUpdateVideoByte": IDL2.Func([IDL2.Text, IDL2.Bool, IDL2.Text], [], []),
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
    "getHeroBanner": IDL2.Func(
      [HeroBannerId2],
      [IDL2.Opt(HeroBanner2)],
      ["query"]
    ),
    "getMyCart": IDL2.Func([], [CartPublic2], []),
    "getMyOrders": IDL2.Func([], [IDL2.Vec(OrderPublic2)], ["query"]),
    "getMyProfile": IDL2.Func([], [UserProfilePublic2], []),
    "getOrder": IDL2.Func([OrderId2], [IDL2.Opt(OrderPublic2)], ["query"]),
    "getProduct": IDL2.Func([ProductId2], [IDL2.Opt(Product2)], ["query"]),
    "getServicesAvailability": IDL2.Func(
      [],
      [IDL2.Record({ "available": IDL2.Bool, "message": IDL2.Text })],
      ["query"]
    ),
    "getSiteSettings": IDL2.Func(
      [],
      [
        IDL2.Record({
          "logoUrl": IDL2.Opt(IDL2.Text),
          "faviconUrl": IDL2.Opt(IDL2.Text)
        })
      ],
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
    "listCategories": IDL2.Func([], [IDL2.Vec(Category2)], ["query"]),
    "listFeaturedBlocks": IDL2.Func([], [IDL2.Vec(FeaturedBlock2)], ["query"]),
    "listHeroBanners": IDL2.Func([], [IDL2.Vec(HeroBanner2)], ["query"]),
    "listProducts": IDL2.Func([ProductFilter2], [ProductListResult2], ["query"]),
    "listProductsByCategory": IDL2.Func(
      [CategoryId2, IDL2.Nat, IDL2.Nat],
      [ProductListResult2],
      ["query"]
    ),
    "razorpayTransform": IDL2.Func(
      [TransformationInput2],
      [TransformationOutput2],
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
    "updateMyProfile": IDL2.Func([UserProfileInput2], [UserProfilePublic2], []),
    "verifyRazorpayPayment": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Bool, "err": IDL2.Text })],
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
  async adminAddCategory(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.adminAddCategory(arg0, arg1, arg2, arg3);
        return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminAddCategory(arg0, arg1, arg2, arg3);
      return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminAddFeaturedBlock(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminAddFeaturedBlock(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminAddFeaturedBlock(arg0);
      return result;
    }
  }
  async adminAddHeroBanner(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminAddHeroBanner(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminAddHeroBanner(arg0);
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
  async adminAddSubCategory(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminAddSubCategory(arg0, arg1, arg2);
        return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminAddSubCategory(arg0, arg1, arg2);
      return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminDeleteCategory(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminDeleteCategory(arg0);
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminDeleteCategory(arg0);
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminDeleteFeaturedBlock(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminDeleteFeaturedBlock(arg0);
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminDeleteFeaturedBlock(arg0);
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminDeleteHeroBanner(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminDeleteHeroBanner(arg0);
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminDeleteHeroBanner(arg0);
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
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
  async adminDeleteSubCategory(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminDeleteSubCategory(arg0, arg1);
        return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminDeleteSubCategory(arg0, arg1);
      return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminGetAllOrders(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminGetAllOrders(arg0, arg1);
        return from_candid_vec_n10(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminGetAllOrders(arg0, arg1);
      return from_candid_vec_n10(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminGetCategories() {
    if (this.processError) {
      try {
        const result = await this.actor.adminGetCategories();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminGetCategories();
      return result;
    }
  }
  async adminGetServiceRequests() {
    if (this.processError) {
      try {
        const result = await this.actor.adminGetServiceRequests();
        return from_candid_vec_n21(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminGetServiceRequests();
      return from_candid_vec_n21(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminListFeaturedBlocks() {
    if (this.processError) {
      try {
        const result = await this.actor.adminListFeaturedBlocks();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminListFeaturedBlocks();
      return result;
    }
  }
  async adminListHeroBanners() {
    if (this.processError) {
      try {
        const result = await this.actor.adminListHeroBanners();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminListHeroBanners();
      return result;
    }
  }
  async adminLogin(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminLogin(arg0, arg1);
        return from_candid_opt_n28(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminLogin(arg0, arg1);
      return from_candid_opt_n28(this._uploadFile, this._downloadFile, result);
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
  async adminRegisterImageHash(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminRegisterImageHash(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminRegisterImageHash(arg0);
      return result;
    }
  }
  async adminReorderHeroBanner(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminReorderHeroBanner(arg0, arg1);
        return from_candid_variant_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminReorderHeroBanner(arg0, arg1);
      return from_candid_variant_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminSetDiscount(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminSetDiscount(arg0, arg1);
        return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminSetDiscount(arg0, arg1);
      return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
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
  async adminUpdateCategory(arg0, arg1, arg2, arg3, arg4) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateCategory(arg0, arg1, arg2, arg3, arg4);
        return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateCategory(arg0, arg1, arg2, arg3, arg4);
      return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateFeaturedBlock(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateFeaturedBlock(arg0, arg1);
        return from_candid_variant_n31(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateFeaturedBlock(arg0, arg1);
      return from_candid_variant_n31(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateHeroBanner(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateHeroBanner(arg0, arg1);
        return from_candid_variant_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateHeroBanner(arg0, arg1);
      return from_candid_variant_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateOrderStatus(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateOrderStatus(arg0, to_candid_OrderStatus_n32(this._uploadFile, this._downloadFile, arg1), arg2);
        return from_candid_opt_n34(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateOrderStatus(arg0, to_candid_OrderStatus_n32(this._uploadFile, this._downloadFile, arg1), arg2);
      return from_candid_opt_n34(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateProduct(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateProduct(arg0, arg1);
        return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateProduct(arg0, arg1);
      return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateServiceRequestStatus(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateServiceRequestStatus(arg0, to_candid_ServiceRequestStatus_n35(this._uploadFile, this._downloadFile, arg1));
        return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateServiceRequestStatus(arg0, to_candid_ServiceRequestStatus_n35(this._uploadFile, this._downloadFile, arg1));
      return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateServicesAvailability(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateServicesAvailability(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateServicesAvailability(arg0, arg1);
      return result;
    }
  }
  async adminUpdateSiteSettings(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateSiteSettings(to_candid_opt_n38(this._uploadFile, this._downloadFile, arg0), to_candid_opt_n38(this._uploadFile, this._downloadFile, arg1));
        return from_candid_record_n39(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateSiteSettings(to_candid_opt_n38(this._uploadFile, this._downloadFile, arg0), to_candid_opt_n38(this._uploadFile, this._downloadFile, arg1));
      return from_candid_record_n39(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateStock(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateStock(arg0, arg1);
        return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateStock(arg0, arg1);
      return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateSubCategory(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateSubCategory(arg0, arg1, arg2, arg3);
        return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateSubCategory(arg0, arg1, arg2, arg3);
      return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminUpdateVideoByte(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.adminUpdateVideoByte(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminUpdateVideoByte(arg0, arg1, arg2);
      return result;
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
        const result = await this.actor.createOrder(to_candid_CreateOrderInput_n40(this._uploadFile, this._downloadFile, arg0));
        return from_candid_OrderPublic_n11(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createOrder(to_candid_CreateOrderInput_n40(this._uploadFile, this._downloadFile, arg0));
      return from_candid_OrderPublic_n11(this._uploadFile, this._downloadFile, result);
    }
  }
  async createRazorpayOrder(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.createRazorpayOrder(arg0, arg1);
        return from_candid_variant_n44(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createRazorpayOrder(arg0, arg1);
      return from_candid_variant_n44(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCategory(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCategory(arg0);
        return from_candid_opt_n45(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCategory(arg0);
      return from_candid_opt_n45(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCategoryBySlug(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCategoryBySlug(arg0);
        return from_candid_opt_n45(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCategoryBySlug(arg0);
      return from_candid_opt_n45(this._uploadFile, this._downloadFile, result);
    }
  }
  async getFeaturedBlock(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getFeaturedBlock(arg0);
        return from_candid_opt_n46(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getFeaturedBlock(arg0);
      return from_candid_opt_n46(this._uploadFile, this._downloadFile, result);
    }
  }
  async getHeroBanner(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getHeroBanner(arg0);
        return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getHeroBanner(arg0);
      return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
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
        return from_candid_vec_n10(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyOrders();
      return from_candid_vec_n10(this._uploadFile, this._downloadFile, result);
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
        return from_candid_opt_n34(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getOrder(arg0);
      return from_candid_opt_n34(this._uploadFile, this._downloadFile, result);
    }
  }
  async getProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getProduct(arg0);
        return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProduct(arg0);
      return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
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
        return from_candid_record_n39(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSiteSettings();
      return from_candid_record_n39(this._uploadFile, this._downloadFile, result);
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
  async listProducts(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listProducts(to_candid_ProductFilter_n48(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listProducts(to_candid_ProductFilter_n48(this._uploadFile, this._downloadFile, arg0));
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
        const result = await this.actor.submitServiceRequest(to_candid_CreateServiceRequestInput_n50(this._uploadFile, this._downloadFile, arg0));
        return from_candid_ServiceRequestPublic_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitServiceRequest(to_candid_CreateServiceRequestInput_n50(this._uploadFile, this._downloadFile, arg0));
      return from_candid_ServiceRequestPublic_n22(this._uploadFile, this._downloadFile, result);
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
  async verifyRazorpayPayment(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.verifyRazorpayPayment(arg0, arg1, arg2);
        return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.verifyRazorpayPayment(arg0, arg1, arg2);
      return from_candid_variant_n9(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_DeliveryType_n19(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n20(_uploadFile, _downloadFile, value);
}
function from_candid_OrderPublic_n11(_uploadFile, _downloadFile, value) {
  return from_candid_record_n12(_uploadFile, _downloadFile, value);
}
function from_candid_OrderStatus_n13(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n14(_uploadFile, _downloadFile, value);
}
function from_candid_ServiceRequestPublic_n22(_uploadFile, _downloadFile, value) {
  return from_candid_record_n23(_uploadFile, _downloadFile, value);
}
function from_candid_ServiceRequestStatus_n24(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n25(_uploadFile, _downloadFile, value);
}
function from_candid_ServiceType_n26(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n27(_uploadFile, _downloadFile, value);
}
function from_candid_ShipmentUpdate_n16(_uploadFile, _downloadFile, value) {
  return from_candid_record_n17(_uploadFile, _downloadFile, value);
}
function from_candid__ImmutableObjectStorageRefillResult_n4(_uploadFile, _downloadFile, value) {
  return from_candid_record_n5(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n18(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n28(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n30(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n34(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_OrderPublic_n11(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n37(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_ServiceRequestPublic_n22(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n45(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n46(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n47(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n6(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n12(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_OrderStatus_n13(_uploadFile, _downloadFile, value.status),
    deliveryAddress: value.deliveryAddress,
    shipmentUpdates: from_candid_vec_n15(_uploadFile, _downloadFile, value.shipmentUpdates),
    paymentMethod: value.paymentMethod,
    userId: value.userId,
    createdAt: value.createdAt,
    estimatedDelivery: record_opt_to_undefined(from_candid_opt_n18(_uploadFile, _downloadFile, value.estimatedDelivery)),
    deliveryCost: value.deliveryCost,
    deliveryType: from_candid_DeliveryType_n19(_uploadFile, _downloadFile, value.deliveryType),
    updatedAt: value.updatedAt,
    totalAmount: value.totalAmount,
    items: value.items
  };
}
function from_candid_record_n17(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_OrderStatus_n13(_uploadFile, _downloadFile, value.status),
    message: value.message,
    timestamp: value.timestamp
  };
}
function from_candid_record_n23(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_ServiceRequestStatus_n24(_uploadFile, _downloadFile, value.status),
    userName: value.userName,
    serviceType: from_candid_ServiceType_n26(_uploadFile, _downloadFile, value.serviceType),
    userId: value.userId,
    recipientPhone: record_opt_to_undefined(from_candid_opt_n28(_uploadFile, _downloadFile, value.recipientPhone)),
    submittedAt: value.submittedAt,
    description: value.description,
    userPhone: value.userPhone,
    lastUpdatedAt: value.lastUpdatedAt,
    isRequestForSelf: value.isRequestForSelf,
    preferredDate: value.preferredDate,
    preferredTime: value.preferredTime,
    recipientAddress: record_opt_to_undefined(from_candid_opt_n28(_uploadFile, _downloadFile, value.recipientAddress)),
    recipientName: record_opt_to_undefined(from_candid_opt_n28(_uploadFile, _downloadFile, value.recipientName))
  };
}
function from_candid_record_n39(_uploadFile, _downloadFile, value) {
  return {
    logoUrl: record_opt_to_undefined(from_candid_opt_n28(_uploadFile, _downloadFile, value.logoUrl)),
    faviconUrl: record_opt_to_undefined(from_candid_opt_n28(_uploadFile, _downloadFile, value.faviconUrl))
  };
}
function from_candid_record_n5(_uploadFile, _downloadFile, value) {
  return {
    success: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.success)),
    topped_up_amount: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.topped_up_amount))
  };
}
function from_candid_variant_n14(_uploadFile, _downloadFile, value) {
  return "Delivered" in value ? "Delivered" : "Confirmed" in value ? "Confirmed" : "Cancelled" in value ? "Cancelled" : "Processing" in value ? "Processing" : "Shipped" in value ? "Shipped" : "OutForDelivery" in value ? "OutForDelivery" : value;
}
function from_candid_variant_n20(_uploadFile, _downloadFile, value) {
  return "Standard" in value ? "Standard" : "Express" in value ? "Express" : value;
}
function from_candid_variant_n25(_uploadFile, _downloadFile, value) {
  return "New" in value ? "New" : "Contacted" in value ? "Contacted" : "Cancelled" in value ? "Cancelled" : "Completed" in value ? "Completed" : value;
}
function from_candid_variant_n27(_uploadFile, _downloadFile, value) {
  return "Ambulance" in value ? "Ambulance" : "FoodDelivery" in value ? "FoodDelivery" : "Taxi" in value ? "Taxi" : "SchoolAdmissions" in value ? "SchoolAdmissions" : "Medicines" in value ? "Medicines" : "Gifting" in value ? "Gifting" : "FuneralServices" in value ? "FuneralServices" : "Tourism" in value ? "Tourism" : "Doctors" in value ? "Doctors" : "VideoConferencing" in value ? "VideoConferencing" : "EventManagement" in value ? "EventManagement" : "WeddingsAnniversaries" in value ? "WeddingsAnniversaries" : "Other" in value ? "Other" : value;
}
function from_candid_variant_n29(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n31(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n44(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
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
function from_candid_variant_n9(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_vec_n10(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_OrderPublic_n11(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n15(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ShipmentUpdate_n16(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n21(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ServiceRequestPublic_n22(_uploadFile, _downloadFile, x));
}
function to_candid_CreateOrderInput_n40(_uploadFile, _downloadFile, value) {
  return to_candid_record_n41(_uploadFile, _downloadFile, value);
}
function to_candid_CreateServiceRequestInput_n50(_uploadFile, _downloadFile, value) {
  return to_candid_record_n51(_uploadFile, _downloadFile, value);
}
function to_candid_DeliveryType_n42(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n43(_uploadFile, _downloadFile, value);
}
function to_candid_OrderStatus_n32(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n33(_uploadFile, _downloadFile, value);
}
function to_candid_ProductFilter_n48(_uploadFile, _downloadFile, value) {
  return to_candid_record_n49(_uploadFile, _downloadFile, value);
}
function to_candid_ServiceRequestStatus_n35(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n36(_uploadFile, _downloadFile, value);
}
function to_candid_ServiceType_n52(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n53(_uploadFile, _downloadFile, value);
}
function to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value) {
  return to_candid_record_n3(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n1(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value));
}
function to_candid_opt_n38(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_record_n3(_uploadFile, _downloadFile, value) {
  return {
    proposed_top_up_amount: value.proposed_top_up_amount ? candid_some(value.proposed_top_up_amount) : candid_none()
  };
}
function to_candid_record_n41(_uploadFile, _downloadFile, value) {
  return {
    deliveryAddress: value.deliveryAddress,
    paymentMethod: value.paymentMethod,
    deliveryCost: value.deliveryCost,
    deliveryType: to_candid_DeliveryType_n42(_uploadFile, _downloadFile, value.deliveryType),
    items: value.items
  };
}
function to_candid_record_n49(_uploadFile, _downloadFile, value) {
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
function to_candid_record_n51(_uploadFile, _downloadFile, value) {
  return {
    userName: value.userName,
    serviceType: to_candid_ServiceType_n52(_uploadFile, _downloadFile, value.serviceType),
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
function to_candid_variant_n33(_uploadFile, _downloadFile, value) {
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
function to_candid_variant_n36(_uploadFile, _downloadFile, value) {
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
function to_candid_variant_n43(_uploadFile, _downloadFile, value) {
  return value == "Standard" ? {
    Standard: null
  } : value == "Express" ? {
    Express: null
  } : value;
}
function to_candid_variant_n53(_uploadFile, _downloadFile, value) {
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
const backend = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Backend,
  DeliveryType,
  ExternalBlob,
  OrderStatus,
  ServiceRequestStatus,
  ServiceType,
  createActor
}, Symbol.toStringTag, { value: "Module" }));
function useCategories() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCategories();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useCategoryBySlug(slug) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["category", "slug", slug],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCategoryBySlug(slug);
    },
    enabled: !!actor && !isFetching && !!slug,
    staleTime: 6e4
  });
}
function useProducts(options) {
  const { actor, isFetching } = useActor(createActor);
  const limit = BigInt(options == null ? void 0 : options.limit);
  const offset = BigInt((options == null ? void 0 : options.offset) ?? 0);
  return useQuery({
    queryKey: ["products", limit.toString(), offset.toString()],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listProducts({
        inStockOnly: false,
        limit,
        offset
      });
      return result.products;
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useProductsByCategory(categoryId, options) {
  const { actor, isFetching } = useActor(createActor);
  const limit = BigInt((options == null ? void 0 : options.limit) ?? 100);
  const offset = BigInt((options == null ? void 0 : options.offset) ?? 0);
  return useQuery({
    queryKey: [
      "products",
      "category",
      categoryId == null ? void 0 : categoryId.toString(),
      limit.toString()
    ],
    queryFn: async () => {
      if (!actor || categoryId === void 0) return [];
      const result = await actor.listProductsByCategory(
        categoryId,
        limit,
        offset
      );
      return result.products;
    },
    enabled: !!actor && !isFetching && categoryId !== void 0,
    staleTime: 3e4
  });
}
function useSearchProducts(term) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["products", "search", term],
    queryFn: async () => {
      if (!actor) return [];
      if (!term.trim()) {
        const result2 = await actor.listProducts({
          inStockOnly: false,
          limit: 100n,
          offset: 0n
        });
        return result2.products;
      }
      const result = await actor.searchProducts(term.trim(), 100n, 0n);
      return result.products;
    },
    enabled: !!actor && !isFetching,
    staleTime: 15e3
  });
}
function useProduct(id) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!actor) return null;
      const numId = BigInt(id);
      return actor.getProduct(numId);
    },
    enabled: !!actor && !isFetching && !!id,
    staleTime: 3e4
  });
}
function useHeroBanners() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["heroBanners"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.listHeroBanners();
        return result;
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useAdminHeroBanners() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["adminHeroBanners"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.adminListHeroBanners();
        return result;
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useFeaturedBlocks() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["featuredBlocks"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.listFeaturedBlocks();
        return result;
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useAdminFeaturedBlocks() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["adminFeaturedBlocks"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.adminListFeaturedBlocks();
        return result;
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useVideoByte() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["videoByte"],
    queryFn: async () => {
      if (!actor) return { url: "", title: "", enabled: false };
      try {
        return await actor.getVideoByte();
      } catch {
        return { url: "", title: "", enabled: false };
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useServicesAvailability() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["servicesAvailability"],
    queryFn: async () => {
      if (!actor) return { available: true, message: "" };
      try {
        return await actor.getServicesAvailability();
      } catch {
        return { available: true, message: "" };
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useSiteSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor) return { logoUrl: null, faviconUrl: null };
      const result = await actor.getSiteSettings();
      return {
        logoUrl: result.logoUrl ?? null,
        faviconUrl: result.faviconUrl ?? null
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useSaveSiteSettings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.adminUpdateSiteSettings(
        settings.logoUrl ?? null,
        settings.faviconUrl ?? null
      );
      return {
        logoUrl: result.logoUrl ?? null,
        faviconUrl: result.faviconUrl ?? null
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
    }
  });
}
const SIDEBAR_ITEMS = [
  {
    label: "Home",
    to: "/home",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 18 }),
    ocid: "sidebar-nav-home"
  },
  {
    label: "Categories",
    to: "/categories",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { size: 18 }),
    ocid: "sidebar-nav-categories"
  },
  {
    label: "Search",
    to: "/products",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
    ocid: "sidebar-nav-search",
    search: {
      q: void 0,
      category: void 0
    }
  },
  {
    label: "Services",
    to: "/services",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { size: 18 }),
    ocid: "sidebar-nav-services"
  },
  {
    label: "Cart",
    to: "/cart",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 18 }),
    ocid: "sidebar-nav-cart"
  },
  {
    label: "Profile",
    to: "/profile",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 18 }),
    ocid: "sidebar-nav-profile"
  }
];
function Layout({ children, hideSearch }) {
  const { totalItems } = useCart();
  const { data: settings } = useSiteSettings();
  const location = useLocation();
  const pathname = location.pathname;
  reactExports.useEffect(() => {
    const faviconUrl = settings == null ? void 0 : settings.faviconUrl;
    if (!faviconUrl) return;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [settings == null ? void 0 : settings.faviconUrl]);
  const logoSrc = (settings == null ? void 0 : settings.logoUrl) ?? "/assets/logo.png";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky-header", "data-ocid": "main-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/home",
            className: "flex items-center gap-2 flex-none",
            "aria-label": "AssamRoots home",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: logoSrc,
                alt: "AssamRoots",
                className: "h-10 w-auto object-contain"
              }
            )
          }
        ),
        !hideSearch && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:flex flex-1 max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Search,
            {
              size: 16,
              className: "absolute left-4 text-muted-foreground pointer-events-none z-10"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/products",
              search: { q: void 0, category: void 0 },
              className: "search-input w-full pl-12 pr-4 h-11 text-sm flex items-center text-muted-foreground cursor-pointer",
              "data-ocid": "header-search-link",
              children: "Search tea, spices, handloom, crafts…"
            }
          )
        ] }) }) }),
        hideSearch && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "nav",
          {
            className: "hidden lg:flex items-center gap-1 flex-none",
            "aria-label": "Desktop navigation",
            children: SIDEBAR_ITEMS.map((item) => {
              const isActive = item.to === "/home" ? pathname === "/" || pathname === "/home" : pathname.startsWith(item.to);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: item.to,
                  search: "search" in item ? item.search : void 0,
                  className: `flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs font-medium transition-smooth relative ${isActive ? "text-primary bg-primary/8" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`,
                  "data-ocid": item.ocid,
                  "aria-current": isActive ? "page" : void 0,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative inline-flex", children: [
                      item.icon,
                      item.to === "/cart" && totalItems > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1 leading-none",
                          "aria-label": `${totalItems} items in cart`,
                          children: totalItems > 99 ? "99+" : totalItems
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] leading-tight", children: item.label })
                  ]
                },
                item.to
              );
            })
          }
        )
      ] }),
      !hideSearch && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchBar, {}) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex max-w-7xl mx-auto w-full px-0 lg:px-8 lg:gap-6 xl:gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:flex flex-col flex-none w-56 xl:w-64 py-6 space-y-1 self-start sticky top-[73px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-1", children: "Navigation" }),
        SIDEBAR_ITEMS.map((item) => {
          const isActive = item.to === "/home" ? pathname === "/" || pathname === "/home" : pathname.startsWith(item.to);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.to,
              search: "search" in item ? item.search : void 0,
              className: `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth relative ${isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`,
              "data-ocid": `sidebar-link-${item.to.replace("/", "")}`,
              "aria-current": isActive ? "page" : void 0,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative inline-flex flex-none", children: [
                  item.icon,
                  item.to === "/cart" && totalItems > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1 leading-none",
                      "aria-label": `${totalItems} items in cart`,
                      children: totalItems > 99 ? "99+" : totalItems
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: item.label })
              ]
            },
            item.to
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-6 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground leading-relaxed", children: "Authentic Assamese products & services, delivered with care." }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "main",
        {
          className: "flex-1 min-w-0 pb-24 lg:pb-10 px-0",
          "data-ocid": "main-content",
          children
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-muted/40 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " AssamRoots. Authentic Assamese products & services."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "assamroots")}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-[11px] text-muted-foreground hover:text-foreground transition-colors",
          children: "Built with love using caffeine.ai"
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { cartCount: totalItems })
  ] });
}
export {
  CircleUser as C,
  DeliveryType as D,
  House as H,
  Layout as L,
  OrderStatus as O,
  ShoppingCart as S,
  X,
  useCart as a,
  useCategoryBySlug as b,
  useProductsByCategory as c,
  createActor as d,
  useSearchProducts as e,
  SearchBar as f,
  useServicesAvailability as g,
  ServiceType as h,
  useProducts as i,
  useHeroBanners as j,
  useFeaturedBlocks as k,
  useVideoByte as l,
  useProduct as m,
  ServiceRequestStatus as n,
  useAdminHeroBanners as o,
  useAdminFeaturedBlocks as p,
  useSiteSettings as q,
  useSaveSiteSettings as r,
  backend as s,
  useCategories as u
};
