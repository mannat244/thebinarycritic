import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import sanityClient from '@/sanityClient';
import { urlFor } from '@/imageUrl';
import Navbar from '@/components/ui/Navbar';

export const revalidate = 60;

// Adjusted query to fetch the full excerpt
const query = `*[_type == "post"] | order(datePosted desc) {
  _id,
  title,
  mainImage,
  slug,
  excerpt,
  datePosted,
  category,
  movieGenres,
  starRating,
  // Add more fields like author if needed
}`;

const BlogPage = async () => { // Changed to a named function
  const posts = await sanityClient.fetch(query);

  // In this example, the first post is considered the "featured" post
  const featuredPost = posts[0] || null;
  const otherPosts = posts.slice(1);

  // Example categories (you can also fetch them from Sanity if you store categories in a separate doc)
  const categories = [
    'Featured',
    'Bollywood',
    'Tollywood',
    'Hollywood',
    'News',
    'Review',
    'Opinion',
    'Other'
  ];

  // Example popular posts (in reality, you’d fetch them from Sanity or track by views)
  const popularPosts = [
    { _id: 'pop1', title: 'How AI is changing Hollywood', slug: 'how-ai-is-changing-hollywood' }, // Added slug
    { _id: 'pop2', title: 'Bollywood’s Latest Blockbuster', slug: 'bollywoods-latest-blockbuster' }, // Added slug
    { _id: 'pop3', title: 'Top 5 Horror Flicks', slug: 'top-5-horror-flicks' } // Added slug
  ];

  return (
    <div className="bg-[#0A0B18] text-white min-h-screen flex flex-col">
      {/* Navbar (from your existing code) */}
      <Navbar />

      <main className="container mx-auto px-4 pt-24 flex-grow">
        {/* Heading */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold">🎬 Frame by Frame</h1>
          <p className="mt-2 text-gray-400">
            Honest, unfiltered reviews and the latest buzz from the world of cinema.
            Whether it’s a blockbuster hit or an underrated gem, we break it down
            for you—no fluff, just real opinions.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            {/* Featured Post Section */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug?.current || featuredPost._id}`}>
                <div className="flex hover:bg-slate-800  bg-slate-700/30 p-2 rounded-2xl flex-col md:flex-row gap-4 cursor-pointer">
                  {/* Left: Featured Image with Overlay */}
                  <div className="relative w-full md:w-2/3 h-80 md:h-[400px]">
                    <Image
                      src={urlFor(featuredPost.mainImage).url()}
                      alt={featuredPost.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B18] to-transparent opacity-80 rounded-lg" />
                    {/* Overlay Heading */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        {featuredPost.title}
                      </h2>
                    </div>
                  </div>

                  {/* Right: Excerpt & Meta */}
                  <div className="flex flex-col md:w-1/3 justify-bottom">
                    <p className="text-gray-300 text-[17px]/8 mt-2">
                      {featuredPost.excerpt}
                    </p>
                    {/* Example date + author (adjust to your fields) */}
                    <p className="text-sm font-bold mt-auto text-gray-500 mb-5">
                      {featuredPost.datePosted
                        ? new Date(featuredPost.datePosted).toDateString()
                        : 'No date'}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* Other Posts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-4">
              {otherPosts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug?.current || post._id}`}>
                  <div
                    className=" bg-slate-700/30  hover:bg-slate-800 h-[430px]  p-2 rounded-2xl mb-5  overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
                  >
                    <div className="relative w-full h-52">
                      {post.mainImage && (
                        <Image
                          src={urlFor(post.mainImage).width(400).url()}
                          alt={post.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      {post.excerpt && (
                        <p className="text-gray-300 text-sm">{post.excerpt.slice(0,360)}...</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar (Sticky) */}
          <aside className="md:col-span-1 space-y-8">
            {/* Categories Section */}
            <div className="bg-gray-800 rounded-lg p-4 mb-5  sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-center">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 text-sm rounded-full"
                    // onClick={() => handleCategoryClick(cat)} // implement your filter logic
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Posts Section */}
            
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-4">
        <div className="container mx-auto text-center text-sm text-gray-400">
          © {new Date().getFullYear()} The Binary Critic. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default BlogPage; // Export the component
