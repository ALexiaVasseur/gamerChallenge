const PageContact = () => {
  return (
    <div className="text-white p-4 sm:p-8 min-h-screen flex items-center justify-center">
      {/* square with font #323030 */}
      <div className="bg-[#323030] p-4 sm:p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 animate-pulse">
          🚀 Contactez le QG des Gamers 🎮
        </h2>

        <p className="mb-2">
          <strong>Email :</strong>{" "}
          <a
            href="mailto:contact@exemple.com"
            className="text-yellow-400 hover:text-yellow-500"
          >
            gamerchallenge@play.com
          </a>
        </p>
        <p className="mb-2">
          <strong>Téléphone :</strong>{" "}
          <a
            href="tel:+33123456789"
            className="text-yellow-400 hover:text-yellow-500"
          >
            +33 1 00 00 00 00
          </a>
        </p>
        <p className="mb-4">
          <strong>Base secrète :</strong> 123 Zone 51, Niveau 2, 75000 Paris,
          France
        </p>

        {/* Socials links */}
        <div className="flex justify-center gap-4 sm:gap-6 mb-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-lg sm:text-xl"
          >
            <span className="font-bold">FB</span>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600 text-lg sm:text-xl"
          >
            <span className="font-bold">TW</span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-800 text-lg sm:text-xl"
          >
            <span className="font-bold">IG</span>
          </a>
        </div>

        <div className="mt-6 text-xs sm:text-sm text-gray-200">
          <p>💥 Envoyez vos messages directement au support du Commandant !</p>
          <p>⚡ Ou faites un tour en utilisant nos liens !</p>
        </div>
      </div>
    </div>
  );
};

export default PageContact;
