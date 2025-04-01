'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';

export default function ForYouPage() {
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  return (
    
    <div className="bg-[#0A0B18] text-white h-[90vh]">
      <Navbar/>
      {/* Main Content */}
      <div className="pt-5 mt-15 px-4 text-center">
        <h1 className="text-4xl font-bold">TBC Recommendation System</h1>
        <p className="mt-4 text-lg text-gray-400">Coming soon...</p>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 absolute bottom-0 w-full py-4 mt-8">
        <div className="container mx-auto text-center text-sm text-gray-400">
          © {new Date().getFullYear()} The Binary Critic. All Rights Reserved.
        </div>
      </footer>

      {/* Hide scrollbars CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
