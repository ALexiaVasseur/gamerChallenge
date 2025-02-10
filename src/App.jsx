/* eslint-disable react/jsx-key */
import { useEffect, useState } from 'react';
import ChallengeCard from './components/ChallengeCard';
import Header from './components/HeaderCard';
import Footer from './components/FooterCard';
import Particles from './components/magicui/particles';

const HomePage = () => {
  const [challenges, setChallenges] = useState([]);
  const [color, setColor] = useState("#FFFFFF");
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
    
    <div  className="text-white min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="text-center py-16 px-4">
            <div className="bg-[rgba(57,57,57,0.5)] rounded-xl p-6 mx-96 mt-4">
            <h1 className="text-8xl font-bold mb-8">GamerChallenge</h1>
              <p className="text-2xl text-[#898989] mb-8">
                GamerChallenges est une plateforme ambitieuse qui vise à rassembler les joueurs autour de défis <span className="text-yellow-400">ludiques</span> et <span className="text-yellow-400">compétitifs</span>. Ce projet permet de mettre en application diverses compétences techniques et organisationnelles tout en offrant une <span className="text-yellow-400">expérience immersive</span> à la communauté gaming.
              </p>
              <button className="mt-6 bg-[#FF8C00] hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-semibold w-full">
                Voir les derniers challenges
              </button>
            </div>
        </section>

        {/* Challenges Section */}
        <section className="px-8 pb-16">
        <div className="border-b-2 border-[#9f8b20] pb-6"></div> {/* Ligne de séparation sous le titre */}
          <h2 className="text-5xl font-semibold pt-6 pb-2  my-24"> Les derniers challenges </h2>

          {challenges.message === "Aucun challenge trouvé." ? (
            <div className="text-center text-2xl text-gray-400">
              Aucun challenge disponible actuellement
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
              {console.log(challenges)}
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  id={challenge.id}
                  title={challenge.title}
                  author={challenge.account?.pseudo || 'Anonyme'}
                  image={challenge.video_url}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />

      <Particles
            className="fixed top-0 left-0 w-full h-screen z-[-1]"
            quantity={200}
            color={color}
            refresh
        />
  </div>
  );
};

export default HomePage;
