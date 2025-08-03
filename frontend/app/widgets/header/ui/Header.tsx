"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, Settings, User } from "lucide-react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white lg:hidden">
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="flex items-center space-x-2">
            <span className="text-white font-bold text-xl hidden sm:block">
              Video Content Platform
            </span>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white placeholder-gray-400 px-4 py-2 pr-10 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>

          <button className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium border border-gray-600 hover:border-gray-500">
            LOG IN
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="text-gray-300 hover:text-white"
            >
              <User className="w-6 h-6" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-8 bg-gray-800 rounded-lg shadow-lg py-2 w-48 z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Settings
                </Link>
                <hr className="border-gray-700 my-2" />
                <button className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
