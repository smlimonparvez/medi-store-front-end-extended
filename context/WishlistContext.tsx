"use client";
import {
  createContext, useContext, useState,
  useEffect, ReactNode,
} from "react";
import { Medicine } from "@/types";
import toast from "react-hot-toast";

interface WishlistContextType {
  items: Medicine[];
  addToWishlist: (medicine: Medicine) => void;
  removeFromWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;
  toggleWishlist: (medicine: Medicine) => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  addToWishlist:    () => {},
  removeFromWishlist: () => {},
  isWishlisted:     () => false,
  toggleWishlist:   () => {},
  totalItems: 0,
});

const WISHLIST_KEY = "medistore_wishlist";

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Medicine[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      localStorage.removeItem(WISHLIST_KEY);
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }, [items]);

  const addToWishlist = (medicine: Medicine) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === medicine.id)) return prev;
      toast.success("Added to wishlist!");
      return [...prev, medicine];
    });
  };

  const removeFromWishlist = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Removed from wishlist");
  };

  const isWishlisted = (id: number) => items.some((i) => i.id === id);

  const toggleWishlist = (medicine: Medicine) => {
    if (isWishlisted(medicine.id)) {
      removeFromWishlist(medicine.id);
    } else {
      addToWishlist(medicine);
    }
  };

  return (
    <WishlistContext.Provider value={{
      items, addToWishlist, removeFromWishlist,
      isWishlisted, toggleWishlist,
      totalItems: items.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
