

const MentionsLegales = () => {
  return (
    <div className="text-white p-8 min-h-screen flex items-center justify-center">
      <div className="bg-[#323030] p-8 rounded-lg shadow-lg max-w-2xl w-full text-center">
        <h2 className="text-3xl font-extrabold mb-6">📜 Mentions Légales</h2>

        <p className="mb-4 text-gray-300">
          Bienvenue sur <strong>Nom de la plateforme</strong>, une plateforme dédiée aux gamers passionnés ! 🚀
        </p>

        <h3 className="text-xl font-bold text-yellow-400 mb-2">Éditeur du site</h3>
        <p className="mb-4 text-gray-400">
          <strong>Nom de la société :</strong> Gaming Corp<br />
          <strong>Adresse :</strong> 123 Zone 51, Niveau 2, 75000 Paris, France<br />
          <strong>Email :</strong> <a href="mailto:contact@exemple.com" className="text-yellow-400 hover:text-yellow-500">contact@exemple.com</a>
        </p>

        <h3 className="text-xl font-bold text-yellow-400 mb-2">Hébergement</h3>
        <p className="mb-4 text-gray-400">
          <strong>Hébergeur :</strong> ServerX Gaming Cloud<br />
          <strong>Adresse :</strong> 42 Rue des Serveurs, 75000 Paris, France
        </p>

        <h3 className="text-xl font-bold text-yellow-400 mb-2">Propriété intellectuelle</h3>
        <p className="mb-4 text-gray-400">
          Tous les contenus présents sur ce site (textes, images, logos) sont protégés par le droit d’auteur. Toute reproduction est interdite sans autorisation préalable. 🎮
        </p>

        <p className="text-sm text-gray-500 mt-6">📅 Dernière mise à jour : Février 2025</p>
      </div>
    </div>
  );
};

export default MentionsLegales;
