import type { CartItem, CartState, Product } from "@/types";
import { useCallback, useEffect, useState } from "react";

const CART_KEY = "assam_roots_cart";

// ─── BigInt-safe serialization ────────────────────────────────────────────────
// JSON.stringify cannot handle bigint natively — we convert every bigint to a
// tagged string  "<digits>n" on save, and parse it back on load.

function replacer(_key: string, value: unknown): unknown {
  if (typeof value === "bigint") return `${value.toString()}n`;
  return value;
}

function reviver(_key: string, value: unknown): unknown {
  if (typeof value === "string" && /^-?\d+n$/.test(value)) {
    return BigInt(value.slice(0, -1));
  }
  return value;
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw, reviver) as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items, replacer));
  } catch {
    // ignore quota errors silently
  }
}

// ─── Hydrate a backend cart item into a frontend CartItem ─────────────────────
// The backend CartPublic.items only contain {productId, quantity, addedAt}.
// Use this to look up a Product by its numeric/bigint id from the catalog.
export function hydrateBackendCartItems(
  backendItems: Array<{ productId: bigint; quantity: bigint | number }>,
  catalog: Product[],
): CartItem[] {
  const result: CartItem[] = [];
  for (const item of backendItems) {
    // Explicit conversion: backend productId is bigint, catalog product.id is bigint
    const productIdBigInt = BigInt(item.productId);
    const product = catalog.find((p) => BigInt(p.id) === productIdBigInt);
    if (product) {
      result.push({ product, quantity: Number(item.quantity) });
    }
  }
  return result;
}

function computeState(items: CartItem[]): CartState {
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => {
    const price = Number(i.product.price);
    const discount = Number(i.product.discountPercent);
    const final = price - (price * discount) / 100;
    return s + final * i.quantity;
  }, 0);
  return { items, totalItems, totalPrice };
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => BigInt(i.product.id) === BigInt(product.id),
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: bigint) => {
    setItems((prev) =>
      prev.filter((i) => BigInt(i.product.id) !== BigInt(productId)),
    );
  }, []);

  const updateQuantity = useCallback((productId: bigint, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) =>
        prev.filter((i) => BigInt(i.product.id) !== BigInt(productId)),
      );
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        BigInt(i.product.id) === BigInt(productId) ? { ...i, quantity } : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getQuantity = useCallback(
    (productId: bigint): number => {
      return (
        items.find((i) => BigInt(i.product.id) === BigInt(productId))
          ?.quantity ?? 0
      );
    },
    [items],
  );

  const isInCart = useCallback(
    (productId: bigint): boolean => {
      return items.some((i) => BigInt(i.product.id) === BigInt(productId));
    },
    [items],
  );

  return {
    ...computeState(items),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getQuantity,
    isInCart,
  };
}
