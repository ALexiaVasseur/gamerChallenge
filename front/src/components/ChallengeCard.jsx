/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ChallengeCard({ id, title, author, image }) {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false); 

    const isYouTubeLink = (url) => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
        return youtubeRegex.test(url);
    };

    const getYouTubeEmbedUrl = (url) => {
        const videoId = url.split('v=')[1]?.split('&')[0] || 
                        url.split('youtu.be/')[1]?.split('?')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    const handleCardClick = () => {
        navigate(`/challenge/${id}`);
    };

    return (
        <div 
            key={id} 
            className="backdrop-blur-sm p-0 rounded-lg flex flex-col items-center text-center cursor-pointer transition transform hover:scale-105 duration-300"
            onClick={handleCardClick}
        >
            {image && !imageError ? (
                isYouTubeLink(image) ? (
                    <iframe 
                        src={getYouTubeEmbedUrl(image)} 
                        title={title}
                        className="w-full aspect-video rounded-t-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <img 
                        src={image} 
                        alt={title} 
                        className="w-full h-56 object-cover object-center rounded-t-lg"
                        onError={() => setImageError(true)} 
                    />
                )
            ) : (
                <div className="w-full h-56 flex items-center justify-center rounded-t-lg">
                    <p className="text-white text-xl font-semibold">No Image</p>
                </div>
            )}

            <div className="w-full bg-[rgba(159,139,32,0.7)] py-6 flex flex-col justify-center items-center rounded-b-lg">
                <h3 className="text-4xl font-bold text-white uppercase">{title}</h3>
                <p className="text-2xl text-white">Author: {author}</p>
            </div>
        </div>
    );
}
