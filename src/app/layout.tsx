import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";
import ReduxProvider from "@/components/providers/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Finance Manager",
  description: "Aplikasi manajemen keuangan pribadi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <div className="min-h-screen bg-gray-100">
            <div className="md:flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 flex flex-col h-screen overflow-hidden px-2 pt-2">
                {children}
              </main>
              <Toaster richColors position="top-right" />
            </div>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
