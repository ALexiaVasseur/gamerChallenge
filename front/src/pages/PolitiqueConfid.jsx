const PolitiqueConfidentialite = () => {
  return (
    <div className="text-white p-4 sm:p-8 min-h-screen flex items-center justify-center">
      <div className="bg-[#323030] p-4 sm:p-8 rounded-lg shadow-lg max-w-4xl w-full text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">🔒 Politique de Confidentialité</h2>

        <p className="mb-4 text-gray-300">
          Nous attachons une grande importance à la confidentialité de vos données sur <strong>Nom de la plateforme</strong>. Voici comment nous les utilisons et les protégeons.
        </p>

        <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2">Collecte des données</h3>
        <p className="mb-4 text-gray-400">
          Nous collectons certaines informations lorsque vous utilisez notre plateforme : nom, email, préférences de jeux, etc. 🎮
        </p>

        <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2">Utilisation des données</h3>
        <p className="mb-4 text-gray-400">
          Vos informations sont utilisées pour améliorer votre expérience utilisateur, vous proposer du contenu pertinent et assurer la sécurité du site.
        </p>

        <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2">Partage des données</h3>
        <p className="mb-4 text-gray-400">
          Nous ne vendons ni ne partageons vos données personnelles avec des tiers, sauf en cas d’obligation légale ou avec votre consentement.
        </p>

        <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2">Vos droits</h3>
        <p className="mb-4 text-gray-400">
          Conformément au RGPD, vous avez un droit d’accès, de modification et de suppression de vos données personnelles. Contactez-nous pour toute demande.
        </p>

        <p className="text-xs text-gray-500 mt-6">📅 Dernière mise à jour : Février 2025</p>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialite;
