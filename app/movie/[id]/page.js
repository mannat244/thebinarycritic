'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const API_KEY = "6ed6405b3ed2d0d1c0cc584ef27b7a9e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export default function MovieDetailsPage() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [cast, setCast] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [similar, setSimilar] = useState([]);
    const [streamUrl, setStreamUrl] = useState(null);
    const [watchProviders, setWatchProviders] = useState([]);

    useEffect(() => {
        if (!id) return;

        async function fetchData() {
            try {
                // Fetch movie details
                const resMovie = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-IN`);
                const movieData = await resMovie.json();
                setMovie(movieData);

                // Fetch trailer video
                const resTrailer = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-IN`);
                const trailerData = await resTrailer.json();
                if (trailerData.results && trailerData.results.length > 0) {
                    const ytTrailer = trailerData.results.find(
                        (video) => video.type === "Trailer" && video.site === "YouTube"
                    );
                    setTrailer(ytTrailer);
                }

                // Fetch cast
                const resCast = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-IN`);
                const castData = await resCast.json();
                if (castData.cast) setCast(castData.cast.slice(0, 12));

                // Fetch reviews
                const resReviews = await fetch(`${BASE_URL}/movie/${id}/reviews?api_key=${API_KEY}&language=en-IN`);
                const reviewsData = await resReviews.json();
                if (reviewsData.results) setReviews(reviewsData.results);

                // Fetch similar movies
                const resSimilar = await fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=en-IN`);
                const similarData = await resSimilar.json();
                if (similarData.results) setSimilar(similarData.results);

                // Fetch streaming link via RapidAPI
                const streamOptions = {
                    method: 'POST',
                    headers: {
                        'x-rapidapi-key': '6f5ed52ed2msh87fec65306f84bep15b006jsnea6b487738e6', // Replace with your actual key
                        'x-rapidapi-host': 'movie-tv-show-video-fetcher.p.rapidapi.com',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ type: 'movie', id })
                };
                try {
                    const streamRes = await fetch('https://movie-tv-show-video-fetcher.p.rapidapi.com/api.php', streamOptions);
                    const streamData = await streamRes.json();
                    setStreamUrl(streamData.url);
                } catch (error) {
                    console.error("Error fetching stream data:", error);
                    // Handle error, maybe set streamUrl to null or an error state.
                    setStreamUrl(null);
                }

                // Fetch watch providers
                const resProviders = await fetch(`${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`);
                const providersData = await resProviders.json();

                // Get providers for India (IN)
                if (providersData.results && providersData.results.IN) {
                    setWatchProviders(providersData.results.IN.flatrate || []);
                } else {
                    setWatchProviders([]); // or some default
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [id]);

    if (!movie) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="bg-[#0A0B18] text-white min-h-screen flex flex-col">
            {/* Top Section */}
            <div className="w-full">
                {trailer ? (
                    <div className="relative w-full h-[450px]">
                        {/* Blurred backdrop as background */}
                        <div className="absolute inset-0">
                            <Image
                                src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
                                alt={movie.title}
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'top' }}
                                className="filter blur-sm opacity-60"
                            />
                        </div>
                        {/* Embedded trailer */}
                        <div className="relative mx-auto" style={{ maxWidth: '800px', height: '450px' }}>
                            <iframe
                                className="w-full h-full"
                                key={trailer.key} 
                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                title="Trailer"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full h-[400px]">
                        <Image
                            src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
                            alt={movie.title}
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'top' }}
                        />
                    </div>
                )}
            </div>

            {/* Movie Details with Poster */}
            <div className="container mx-auto p-4 flex-grow">
                <div className="bg-gray-900 bg-opacity-90 p-6 rounded-lg shadow-lg flex flex-col md:flex-row">
                    {/* Movie Poster */}
                    <div className="md:w-fit flex-shrink-0 mb-4 md:mb-0">
                        <Image
                            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                            alt={movie.title}
                            width={300}
                            height={450}
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg mx-auto"
                        />
                    </div>
                    {/* Movie Info */}
                    <div className="md:ml-6 md:w-2/3">
                        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                        <p className="mb-4">{movie.overview}</p>
                        <div className="flex space-x-4 mb-4">
                            <span><strong>Language:</strong> {movie.original_language.toUpperCase()}</span>
                            <span><strong>Rating:</strong> {movie.vote_average} / 10</span>
                        </div>
                        {/* Watch Providers Section */}
                        {watchProviders && watchProviders.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold mb-2">Available On:</h3>
                                <div className="flex flex-wrap items-center gap-4">
                                    {watchProviders.map((provider,index) => (
                                      <div key={index}>
                                            <Image
                                                src={`${IMAGE_BASE_URL}${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                width={40}
                                                height={40}
                                                className="rounded-lg"
                                            />
                                            <span>{provider.provider_name}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Streaming info provided by JustWatch</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cast Section - Horizontal List */}
            {cast.length > 0 && (
                <div className="my-8 mx-2">
                    <h2 className="text-2xl font-semibold mb-4">Cast</h2>
                    <div className="flex space-x-4 overflow-x-auto scroll-smooth hide-scrollbar pb-4">
                        {cast.map((member,index) => (
                            <div key={index} className="min-w-[150px] bg-gray-800 rounded-lg shadow-md cursor-pointer">
                                <div className="relative h-[225px]">
                                    {member.profile_path ? (
                                        <Image
                                            src={`${IMAGE_BASE_URL}${member.profile_path}`}
                                            alt={member.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-t-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-t-lg">
                                            <span className="text-xl font-bold">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-2">
                                    <h3 className="text-sm font-bold">{member.name}</h3>
                                    <p className="text-xs text-gray-400">{member.character}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            {reviews.length > 0 && (
                <div className="my-8 mx-2">
                    <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                    <div className="space-y-4">
                        {reviews.map(review => (
                            <div key={review.id} className="p-4 bg-gray-800 rounded">
                                <p className="text-sm">
                                    <strong>{review.author}:</strong> {review.content.slice(0, 200)}
                                    {review.content.length > 200 && '...'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Similar Movies Section */}
            {similar.length > 0 && (
                <div className="my-8 mx-2">
                    <h2 className="text-2xl font-semibold pb-4">Similar Movies</h2>
                    <div className="flex space-x-4 overflow-x-auto scroll-smooth hide-scrollbar pb-4">
                        {similar.map((simMovie,index) => (
                            <Link key={index} href={`/movie/${simMovie.id}`}>
                                <div className="relative min-w-[200px] bg-gray-800 rounded-lg shadow-md group cursor-pointer">
                                    <div className="relative h-[300px]">
                                        <Image
                                            src={`${IMAGE_BASE_URL}${simMovie.poster_path}`}
                                            alt={simMovie.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black/50 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-2 rounded-lg">
                                            <h3 className="text-lg font-bold text-center">{simMovie.title}</h3>
                                            <p className="text-xs mt-2 text-center">{simMovie.overview.slice(0, 80)}...</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-gray-900 py-4">
               
                <div className="container mx-auto text-center text-sm text-gray-400">
                    <Link href={streamUrl ? streamUrl : ""}>
                © {new Date().getFullYear()} The Binary Critic. All Rights Reserved. </Link>
                </div>
            </footer>

            {/* Hide scrollbars CSS (move this CSS into a global stylesheet if possible) */}
            <style jsx global>{`
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
