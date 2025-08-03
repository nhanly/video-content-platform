import type React from "react";
import { Inter } from "next/font/google";
import Header from "@/app/widgets/header/ui/Header";
import Sidebar from "@/app/widgets/sidebar/ui/Sidebar";
import { ErrorBoundary } from "@/app/shared/ui/components/ErrorBoundary";
import "@/app/styles/globals.css";
import { Providers } from "@/app/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ErrorBoundary>
            <div className="flex flex-col h-screen">
              <Header />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">{children}</main>
              </div>
            </div>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
