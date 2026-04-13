import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type OrderId = bigint;
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
export interface Category {
    id: CategoryId;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    subCategories: Array<string>;
}
export interface ProductListResult {
    total: bigint;
    products: Array<Product>;
}
export interface CartItem {
    productId: bigint;
    addedAt: bigint;
    quantity: bigint;
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
    userId: Principal;
    createdAt: bigint;
    estimatedDelivery?: bigint;
    updatedAt: bigint;
    totalAmount: bigint;
    items: Array<OrderItem>;
}
export interface ProductFilter {
    categoryId?: CategoryId;
    inStockOnly: boolean;
    offset: bigint;
    maxPrice?: bigint;
    limit: bigint;
    searchTerm?: string;
    minPrice?: bigint;
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
export type UserId = Principal;
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
export interface CreateOrderInput {
    deliveryAddress: DeliveryAddress;
    items: Array<{
        productId: bigint;
        quantity: bigint;
    }>;
}
export type CategoryId = bigint;
export type ProductId = bigint;
export interface DeliveryAddress {
    city: string;
    name: string;
    line1: string;
    line2: string;
    state: string;
    phone: string;
    pincode: string;
}
export interface CartPublic {
    userId: Principal;
    updatedAt: bigint;
    items: Array<CartItem>;
}
export interface UserProfileInput {
    name: string;
    email: string;
    phone: string;
}
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
export interface ShipmentUpdate {
    status: OrderStatus;
    message: string;
    timestamp: bigint;
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
    adminAddProduct(input: ProductInput): Promise<Product>;
    adminDeleteProduct(id: ProductId): Promise<boolean>;
    adminDeleteServiceRequest(id: bigint): Promise<boolean>;
    adminGetAllOrders(limit: bigint, offset: bigint): Promise<Array<OrderPublic>>;
    adminGetServiceRequests(): Promise<Array<ServiceRequestPublic>>;
    adminSetDiscount(id: ProductId, discountPercent: bigint): Promise<Product | null>;
    adminSetUserAdmin(targetUser: Principal, adminStatus: boolean): Promise<boolean>;
    adminUpdateOrderStatus(orderId: OrderId, newStatus: OrderStatus, message: string): Promise<OrderPublic | null>;
    adminUpdateProduct(id: ProductId, input: ProductInput): Promise<Product | null>;
    adminUpdateServiceRequestStatus(id: bigint, status: ServiceRequestStatus): Promise<ServiceRequestPublic | null>;
    adminUpdateStock(id: ProductId, newStock: bigint): Promise<Product | null>;
    claimAdminIfFirst(): Promise<boolean>;
    clearMyCart(): Promise<void>;
    createOrder(input: CreateOrderInput): Promise<OrderPublic>;
    getCategory(id: CategoryId): Promise<Category | null>;
    getCategoryBySlug(slug: string): Promise<Category | null>;
    getMyCart(): Promise<CartPublic>;
    getMyOrders(): Promise<Array<OrderPublic>>;
    getMyProfile(): Promise<UserProfilePublic>;
    getOrder(orderId: OrderId): Promise<OrderPublic | null>;
    getProduct(id: ProductId): Promise<Product | null>;
    isCurrentUserAdmin(): Promise<boolean>;
    listCategories(): Promise<Array<Category>>;
    listProducts(filter: ProductFilter): Promise<ProductListResult>;
    listProductsByCategory(categoryId: CategoryId, limit: bigint, offset: bigint): Promise<ProductListResult>;
    removeFromCart(productId: bigint): Promise<CartPublic>;
    searchProducts(term: string, limit: bigint, offset: bigint): Promise<ProductListResult>;
    submitServiceRequest(input: CreateServiceRequestInput): Promise<ServiceRequestPublic>;
    updateCartItem(productId: bigint, quantity: bigint): Promise<CartPublic>;
    updateMyProfile(input: UserProfileInput): Promise<UserProfilePublic>;
}
