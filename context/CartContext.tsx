"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "@/types";
import toast from "react-hot-toast";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  items: [], totalItems: 0, totalPrice: 0,
  addToCart: () => {}, removeFromCart: () => {},
  updateQuantity: () => {}, clearCart: () => {},
});

const CART_KEY = "medistore_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch { localStorage.removeItem(CART_KEY); }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        if (existing.quantity >= existing.stock) {
          toast.error(`Only ${existing.stock} units available!`);
          return prev;
        }
        toast.success("Quantity updated!");
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      if (newItem.stock === 0) {
        toast.error("This item is out of stock.");
        return prev;
      }
      toast.success("Added to cart!");
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Item removed");
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item && qty > item.stock) {
        toast.error(`Only ${item.stock} units available!`);
        return prev;
      }
      return prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity,
      clearCart, totalItems, totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
