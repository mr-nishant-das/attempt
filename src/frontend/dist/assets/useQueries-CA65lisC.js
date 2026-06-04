var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentResult, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn, _a;
import { createActor } from "./backend-Dxpf4-N4.js";
import { g as Subscribable, s as shallowEqualObjects, h as hashKey, i as getDefaultState, n as notifyManager, k as useQueryClient, r as reactExports, l as noop, m as shouldThrowError } from "./index-CstiQ4sz.js";
import { u as useActor, a as useQuery } from "./createLucideIcon-ByrRp2U0.js";
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
  const limit = BigInt((options == null ? void 0 : options.limit) ?? 50);
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
        const raw = await actor.listHeroBanners();
        return raw.map((b) => ({
          ...b,
          durationSeconds: b.durationSeconds ?? 5n
        }));
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
        const raw = await actor.adminListHeroBanners();
        return raw.map((b) => ({
          ...b,
          durationSeconds: b.durationSeconds ?? 5n
        }));
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
function useBestSellers(limit = 6) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["bestSellers", limit],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listBestSellers(BigInt(limit));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useNewArrivals(limit = 6) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["newArrivals", limit],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listNewArrivals(BigInt(limit));
      } catch {
        return [];
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
        faviconUrl: result.faviconUrl ?? null,
        heroTagline: result.heroTagline ?? null,
        heroSubtitle: result.heroSubtitle ?? null,
        howitworksSteps: result.howitworksSteps ?? null
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
        localStorage.getItem("adminSessionToken") ?? "",
        settings.logoUrl ?? null,
        settings.faviconUrl ?? null
      );
      return {
        logoUrl: result.logoUrl ?? null,
        faviconUrl: result.faviconUrl ?? null,
        heroTagline: null,
        heroSubtitle: null,
        howitworksSteps: null
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
    }
  });
}
function useFooterSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["footerSettings"],
    queryFn: async () => {
      if (!actor)
        return {
          tagline: "",
          copyright: "",
          aboutContent: "",
          socialLinks: [],
          policyContent: ""
        };
      return actor.getFooterSettings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useReviews() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviews();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useVendorMyProducts(sessionToken) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["vendorMyProducts", sessionToken],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.vendorGetMyProducts(sessionToken);
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    staleTime: 3e4
  });
}
function useVendorSubmitProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionToken,
      input
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.vendorSubmitProduct(sessionToken, input);
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorMyProducts"] });
    }
  });
}
function useVendorUpdateProductQuantity() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionToken,
      productId,
      newQuantityKg
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.vendorUpdateProductQuantity(
        sessionToken,
        productId,
        newQuantityKg
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorMyProducts"] });
    }
  });
}
export {
  useCategoryBySlug as a,
  useProductsByCategory as b,
  useProduct as c,
  useServicesAvailability as d,
  useFooterSettings as e,
  useProducts as f,
  useReviews as g,
  useSearchProducts as h,
  useSiteSettings as i,
  useBestSellers as j,
  useNewArrivals as k,
  useHeroBanners as l,
  useFeaturedBlocks as m,
  useVideoByte as n,
  useVendorMyProducts as o,
  useVendorSubmitProduct as p,
  useVendorUpdateProductQuantity as q,
  useAdminHeroBanners as r,
  useAdminFeaturedBlocks as s,
  useSaveSiteSettings as t,
  useCategories as u
};
