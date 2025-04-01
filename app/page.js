'use client';

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";

const API_KEY = "6ed6405b3ed2d0d1c0cc584ef27b7a9e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

// Custom Carousel Component
function CustomCarousel({ children, autoPlayDelay = 8000 }) {
  const [current, setCurrent] = useState(0);
  const childrenArray = Array.isArray(children) ? children : [children];
  const total = childrenArray.length;
  const autoPlayRef = useRef();

  useEffect(() => {
    autoPlayRef.current = () => {
      setCurrent((prev) => (prev + 1) % total);
    };
  }, [total]);

  useEffect(() => {
    const interval = setInterval(() => {
      autoPlayRef.current();
    }, autoPlayDelay);
    return () => clearInterval(interval);
  }, [autoPlayDelay]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {childrenArray.map((child, index) => (
          <div key={index} className="flex-shrink-0 w-full">
            {child}
          </div>
        ))}
      </div>
      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {childrenArray.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${current === index ? 'bg-white' : 'bg-gray-500'}`}
            onClick={() => setCurrent(index)}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // New states for search functionality
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      const trendingRes = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&region=IN&language=en-IN&with_original_language=hi&with_origin_country=IN`);
      const popularRes = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&region=IN&language=en-IN&with_original_language=hi`);
      const actionRes = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&region=IN&language=en-IN&with_original_language=hi`);
      const romanceRes = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749&region=IN&language=en-IN&with_original_language=hi`);
      const comedyRes = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35&region=IN&language=en-IN&with_original_language=hi`);
      const horrorRes = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27&region=IN&language=en-IN&with_original_language=hi`);

      const trendingData = await trendingRes.json();
      const popularData = await popularRes.json();
      const actionData = await actionRes.json();
      const romanceData = await romanceRes.json();
      const comedyData = await comedyRes.json();
      const horrorData = await horrorRes.json();

      setTrendingMovies(trendingData.results);
      setPopularMovies(popularData.results);
      setActionMovies(actionData.results);
      setRomanceMovies(romanceData.results);
      setComedyMovies(comedyData.results);
      setHorrorMovies(horrorData.results);
    }
    fetchMovies();
  }, []);

  // Search functionality
  async function handleSearch(e) {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
      const searchRes = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(e.target.value)}&language=en-IN`);
      const searchData = await searchRes.json();
      setSearchResults(searchData.results);
    } else {
      setSearchResults([]);
    }
  }

  return (
    <div className="bg-[#0A0B18] text-white min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-900 p-4 z-20 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">The Binary Critic</h1>
          <div className="hidden md:flex ml-auto mr-5 space-x-6">
            <Link href="#" className="hover:text-gray-400">Home</Link>
            <Link href="/for-you" className="hover:text-gray-400">For You</Link>
            <Link href="/blog" className="hover:text-gray-400">Reviews</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSearchBarOpen(!searchBarOpen)} className="hover:text-gray-400">
              <Search size={24} />
            </button>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-gray-800 rounded-2xl px-4 py-2 m">
            <Link href="#" className="block py-2 hover:text-gray-400">Home</Link>
            <Link href="/for-you" className="block py-2 hover:text-gray-400">For You</Link>
            <Link href="/blog" className="block py-2 hover:text-gray-400">Reviews</Link>
          </div>
        )}
        {/* Search Bar Overlay (opens on clicking the search icon) */}
        {searchBarOpen && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 p-4 shadow-lg z-30">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-3 rounded bg-gray-700 text-white outline-none"
            />
            {searchResults.length > 0 && (
              <div className="mt-2 bg-gray-700 rounded p-2">
                {searchResults.slice(0, 5).map((movie) => (
                  <Link key={movie.id} href={`/movie/${movie.id}`}>
                    <p className="p-2 hover:bg-gray-600 cursor-pointer">{movie.title}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Carousel for Trending Movies */}
      <div className="mt-16">
        <CustomCarousel autoPlayDelay={8000}>
          {trendingMovies.slice(0, 5).map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`}>
              <div className="relative w-full h-[500px] cursor-pointer">
                <Image 
                  src={`${IMAGE_BASE_URL}${movie.backdrop_path}`} 
                  alt={movie.title} 
                  layout="fill" 
                  objectPosition="top"
                  objectFit="cover" 
                  className="" 
                />
                <div className="absolute bottom-0 bg-gradient-to-t from-black to-transparent p-4 pb-10 w-full">
                  <h2 className="text-3xl font-bold">{movie.title}</h2>
                  <p className="text-sm mt-2">{movie.overview.slice(0, 100)}...</p>
                </div>
              </div>
            </Link>
          ))}
        </CustomCarousel>
      </div>

      {/* Movie Categories */}
      {[
        ["Popular Movies", popularMovies],
        ["Action Movies", actionMovies],
        ["Romance Movies", romanceMovies],
        ["Comedy Movies", comedyMovies],
        ["Horror Movies", horrorMovies],
      ].map(([title, movies]) => (
        <div key={title} className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 ml-4">{title}</h2>
          <div className="flex space-x-4 overflow-x-auto scroll-smooth hide-scrollbar pb-4 px-4">
            {movies.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className="relative min-w-[200px] cursor-pointer bg-gray-800 rounded-lg shadow-md group">
                  <div className="relative h-[300px]">
                    <Image
                      src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={movie.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                    {/* Hover Overlay with Blur Effect */} 
                    <div className="absolute inset-0 bg-black/50 cursor-pointer backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-2 rounded-lg">
                      <h3 className="text-lg font-bold text-center">{movie.title}</h3>
                      <p className="text-xs mt-2 text-center">{movie.overview.slice(0, 80)}...</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))} 
          </div>
        </div>
      ))}

      {/* Footer */}
      <footer className="bg-gray-900 py-4 mt-8">
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
