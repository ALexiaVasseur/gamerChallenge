import ChallengeCard from './ChallengeCard';
import LargeButton from './LargeButton';
import { useNavigate } from 'react-router-dom';
/* eslint-disable react/prop-types */

const BaseChallenge = ({title, children, name_button, section_title, challengesList}) => {
  const navigate = useNavigate();

  // Fonction pour rediriger vers la page de création de challenge
  const goToCreateChallengePage = () => {
    navigate('/create-challenge'); // Redirige vers la route '/create-challenge'
  };

  return (
    <div className="text-white min-h-screen">
      {/* Section Hero - Présentation */}
      <main>
        <section className="text-center py-16 px-4">
          <div className="bg-[rgba(57,57,57,0.5)] rounded-xl p-6 mx-96 mt-4">
            <h1 className="text-8xl font-bold mb-8">{title}</h1>
            <p className="text-2xl text-[#898989] mb-8">
              {children}
            </p>
            <LargeButton
              idToHref={`#challenges-${title}`}
              nameButton={name_button}
            />
            {/* <button className="mt-6 bg-[#FF8C00] hover:bg-orange-600 hover:scale-102 transition-all duration-500 text-white px-6 py-3 rounded-lg text-lg font-semibold w-full">
              {name_button}
            </button> */}
          </div>
        </section>

        {/* Section des Challenges */}
        <section id={`challenges-${title}`} className="px-8 pb-16">
          <div className="border-b-2 border-[#9f8b20] pb-6"></div>
          <div className='flex items-center w-full gap-20'>
            <h2 className="text-5xl font-semibold pt-6 pb-2 my-24">{section_title}</h2>

            {/* Bouton en dessous de "Les challenges" */}
            <button
              className="bg-[#FF8C00] hover:bg-orange-600 hover:scale-102 transition-all duration-500 text-white px-4 py-2 h-10 rounded-lg text-lg font-semibold w-auto mt-4"
              onClick={goToCreateChallengePage} // Appel de la fonction sur le clic
            >
        Créer un Challenge
      </button>
          </div>

          {/* Affichage des challenges */}
          {challengesList === null ? (
            <div className="text-center text-2xl text-gray-400">
              Aucun challenge disponible actuellement
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
              {challengesList.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  id={challenge.id}
                  title={challenge.title}
                  author={challenge.account?.pseudo || 'Anonyme'}
                  image={challenge.video_url}  // Ajoute l'image/vidéo liée au challenge
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
