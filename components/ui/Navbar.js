"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 p-4 z-20 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold cursor-pointer">
          The Binary Critic
        </Link>
        <div className="hidden ml-auto mr-5 md:flex space-x-6">
          <Link href="/" className="hover:text-gray-400">
            Home
          </Link>
          <Link href="/for-you" className="hover:text-gray-400">
            For You
          </Link>
          <Link href="/blog" className="hover:text-gray-400">
            Reviews
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* <button
            onClick={() => setSearchBarOpen(!searchBarOpen)}
            className="hover:text-gray-400"
          >
            <Search size={24} />
          </button> */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-gray-800 rounded-2xl px-4 py-2 mt-2">
          <Link href="/" className="block py-2 hover:text-gray-400">
            Home
          </Link>
          <Link href="/for-you" className="block py-2 hover:text-gray-400">
            For You
          </Link>
          <Link href="/account" className="block py-2 hover:text-gray-400">
            Account
          </Link>
        </div>
      )}
      {searchBarOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-800 p-4 shadow-lg z-30">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white outline-none"
          />
          {/* You can later implement search result display here */}
        </div>
      )}
    </nav>
  );
}
