import { useEffect, useState } from 'react';
import BaseChallenge from '../components/BaseChallenge';

const HomePage = () => {
  const [challenges, setChallenges] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL; // Utilise la variable d'environnement


  useEffect(() => {
    window.dispatchEvent(new Event("userChanged"));
    const fetchChallenges = async () => {
      try {
        const response = await fetch(`${apiUrl}/sixChallenges`);
        const data = await response.json();
        setChallenges(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChallenges();
  }, [apiUrl]);

  return (
    <BaseChallenge 
      title={
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-center leading-none">
          Gamer<span className="block sm:inline">Challenge</span>
        </span>
      }
      name_button="Voir les derniers challenges"
      section_title="Les derniers challenges"
      challengesList={challenges}
    >
      <div className="rounded-xl p-5 mx-auto max-w-5xl mt-6">
        <p className="text-lg sm:text-xl md:text-2xl text-[#898989] mb-4 leading-snug">
          GamerChallenges est une plateforme <span className="text-[#9f8b20]">ambitieuse</span> qui vise à rassembler les joueurs autour de <span className="text-[#9f8b20]">défis ludiques</span> et <span className="text-[#9f8b20]">compétitifs</span>. 
          Ce projet permet de mettre en application diverses <span className="text-[#9f8b20]">compétences techniques</span> et 
          <span className="text-[#9f8b20] break-words"> organisationnelles</span> tout en offrant une <span className="text-[#9f8b20]">expérience immersive</span> à la communauté gaming. Les jeux sont extraits de <span className="text-[#9f8b20]">l&apos;API </span>
           https://www.freetogame.com
        </p>
      </div>
    </BaseChallenge>
  );
};

export default HomePage;
