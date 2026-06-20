import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  return `৳${Number(price).toFixed(2)}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const STATUS_COLORS: Record<OrderStatus, string> = {
  placed:     "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  placed:     "Placed",
  processing: "Processing",
  shipped:    "Shipped",
  delivered:  "Delivered",
  cancelled:  "Cancelled",
};

export function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as any;
    return axiosErr.response?.data?.message || "Something went wrong.";
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong.";
}
