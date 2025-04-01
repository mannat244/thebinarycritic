'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function VideoPage() {
  const { id } = useParams();
  const [disclaimerVisible, setDisclaimerVisible] = useState(true);
  const videoUrl = `https://vidsrc.su/embed/movie/${id}`;

  return (
    <div className="relative w-full h-screen bg-black">
      <iframe
        src={videoUrl}
        title="Video Player"
        className="w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      ></iframe>

      {disclaimerVisible && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center p-4">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg text-center space-y-4">
            <h2 className="text-xl text-blue-500 font-bold">Disclaimer</h2>
            <p className="text-sm text-gray-300">
              The Binary Critic (thebinarycritic.vercel.app) does not promote piracy or encourage any form of copyright infringement. We are a review and recommendation platform that provides information about movies and shows.
            </p>
            <p className="text-sm text-gray-300">
              We do not host or store any video content on our servers. Our website uses an external API provided by vidsrc.su to fetch streaming links. We are not responsible for the content provided by this service.
            </p>
            <p className="text-sm text-gray-300">
              If you believe any video violates copyright or should be removed, please contact admin@vidsrc.su directly. We have no control over the content hosted by external providers.
            </p>
            <button
              onClick={() => setDisclaimerVisible(false)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
