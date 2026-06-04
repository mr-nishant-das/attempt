// ─── Backend Query Hooks ──────────────────────────────────────────────────────
// All backend data access goes through these hooks.
// Pages import from here instead of calling actor directly.

import {
  type VendorProductInput,
  type VendorProductView,
  createActor,
} from "@/backend";
import type { Category, CustomerReview, Product } from "@/backend";
import type { HowItWorksStep, SiteSettings } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Hero Banner types ────────────────────────────────────────────────────────
export interface HeroBanner {
  id: bigint;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaSlug: string;
  order: bigint;
  isActive: boolean;
  durationSeconds: bigint;
}

export interface HeroBannerInput {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaSlug: string;
  order: bigint;
  isActive: boolean;
  durationSeconds: bigint;
}

// ─── Featured Block types ─────────────────────────────────────────────────────
export interface FeaturedBlock {
  id: bigint;
  title: string;
  thumbnailUrl: string;
  content: string;
  contentImages: string[];
  order: bigint;
  isActive: boolean;
  createdAt: bigint;
}

export interface FeaturedBlockInput {
  title: string;
  thumbnailUrl: string;
  content: string;
  contentImages: string[];
  order: bigint;
  isActive: boolean;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useCategories() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCategories();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useCategoryBySlug(slug: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Category | null>({
    queryKey: ["category", "slug", slug],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCategoryBySlug(slug);
    },
    enabled: !!actor && !isFetching && !!slug,
    staleTime: 60_000,
  });
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function useProducts(options?: { limit?: number; offset?: number }) {
  const { actor, isFetching } = useActor(createActor);
  const limit = BigInt(options?.limit ?? 50);
  const offset = BigInt(options?.offset ?? 0);
  return useQuery<Product[]>({
    queryKey: ["products", limit.toString(), offset.toString()],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listProducts({
        inStockOnly: false,
        limit,
        offset,
      });
      return result.products;
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useProductsByCategory(
  categoryId: bigint | undefined,
  options?: { limit?: number; offset?: number },
) {
  const { actor, isFetching } = useActor(createActor);
  const limit = BigInt(options?.limit ?? 100);
  const offset = BigInt(options?.offset ?? 0);
  return useQuery<Product[]>({
    queryKey: [
      "products",
      "category",
      categoryId?.toString(),
      limit.toString(),
    ],
    queryFn: async () => {
      if (!actor || categoryId === undefined) return [];
      const result = await actor.listProductsByCategory(
        categoryId,
        limit,
        offset,
      );
      return result.products;
    },
    enabled: !!actor && !isFetching && categoryId !== undefined,
    staleTime: 30_000,
  });
}

export function useSearchProducts(term: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: ["products", "search", term],
    queryFn: async () => {
      if (!actor) return [];
      if (!term.trim()) {
        const result = await actor.listProducts({
          inStockOnly: false,
          limit: 100n,
          offset: 0n,
        });
        return result.products;
      }
      const result = await actor.searchProducts(term.trim(), 100n, 0n);
      return result.products;
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useProduct(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product | null>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!actor) return null;
      const numId = BigInt(id);
      return actor.getProduct(numId);
    },
    enabled: !!actor && !isFetching && !!id,
    staleTime: 30_000,
  });
}

// ─── Hero Banners ─────────────────────────────────────────────────────────────

export function useHeroBanners() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<HeroBanner[]>({
    queryKey: ["heroBanners"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        type ActorExt = { listHeroBanners: () => Promise<HeroBanner[]> };
        const raw = await (actor as unknown as ActorExt).listHeroBanners();
        return raw.map((b) => ({
          ...b,
          durationSeconds: b.durationSeconds ?? 5n,
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useAdminHeroBanners() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<HeroBanner[]>({
    queryKey: ["adminHeroBanners"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        type ActorExt = { adminListHeroBanners: () => Promise<HeroBanner[]> };
        const raw = await (actor as unknown as ActorExt).adminListHeroBanners();
        return raw.map((b) => ({
          ...b,
          durationSeconds: b.durationSeconds ?? 5n,
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── Featured Blocks ──────────────────────────────────────────────────────────

export function useFeaturedBlocks() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<FeaturedBlock[]>({
    queryKey: ["featuredBlocks"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        type ActorExt = { listFeaturedBlocks: () => Promise<FeaturedBlock[]> };
        const result = await (
          actor as unknown as ActorExt
        ).listFeaturedBlocks();
        return result;
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useAdminFeaturedBlocks() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<FeaturedBlock[]>({
    queryKey: ["adminFeaturedBlocks"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        type ActorExt = {
          adminListFeaturedBlocks: () => Promise<FeaturedBlock[]>;
        };
        const result = await (
          actor as unknown as ActorExt
        ).adminListFeaturedBlocks();
        return result;
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── Video Byte ───────────────────────────────────────────────────────────────

export interface VideoByte {
  url: string;
  title: string;
  enabled: boolean;
}

export function useVideoByte() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<VideoByte>({
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
    staleTime: 60_000,
  });
}

// ─── Services Availability ────────────────────────────────────────────────────

export interface ServicesAvailability {
  available: boolean;
  message: string;
}

export function useServicesAvailability() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ServicesAvailability>({
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
    staleTime: 60_000,
  });
}

// ─── Best Sellers ────────────────────────────────────────────────────────────

export function useBestSellers(limit = 6) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
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
    staleTime: 60_000,
  });
}

// ─── New Arrivals ─────────────────────────────────────────────────────────────

export function useNewArrivals(limit = 6) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
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
    staleTime: 60_000,
  });
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export function useSiteSettings() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SiteSettings>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor) return { logoUrl: null, faviconUrl: null };
      const result = await actor.getSiteSettings();
      return {
        logoUrl: result.logoUrl ?? null,
        faviconUrl: result.faviconUrl ?? null,
        heroTagline: result.heroTagline ?? null,
        heroSubtitle: result.heroSubtitle ?? null,
        howitworksSteps: (result.howitworksSteps as HowItWorksStep[]) ?? null,
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useSaveSiteSettings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.adminUpdateSiteSettings(
        localStorage.getItem("adminSessionToken") ?? "",
        settings.logoUrl ?? null,
        settings.faviconUrl ?? null,
      );
      return {
        logoUrl: result.logoUrl ?? null,
        faviconUrl: result.faviconUrl ?? null,
        heroTagline: null,
        heroSubtitle: null,
        howitworksSteps: null,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
    },
  });
}

// ─── Footer Settings ──────────────────────────────────────────────────────────

export function useFooterSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<{
    tagline: string;
    copyright: string;
    aboutContent: string;
    socialLinks: Array<{ platform: string; url: string; enabled: boolean }>;
    policyContent: string;
  }>({
    queryKey: ["footerSettings"],
    queryFn: async () => {
      if (!actor)
        return {
          tagline: "",
          copyright: "",
          aboutContent: "",
          socialLinks: [],
          policyContent: "",
        };
      return actor.getFooterSettings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Customer Reviews ─────────────────────────────────────────────────────────

export function useReviews() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CustomerReview[]>({
    queryKey: ["reviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviews();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Policy Content ───────────────────────────────────────────────────────────

export function useUpdatePolicyContent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.adminUpdatePolicyContent(
        localStorage.getItem("adminSessionToken") ?? "",
        content,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footerSettings"] });
    },
  });
}

// ─── Vendor Products ────────────────────────────────────────────────────────

export function useVendorMyProducts(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<VendorProductView[]>({
    queryKey: ["vendorMyProducts", sessionToken],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.vendorGetMyProducts(sessionToken);
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    staleTime: 30_000,
  });
}

export function useVendorSubmitProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionToken,
      input,
    }: {
      sessionToken: string;
      input: VendorProductInput;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.vendorSubmitProduct(sessionToken, input);
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorMyProducts"] });
    },
  });
}

// ─── Vendor Update Product Quantity

export function useVendorUpdateProductQuantity() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionToken,
      productId,
      newQuantityKg,
    }: {
      sessionToken: string;
      productId: bigint;
      newQuantityKg: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.vendorUpdateProductQuantity(
        sessionToken,
        productId,
        newQuantityKg,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorMyProducts"] });
    },
  });
}

// ─── Admin Vendor Products ───────────────────────────────────────────────────

export function useAdminVendorProducts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<VendorProductView[]>({
    queryKey: ["adminVendorProducts"],
    queryFn: async () => {
      if (!actor) return [];
      const adminToken = localStorage.getItem("adminSessionToken") ?? "";
      return actor.adminListVendorProducts(adminToken);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAdminVendorProductsByVendor(vendorId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<VendorProductView[]>({
    queryKey: ["adminVendorProductsByVendor", vendorId],
    queryFn: async () => {
      if (!actor) return [];
      const adminToken = localStorage.getItem("adminSessionToken") ?? "";
      const { Principal: P } = await import("@icp-sdk/core/principal");
      return actor.adminListVendorProductsByVendor(
        adminToken,
        P.fromText(vendorId),
      );
    },
    enabled: !!actor && !isFetching && !!vendorId,
    staleTime: 30_000,
  });
}

export function useAdminApproveVendorProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      taxPercent,
    }: {
      productId: bigint;
      taxPercent: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const adminToken = localStorage.getItem("adminSessionToken") ?? "";
      const result = await actor.adminApproveVendorProduct(
        adminToken,
        productId,
        taxPercent,
        null,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminVendorProducts"] });
      queryClient.invalidateQueries({
        queryKey: ["adminVendorProductsByVendor"],
      });
      queryClient.invalidateQueries({ queryKey: ["vendorMyProducts"] });
    },
  });
}

export function useAdminRejectVendorProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      reason,
    }: {
      productId: bigint;
      reason: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const adminToken = localStorage.getItem("adminSessionToken") ?? "";
      const result = await actor.adminRejectVendorProduct(
        adminToken,
        productId,
        reason,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminVendorProducts"] });
      queryClient.invalidateQueries({
        queryKey: ["adminVendorProductsByVendor"],
      });
      queryClient.invalidateQueries({ queryKey: ["vendorMyProducts"] });
    },
  });
}
