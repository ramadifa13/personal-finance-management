"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings, Menu, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/budget", label: "Budget", icon: Banknote },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className="md:hidden flex justify-between items-center px-4 py-3 bg-[color:var(--blue-dark)] border-b shadow-sm">
        <h1 className="text-lg font-bold text-white animate-fade-in">
          💰 FinanceApp
        </h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-[color:var(--blue-light)]">
            <SheetTitle className="sr-only">Sidebar Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Main navigation links to navigate between dashboard and settings
            </SheetDescription>
            <SidebarContent pathname={pathname} mobile />
          </SheetContent>
        </Sheet>
      </div>
      <aside
        className={cn(
          "hidden md:flex flex-col bg-[color:var(--blue-light)] border-r transition-all duration-300 ease-in-out shadow-md",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            {!collapsed && (
              <>
                <h1 className="text-xl font-bold text-gray-800 animate-fade-in">
                  💰
                </h1>
                <span className="text-lg font-bold text-gray-800">
                  FinanceApp
                </span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto transition-transform duration-200 hover:rotate-6"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md transition-all duration-200 ease-in-out hover:bg-gray-100",
                  pathname === item.href && "bg-gray-200 font-semibold",
                  collapsed ? "justify-center px-2 py-2" : "gap-3 px-4 py-2"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-transform duration-200",
                    !collapsed && "group-hover:scale-110"
                  )}
                />
                {!collapsed && (
                  <span className="truncate text-gray-800 group-hover:text-black transition-colors">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function SidebarContent({
  pathname,
  mobile = false,
}: {
  pathname: string;
  mobile?: boolean;
}) {
  return (
    <div className="p-4 animate-slide-in">
      <h1 className="text-xl font-bold text-gray-800 mb-4">💰 FinanceApp</h1>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          const link = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-all duration-200 ease-in-out",
                pathname === item.href ? "bg-gray-200 font-semibold" : ""
              )}
            >
              <Icon className="w-5 h-5 text-gray-700 group-hover:text-black transition" />
              <span className="text-gray-800">{item.label}</span>
            </Link>
          );

          return mobile ? (
            <SheetClose asChild key={item.href}>
              {link}
            </SheetClose>
          ) : (
            link
          );
        })}
      </nav>
    </div>
  );
}
