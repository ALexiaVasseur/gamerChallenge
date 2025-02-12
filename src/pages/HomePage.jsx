 import { useEffect, useState } from 'react';
import BaseChallenge from '../components/BaseChallenge'

const HomePage = () => {
  const [challenges, setChallenges] = useState([]);
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/sixChallenges");
        const data = await response.json();

        setChallenges(data);
      } catch (error) {
        console.error(error);
      }
    }; 

    fetchChallenges();
  }, []);

  return (

    <BaseChallenge 
      title="GamerChallenge"
      name_button="Voir les derniers challenges"
      section_title="Les derniers challenges"
      challengesList={challenges}
    >
      
      <p className='text-2xl text-[#898989] mb-8'>
        GamerChallenges est une plateforme <span className="text-[#9f8b20]">ambitieuse</span> qui vise à rassembler les joueurs autour de <span className="text-[#9f8b20]">défis ludiques</span> et <span className="text-[#9f8b20]">compétitifs</span>. 
        Ce projet permet de mettre en application diverses <span className="text-[#9f8b20]">compétences techniques</span> et <span className="text-[#9f8b20]">organisationnelles</span> tout en offrant une <span className="text-[#9f8b20]">expérience immersive</span> à la communauté gaming.
      </p>
    </BaseChallenge>
  );
};

export default HomePage;
