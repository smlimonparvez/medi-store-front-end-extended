import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "MediStore — Your Trusted Online Medicine Shop",
  description: "Buy OTC medicines online with fast delivery and verified sellers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: { fontFamily: "var(--font-dm)", borderRadius: "12px" },
                success: { iconTheme: { primary: "#0d9488", secondary: "#fff" } },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
