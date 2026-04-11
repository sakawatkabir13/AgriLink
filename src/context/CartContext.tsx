import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, isWholesale: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'agrilink-cart';

const loadStoredCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedItems = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedItems) {
      return [];
    }

    const parsedItems = JSON.parse(storedItems);
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadStoredCartItems);

  const syncCartFromStorage = useCallback(() => {
    setItems(loadStoredCartItems());
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const handlePageShow = () => {
      syncCartFromStorage();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncCartFromStorage();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('focus', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('focus', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncCartFromStorage]);

  const addToCart = useCallback((product: Product, quantity: number, isWholesale: boolean) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, isWholesale }
            : item
        );
      }
      return [...prev, { product, quantity, isWholesale }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = item.isWholesale
      ? item.product.wholesalePrice
      : item.product.retailPrice;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
