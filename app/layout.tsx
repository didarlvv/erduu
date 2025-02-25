"use client";

import "./globals.css";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import type React from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarProvider } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Move localStorage check to useEffect to avoid hydration issues
    const token = localStorage.getItem("accessToken");
    if (!token && pathname !== "/login") {
      router.push("/login");
    }
  }, [router, pathname]);

  const isDashboardRoute = pathname?.startsWith("/dashboard");

  return (
    <html lang="en">
      <LanguageProvider>
        <body
          className={`${inter.className} min-h-screen bg-white font-sans antialiased`}
        >
          {isDashboardRoute ? (
            <SidebarProvider>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="px-4 py-6">{children}</div>
                  </main>
                </div>
              </div>
            </SidebarProvider>
          ) : (
            children
          )}
        </body>
      </LanguageProvider>
    </html>
  );
}
