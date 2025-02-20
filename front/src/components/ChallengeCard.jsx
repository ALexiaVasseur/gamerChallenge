/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';

export default function ChallengeCard({ id, title, author, image }) {
    const navigate = useNavigate();

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
            className="rounded-lg shadow-lg border border-[#9f8b20] flex flex-col items-center text-center cursor-pointer transition transform hover:scale-105 duration-300 overflow-hidden"
            onClick={handleCardClick}
        >
            {/* Conteneur image sans fond doré */}
            <div className="w-full bg-black flex items-center justify-center">
                {image && (
                    isYouTubeLink(image) ? (
                        <iframe 
                            src={getYouTubeEmbedUrl(image)} 
                            title={title}
                            className="w-full aspect-video rounded-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <img 
                            src={image} 
                            alt={title} 
                            className="w-full max-h-72 object-contain rounded-none"
                        />
                    )
                )}
            </div>
            
            {/* Partie basse avec fond doré */}
            <div className="w-full bg-[rgba(159,139,32,0.7)] py-2 flex flex-col justify-center items-center">
                <h3 className="text-2xl md:text-4xl font-bold text-white uppercase">{title}</h3>
                <p className="text-lg md:text-2xl text-white">Auteur : {author}</p>
            </div>
        </div>
    );
}
