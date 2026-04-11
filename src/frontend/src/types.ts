// ─── Domain Types ──────────────────────────────────────────────────────────

export type CategoryId = bigint;
export type ProductId = bigint;

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  subCategories: string[];
}

export interface Product {
  id: ProductId;
  title: string;
  description: string;
  price: bigint;
  discountPercent: bigint;
  imageUrls: string[];
  category: CategoryId;
  subCategory: string;
  rating: bigint;
  reviewCount: bigint;
  stock: bigint;
  brand: string;
  tags: string[];
  isActive: boolean;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface ProductFilter {
  categoryId: CategoryId | null;
  searchTerm: string | null;
  minPrice: bigint | null;
  maxPrice: bigint | null;
  inStockOnly: boolean;
  limit: bigint;
  offset: bigint;
}

export interface ProductListResult {
  products: Product[];
  total: bigint;
}

// ─── Cart Types ────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// ─── Order Types ───────────────────────────────────────────────────────────

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  placedAt: number;
  estimatedDelivery: string;
  shippingAddress: Address;
}

// ─── User / Address Types ──────────────────────────────────────────────────

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface User {
  principal: string;
  displayName?: string;
  email?: string;
  savedAddresses: Address[];
  orders: Order[];
}

// ─── UI Helpers ────────────────────────────────────────────────────────────

/** Convert backend bigint price (paise) to display rupees */
export function formatPrice(paise: bigint): string {
  return `₹${(Number(paise) / 100).toLocaleString("en-IN")}`;
}

/** Convert backend bigint rating (0–50) to star float (0–5) */
export function ratingToFloat(rating: bigint): number {
  return Number(rating) / 10;
}

/** Discounted price in paise */
export function discountedPrice(
  price: bigint,
  discountPercent: bigint,
): bigint {
  return price - (price * discountPercent) / 100n;
}
