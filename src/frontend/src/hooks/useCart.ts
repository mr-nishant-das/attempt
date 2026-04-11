import type { CartItem, CartState, Product } from "@/types";
import { useCallback, useEffect, useState } from "react";

const CART_KEY = "assam_roots_cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
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
      const idx = prev.findIndex((i) => i.product.id === product.id);
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
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: bigint, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getQuantity = useCallback(
    (productId: bigint): number => {
      return items.find((i) => i.product.id === productId)?.quantity ?? 0;
    },
    [items],
  );

  const isInCart = useCallback(
    (productId: bigint): boolean => {
      return items.some((i) => i.product.id === productId);
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
