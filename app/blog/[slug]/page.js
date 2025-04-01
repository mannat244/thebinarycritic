import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import sanityClient from '@/sanityClient';
import { urlFor } from '@/imageUrl';
import Navbar from '@/components/ui/Navbar';

const postQuery = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  mainImage,
  slug,
  movieName,
  starRating,
  excerpt,
  content,
  datePosted,
  author->{name},
  movieGenres
}`;

const similarPostsQuery = `*[_type == "post" && slug.current != $slug] | order(datePosted desc)[0..3]{
  _id,
  title,
  mainImage,
  slug,
  excerpt
}`;

// Fetch Data before Rendering
async function getPostData(slug) {
  const post = await sanityClient.fetch(postQuery, { slug });
  const similarPosts = await sanityClient.fetch(similarPostsQuery, { slug });

  return { post, similarPosts };
}

export default async function PostPage({ params }) {
  const { slug } = params;
  const { post, similarPosts } = await getPostData(slug);

  if (!post) {
    return (
      <div className="bg-[#0A0B18] text-white min-h-screen flex items-center justify-center">
        <h2>Post not found</h2>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0B18] text-white min-h-screen flex flex-col">
      <Navbar />
      {post.mainImage && (
        <div className="relative w-full h-[550px]">
          <Image
            src={urlFor(post.mainImage).width(1600).url()}
            alt={post.title}
            fill
            className="rounded-lg object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-[#0A0B18] to-transparent opacity-80 rounded-b-lg" />
          <div className="absolute bottom-6 left-6 z-10">
            <h1 className="text-4xl md:text-5xl mb-5 font-bold">{post.title}</h1>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 pt-8 mb-10 flex-grow">
        <article className="bg-gray-900 bg-opacity-90 p-6 rounded-lg shadow-lg mt-[-50px] relative z-10">
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-gray-400 text-sm">
              <span>{post.datePosted ? new Date(post.datePosted).toDateString() : 'No date'}</span>
              {post.author && <span className="ml-2">| By {post.author.name}</span>}
            </div>
            {post.movieGenres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                {post.movieGenres.map((tag) => (
                  <span key={tag} className="bg-gray-700 px-2 py-1 text-xs rounded-full">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {post.excerpt && <p className="text-gray-300 text-lg mb-4">{post.excerpt}</p>}
          {post.movieName && <p className="text-gray-400 text-sm mb-2">Movie: {post.movieName}</p>}

          {post.starRating && (
            <div className="flex items-center gap-2 mb-4">
              <p className={
                `${post.starRating >= 5 ? "bg-green-500" : 
                post.starRating === 4 ? "bg-green-400" : 
                post.starRating === 3 ? "bg-yellow-400" : 
                post.starRating === 2 ? "bg-red-400" : 
                "bg-red-500"} text-white font-semibold text-lg w-fit p-1 rounded-lg`
              }>
                Rating: {post.starRating}/5
              </p>
              <div>
                {Array(5).fill(0).map((_, i) => (
                  <span key={i} className="text-lg">
                    {i < post.starRating ? '⭐️' : '☆'}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-invert text-lg max-w-none">
            <PortableText value={post.content} />
          </div>
        </article>
      </main>

      {similarPosts.length > 0 && (
        <div className="container mx-auto px-4 mb-10">
          <h2 className="text-2xl font-bold mb-4">Similar Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarPosts.map((post) => (
              <Link key={post._id} href={`/blog/${post.slug?.current || post._id}`}>
                <div className="bg-slate-700/30 hover:bg-slate-800 h-[430px] p-2 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
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
                    {post.excerpt && <p className="text-gray-300 text-sm">{post.excerpt.slice(0, 360)}...</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <footer className="bg-gray-900 py-4">
        <div className="container mx-auto text-center text-sm text-gray-400">
          © {new Date().getFullYear()} The Binary Critic. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
