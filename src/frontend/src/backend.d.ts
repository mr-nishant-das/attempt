import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: ProductId;
    subCategory: string;
    title: string;
    imageUrls: Array<string>;
    createdAt: bigint;
    tags: Array<string>;
    description: string;
    discountPercent: bigint;
    isActive: boolean;
    updatedAt: bigint;
    stock: bigint;
    category: CategoryId;
    brand: string;
    rating: bigint;
    price: bigint;
    reviewCount: bigint;
}
export interface SubCategory {
    id: SubCategoryId;
    name: string;
    imageUrl: string;
}
export interface Address {
    city: string;
    name: string;
    line1: string;
    line2: string;
    state: string;
    isDefault: boolean;
    phone: string;
    pincode: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type SubCategoryId = bigint;
export interface OrderItem {
    title: string;
    discountPercent: bigint;
    productId: bigint;
    imageUrl: string;
    quantity: bigint;
    price: bigint;
}
export interface OrderPublic {
    id: OrderId;
    status: OrderStatus;
    deliveryAddress: DeliveryAddress;
    shipmentUpdates: Array<ShipmentUpdate>;
    paymentMethod: string;
    userId: Principal;
    createdAt: bigint;
    estimatedDelivery?: bigint;
    deliveryCost: bigint;
    deliveryType: DeliveryType;
    updatedAt: bigint;
    totalAmount: bigint;
    items: Array<OrderItem>;
}
export interface CreateServiceRequestInput {
    userName: string;
    serviceType: ServiceType;
    recipientPhone?: string;
    description: string;
    userPhone: string;
    isRequestForSelf: boolean;
    preferredDate: string;
    preferredTime: string;
    recipientAddress?: string;
    recipientName?: string;
}
export interface ServiceRequestPublic {
    id: bigint;
    status: ServiceRequestStatus;
    userName: string;
    serviceType: ServiceType;
    userId: string;
    recipientPhone?: string;
    submittedAt: bigint;
    description: string;
    userPhone: string;
    lastUpdatedAt: bigint;
    isRequestForSelf: boolean;
    preferredDate: string;
    preferredTime: string;
    recipientAddress?: string;
    recipientName?: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CreateOrderInput {
    deliveryAddress: DeliveryAddress;
    paymentMethod: string;
    deliveryCost: bigint;
    deliveryType: DeliveryType;
    items: Array<{
        productId: bigint;
        quantity: bigint;
    }>;
}
export interface CartPublic {
    userId: Principal;
    updatedAt: bigint;
    items: Array<CartItem>;
}
export interface DeliveryAddress {
    street: string;
    city: string;
    name: string;
    district: string;
    state: string;
    landmark: string;
    phone: string;
    pincode: string;
    locality: string;
    houseNo: string;
}
export type HeroBannerId = bigint;
export type FeaturedBlockId = bigint;
export interface Category {
    id: CategoryId;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    subCategories: Array<SubCategory>;
}
export interface ProductInput {
    subCategory: string;
    title: string;
    imageUrls: Array<string>;
    tags: Array<string>;
    description: string;
    discountPercent: bigint;
    stock: bigint;
    category: CategoryId;
    brand: string;
    rating: bigint;
    price: bigint;
    reviewCount: bigint;
}
export interface ProductListResult {
    total: bigint;
    products: Array<Product>;
}
export interface FeaturedBlock {
    id: FeaturedBlockId;
    title: string;
    content: string;
    thumbnailUrl: string;
    order: bigint;
    createdAt: bigint;
    isActive: boolean;
    contentImages: Array<string>;
}
export interface FeaturedBlockInput {
    title: string;
    content: string;
    thumbnailUrl: string;
    order: bigint;
    isActive: boolean;
    contentImages: Array<string>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface UserProfilePublic {
    id: UserId;
    name: string;
    createdAt: bigint;
    email: string;
    updatedAt: bigint;
    addresses: Array<Address>;
    isAdmin: boolean;
    phone: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface ProductFilter {
    categoryId?: CategoryId;
    inStockOnly: boolean;
    offset: bigint;
    maxPrice?: bigint;
    limit: bigint;
    searchTerm?: string;
    minPrice?: bigint;
}
export interface HeroBannerInput {
    title: string;
    order: bigint;
    isActive: boolean;
    imageUrl: string;
    ctaSlug: string;
    ctaText: string;
    subtitle: string;
}
export type CategoryId = bigint;
export type ProductId = bigint;
export interface HeroBanner {
    id: HeroBannerId;
    title: string;
    order: bigint;
    isActive: boolean;
    imageUrl: string;
    ctaSlug: string;
    ctaText: string;
    subtitle: string;
}
export interface CartItem {
    productId: bigint;
    addedAt: bigint;
    quantity: bigint;
}
export interface UserProfileInput {
    name: string;
    email: string;
    phone: string;
}
export type OrderId = bigint;
export interface ShipmentUpdate {
    status: OrderStatus;
    message: string;
    timestamp: bigint;
}
export enum DeliveryType {
    Standard = "Standard",
    Express = "Express"
}
export enum OrderStatus {
    Delivered = "Delivered",
    Confirmed = "Confirmed",
    Cancelled = "Cancelled",
    Processing = "Processing",
    Shipped = "Shipped",
    OutForDelivery = "OutForDelivery"
}
export enum ServiceRequestStatus {
    New = "New",
    Contacted = "Contacted",
    Cancelled = "Cancelled",
    Completed = "Completed"
}
export enum ServiceType {
    Ambulance = "Ambulance",
    FoodDelivery = "FoodDelivery",
    Taxi = "Taxi",
    SchoolAdmissions = "SchoolAdmissions",
    Medicines = "Medicines",
    Gifting = "Gifting",
    FuneralServices = "FuneralServices",
    Tourism = "Tourism",
    Doctors = "Doctors",
    VideoConferencing = "VideoConferencing",
    EventManagement = "EventManagement",
    WeddingsAnniversaries = "WeddingsAnniversaries",
    Other = "Other"
}
export interface backendInterface {
    addMyAddress(address: Address): Promise<UserProfilePublic>;
    addToCart(productId: bigint, quantity: bigint): Promise<CartPublic>;
    adminAddCategory(name: string, slug: string, description: string, imageUrl: string): Promise<{
        __kind__: "ok";
        ok: Category;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminAddFeaturedBlock(input: FeaturedBlockInput): Promise<FeaturedBlock>;
    adminAddHeroBanner(input: HeroBannerInput): Promise<HeroBanner>;
    adminAddProduct(input: ProductInput): Promise<Product>;
    adminAddSubCategory(categoryId: CategoryId, name: string, imageUrl: string): Promise<{
        __kind__: "ok";
        ok: Category;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminDeleteCategory(id: CategoryId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminDeleteFeaturedBlock(id: FeaturedBlockId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminDeleteHeroBanner(id: HeroBannerId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminDeleteProduct(id: ProductId): Promise<boolean>;
    adminDeleteServiceRequest(id: bigint): Promise<boolean>;
    adminDeleteSubCategory(categoryId: CategoryId, subCategoryId: SubCategoryId): Promise<{
        __kind__: "ok";
        ok: Category;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAllOrders(limit: bigint, offset: bigint): Promise<Array<OrderPublic>>;
    adminGetCategories(): Promise<Array<Category>>;
    adminGetServiceRequests(): Promise<Array<ServiceRequestPublic>>;
    adminListFeaturedBlocks(): Promise<Array<FeaturedBlock>>;
    adminListHeroBanners(): Promise<Array<HeroBanner>>;
    adminLogin(userId: string, passcode: string): Promise<string | null>;
    adminLogout(token: string): Promise<void>;
    adminRegisterImageHash(hash: string): Promise<string>;
    adminReorderHeroBanner(id: HeroBannerId, newOrder: bigint): Promise<{
        __kind__: "ok";
        ok: HeroBanner;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSetDiscount(id: ProductId, discountPercent: bigint): Promise<Product | null>;
    adminSetUserAdmin(targetUser: Principal, adminStatus: boolean): Promise<boolean>;
    adminUpdateCategory(id: CategoryId, name: string, slug: string, description: string, imageUrl: string): Promise<{
        __kind__: "ok";
        ok: Category;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateFeaturedBlock(id: FeaturedBlockId, input: FeaturedBlockInput): Promise<{
        __kind__: "ok";
        ok: FeaturedBlock;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateHeroBanner(id: HeroBannerId, input: HeroBannerInput): Promise<{
        __kind__: "ok";
        ok: HeroBanner;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateOrderStatus(orderId: OrderId, newStatus: OrderStatus, message: string): Promise<OrderPublic | null>;
    adminUpdateProduct(id: ProductId, input: ProductInput): Promise<Product | null>;
    adminUpdateServiceRequestStatus(id: bigint, status: ServiceRequestStatus): Promise<ServiceRequestPublic | null>;
    adminUpdateServicesAvailability(available: boolean, message: string): Promise<void>;
    adminUpdateSiteSettings(logoUrl: string | null, faviconUrl: string | null): Promise<{
        logoUrl?: string;
        faviconUrl?: string;
    }>;
    adminUpdateStock(id: ProductId, newStock: bigint): Promise<Product | null>;
    adminUpdateSubCategory(categoryId: CategoryId, subCategoryId: SubCategoryId, name: string, imageUrl: string): Promise<{
        __kind__: "ok";
        ok: Category;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateVideoByte(url: string, enabled: boolean, title: string): Promise<void>;
    claimAdminIfFirst(): Promise<boolean>;
    clearMyCart(): Promise<void>;
    createOrder(input: CreateOrderInput): Promise<OrderPublic>;
    createRazorpayOrder(amount: bigint, receipt: string): Promise<{
        __kind__: "ok";
        ok: {
            orderId: string;
            currency: string;
            amount: bigint;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCategory(id: CategoryId): Promise<Category | null>;
    getCategoryBySlug(slug: string): Promise<Category | null>;
    getFeaturedBlock(id: FeaturedBlockId): Promise<FeaturedBlock | null>;
    getHeroBanner(id: HeroBannerId): Promise<HeroBanner | null>;
    getMyCart(): Promise<CartPublic>;
    getMyOrders(): Promise<Array<OrderPublic>>;
    getMyProfile(): Promise<UserProfilePublic>;
    getOrder(orderId: OrderId): Promise<OrderPublic | null>;
    getProduct(id: ProductId): Promise<Product | null>;
    getServicesAvailability(): Promise<{
        available: boolean;
        message: string;
    }>;
    getSiteSettings(): Promise<{
        logoUrl?: string;
        faviconUrl?: string;
    }>;
    getVideoByte(): Promise<{
        url: string;
        title: string;
        enabled: boolean;
    }>;
    isAdminSession(token: string): Promise<boolean>;
    isCurrentUserAdmin(): Promise<boolean>;
    listCategories(): Promise<Array<Category>>;
    listFeaturedBlocks(): Promise<Array<FeaturedBlock>>;
    listHeroBanners(): Promise<Array<HeroBanner>>;
    listProducts(filter: ProductFilter): Promise<ProductListResult>;
    listProductsByCategory(categoryId: CategoryId, limit: bigint, offset: bigint): Promise<ProductListResult>;
    razorpayTransform(input: TransformationInput): Promise<TransformationOutput>;
    removeFromCart(productId: bigint): Promise<CartPublic>;
    searchProducts(term: string, limit: bigint, offset: bigint): Promise<ProductListResult>;
    submitServiceRequest(input: CreateServiceRequestInput): Promise<ServiceRequestPublic>;
    updateCartItem(productId: bigint, quantity: bigint): Promise<CartPublic>;
    updateMyProfile(input: UserProfileInput): Promise<UserProfilePublic>;
    verifyRazorpayPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
