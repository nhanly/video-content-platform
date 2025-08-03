"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen } from "lucide-react";

const navigationItems = [{ name: "Home", href: "/", icon: Home }];

const collectionItems = [
  { name: "My library", href: "/library", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 h-screen overflow-y-auto flex-shrink-0">
      <div className="p-4">
        {/* Explore Section */}
        <div className="mb-8">
          <h2 className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">
            Explore
          </h2>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* My Collections Section */}
        <div>
          <h2 className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">
            My Collections
          </h2>
          <nav className="space-y-1">
            {collectionItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
