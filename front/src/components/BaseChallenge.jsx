import ChallengeCard from './ChallengeCard';
import LargeButton from './LargeButton';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

/* eslint-disable react/prop-types */
const BaseChallenge = ({ title, children, name_button, section_title, challengesList, description }) => {
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setConnected(true);
    }
  }, []);

  // Rediriger vers la page de création de challenge
  const goToCreateChallengePage = () => {
    navigate('/create-challenge');
  };

  return (
    <div className="text-white min-h-screen flex flex-col items-center px-6 sm:px-12 lg:px-20">
      {/* Section Hero - Présentation */}
      <main className="w-full max-w-screen-2xl">
        <section className="text-center py-16 w-full">
          <div className="bg-[rgba(57,57,57,0.5)] rounded-xl p-10 mx-auto max-w-5xl mt-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-4 w-full text-center leading-tight break-words">{title}</h1>
            {children}

            {/* Description de la catégorie */}
            <p className="text-lg sm:text-xl text-gray-300 mt-6">{description}</p>

            {/* Bouton pour voir les challenges */}
            <div className="mt-8 flex justify-center">
              <LargeButton idToHref={`#challenges-${title}`} nameButton={name_button} />
            </div>
          </div>
        </section>

        {/* Section des Challenges avec padding-bottom */}
        <section id={`challenges-${title}`} className="w-full pb-32">
          <div className="border-b-4 border-[#9f8b20] pb-8"></div>

          {/* Header des challenges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-10 mt-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold">{section_title}</h2>

            {/* Bouton "Créer un Challenge" visible uniquement si connecté */}
            {connected && (
              <button
                className="bg-[rgba(159,139,32,0.7)] hover:bg-[rgba(159,139,32,1)] hover:scale-105 transition-all duration-500 text-white px-6 py-3 rounded-lg text-xl font-semibold"
                onClick={goToCreateChallengePage}
              >
                Créer un Challenge
              </button>
            )}
          </div>

          {/* Affichage des challenges */}
          {challengesList?.length === 0 ? (
            <div className="text-center text-2xl text-gray-400 mt-10">
              Aucun challenge disponible actuellement
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
              {challengesList.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  id={challenge.id}
                  title={challenge.title}
                  author={challenge.account?.pseudo || 'Anonyme'}
                  image={challenge.image_url}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default BaseChallenge;
