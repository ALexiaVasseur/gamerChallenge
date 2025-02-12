/* eslint-disable react/prop-types */
export default function ChallengeCard({ id, title, author, image}) {
    const isYouTubeLink = (url) => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
        return youtubeRegex.test(url);
    };
    
      // Fonction pour extraire l'ID de la vidéo YouTube
    const getYouTubeEmbedUrl = (url) => {
        const videoId = url.split('v=')[1]?.split('&')[0] || 
                        url.split('youtu.be/')[1]?.split('?')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    return (
        <div key={id} className="bg-[#907c10] p-4 rounded-lg shadow-lg border-2 border-[#9f8b20] flex flex-col items-center text-center">
            {image && (
                isYouTubeLink(image) ? (
                <iframe 
                    src={getYouTubeEmbedUrl(image)} 
                    title={title}
                    className="w-full h-80 rounded"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
                ) : (
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-80 object-cover rounded" 
                />
                )
            )}
            <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
            <p className="text-xl text-white text-gray-400">Auteur : {author}</p>
        </div>
    )
}