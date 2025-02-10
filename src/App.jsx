import twitchStream from './assets/images/twitch-stream.webp';
import logoGamer from './assets/images/logo-gamer.webp';

const challenges = [
  { id: 1, title: "Lorem ipsum blablabla", author: "Lorem", image: twitchStream },
  { id: 2, title: "Lorem ipsum blablabla", author: "Lorem", image: twitchStream },
  { id: 3, title: "Lorem ipsum blablabla", author: "Lorem", image: twitchStream },
  { id: 4, title: "Lorem ipsum blablabla", author: "Lorem", image: twitchStream },
  { id: 5, title: "Lorem ipsum blablabla", author: "Lorem", image: twitchStream },
  { id: 6, title: "Lorem ipsum blablabla", author: "Lorem", image: twitchStream },
];

const HomePage = () => {
  return (
    <div  className="text-white min-h-screen">
      <header>
      <div>
        {/* Navbar */}
        <nav className="flex justify-between items-center px-8 py-6 mb-14">
        {/* Logo à gauche */}
        <div>
          <img src={logoGamer} alt="Logo" className="w-16 h-16 rounded-full" />
        </div>

        {/* Menu centré avec fond arrondi */}
        <div className="flex space-x-6 px-60 py-4 bg-[rgba(48,46,46,0.5)] rounded-full text-white font-mono text-3xl gap-x-52">
          <a href="#" className="hover:text-[#9f8b20]">Menu</a>
          <a href="#" className="hover:text-[#9f8b20]">Catégories</a>
          <a href="#" className="hover:text-[#9f8b20]">Leaderboard</a>
        </div>

        {/* Profil à droite */}
        <div className="w-16 h-16 border border-white rounded-full flex items-center justify-center text-white font-bold">
          CH
        </div>
      </nav>
    </div>
    </header>

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
      
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-[#907c10] p-4 rounded-lg shadow-lg border-2 border-[#9f8b20] flex flex-col items-center text-center">
              <img src={challenge.image} alt={challenge.title} className="w-full h-80 object-cover rounded" />
              <h3 className="mt-4 text-2xl font-semibold">{challenge.title}</h3>
              <p className="text-xl text-white text-gray-400">Auteur : {challenge.author}</p>
            </div>
          ))}
        </div>
      </section>
    </main>

    {/* Footer */}
    <footer className="bg-[#2a2a2a] text-white text-center py-6 mt-12">
      <div className="space-x-6">
        <a href="#" className="hover:text-[#9f8b20]">Contact</a>
        <a href="#" className="hover:text-[#9f8b20]">Mentions légales</a>
        <a href="#" className="hover:text-[#9f8b20]">Politique de confidentialité</a>
      </div>
    </footer>
  </div>



  );
};

export default HomePage;
