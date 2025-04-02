'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const API_KEY = "6ed6405b3ed2d0d1c0cc584ef27b7a9e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export default function TVShowDetailsPage() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [similarTV, setSimilarTV] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const resShow = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-IN`);
        const showData = await resShow.json();
        setShow(showData);
        setSeasons(showData.seasons || []);

        const resTrailer = await fetch(`${BASE_URL}/tv/${id}/videos?api_key=${API_KEY}&language=en-IN`);
        const trailerData = await resTrailer.json();
        if (trailerData.results && trailerData.results.length > 0) {
          const ytTrailer = trailerData.results.find(video => video.type === "Trailer" && video.site === "YouTube");
          setTrailer(ytTrailer);
        }

        const resCast = await fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=en-IN`);
        const castData = await resCast.json();
        if (castData.cast) setCast(castData.cast.slice(0, 12));

        const resSeason = await fetch(`${BASE_URL}/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}&language=en-IN`);
        const seasonData = await resSeason.json();
        setSeasonDetails(seasonData);
        if (seasonData.episodes && seasonData.episodes.length > 0) {
          setSelectedEpisode(seasonData.episodes[0].episode_number);
        }

        const resSimilar = await fetch(`${BASE_URL}/tv/${id}/similar?api_key=${API_KEY}&language=en-IN`);
        const similarData = await resSimilar.json();
        if (similarData.results) setSimilarTV(similarData.results);

        const resProviders = await fetch(`${BASE_URL}/tv/${id}/watch/providers?api_key=${API_KEY}`);
        const providersData = await resProviders.json();
        if (providersData.results && providersData.results.IN) {
          setWatchProviders(providersData.results.IN.flatrate || []);
        } else {
          setWatchProviders([]);
        }
      } catch (error) {
        console.error("Error fetching TV show data:", error);
      }
    }

    fetchData();
  }, [id, selectedSeason]);

  const handlePlayEpisode = () => {
    if (!selectedEpisode) return;
    const url = `/series/${id}/${selectedSeason}/${selectedEpisode}`;
    window.open(url, '_blank');
  };

  if (!show) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#0A0B18] text-white min-h-screen flex flex-col">
      <div className="w-full">
        {trailer ? (
          <div className="relative w-full h-[450px]">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="relative w-full h-[400px]">
            <Image
              src={`${IMAGE_BASE_URL}${show.backdrop_path}`}
              alt={show.name}
              layout="fill"
              objectFit="cover"
              objectPosition="top"
            />
          </div>
        )}
      </div>

      <div className="container mx-auto p-4 flex-grow">
        <div className="bg-gray-900 bg-opacity-90 p-6 rounded-lg shadow-lg flex flex-col md:flex-row">
          <div className="md:w-fit flex-shrink-0 mb-4 md:mb-0">
            <Image
              src={`${IMAGE_BASE_URL}${show.poster_path}`}
              alt={show.name}
              width={300}
              height={450}
              objectFit="cover"
              className="rounded-lg mx-auto"
            />
          </div>
          <div className="md:ml-6 md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{show.name}</h1>
            <p className="mb-4">{show.overview}</p>
            <div className="flex space-x-4 mb-4">
              <span><strong>First Air Date:</strong> {show.first_air_date}</span>
              <span><strong>Rating:</strong> {show.vote_average} / 10</span>
            </div>
            {seasonDetails && seasonDetails.episodes && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold mb-4">Episodes</h2>
            <div className="flex flex-col space-y-4">
              <div>
                <label htmlFor="seasonSelect" className="mr-2 font-bold">Select Season:</label>
                <select
                  id="seasonSelect"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  className="bg-gray-700 p-2 rounded"
                >
                  {seasons.map((s) => (
                    <option key={s.id} value={s.season_number}>
                      {s.name || `Season ${s.season_number}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="episodeSelect" className="mr-2 font-bold">Select Episode:</label>
                <select
                  id="episodeSelect"
                  value={selectedEpisode}
                  onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                  className="bg-gray-700 p-2 w-fit rounded"
                >
                  {seasonDetails.episodes.map((episode) => (
                    <option key={episode.id} value={episode.episode_number}>
                      Episode {episode.episode_number}: {episode.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex-row md:flex items-center h-fit w-fit'><button
                onClick={handlePlayEpisode}
                className="mt-4 bg-blue-600 h-10 mr-5 py flex items-center hover:bg-blue-700 text-white font-bold py-3 px-3 w-fit rounded-full shadow-lg transition duration-300"
              >
                Play Episode
              </button>
              {watchProviders.length > 0 && (
              <div className="mt-6 ml-3">
                <h3 className="text-lg font-semibold mb-2">Available On:</h3>
                <div className="flex flex-wrap items-center gap-4">
                  {watchProviders.map((provider, index) => (
                    <div key={index} className="flex items-center gap-2">
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
        )}
           
          </div>
        </div>

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
        

            
   

      {/* ... (footer and global styles remain the same) */}
       {/* Similar TV Section */}
       {similarTV.length > 0 && (
                <div className="my-8 mx-2">
                    <h2 className="text-2xl font-semibold pb-4">Similar Shows</h2>
                    <div className="flex space-x-4 overflow-x-auto scroll-smooth hide-scrollbar pb-4">
                        {similarTV.map((simMovie,index) => (
                            <Link key={index} href={`/tv/${simMovie.id}`}>
                                <div className="relative min-w-[200px] bg-gray-800 rounded-lg shadow-md group cursor-pointer">
                                    <div className="relative h-[300px]">
                                        <Image
                                            src={`${IMAGE_BASE_URL}${simMovie.poster_path}`}
                                            alt={simMovie.name}
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
</div>
            {/* Footer */}
            <footer className="bg-gray-900 py-4">
               
                <div className="container mx-auto text-center text-sm text-gray-400">
                © {new Date().getFullYear()} The Binary Critic. All Rights Reserved.
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