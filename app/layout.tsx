import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider }   from "next-themes";
import { AuthProvider }     from "@/context/AuthContext";
import { CartProvider }     from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster }          from "react-hot-toast";

export const metadata: Metadata = {
  title: "MediStore — Your Trusted Online Medicine Shop",
  description: "Buy OTC medicines online with fast delivery and verified sellers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: { fontFamily: "var(--font-dm)", borderRadius: "12px" },
                    success: { iconTheme: { primary: "#0d9488", secondary: "#fff" } },
                  }}
                />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
