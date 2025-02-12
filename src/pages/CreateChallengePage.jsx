import { useState, useEffect } from "react";

export default function CreateChallengePage() {
    const [challenge, setChallenge] = useState({
        title: "",
        type: "",
        description: "",
        rules: "",
        videoUrl: "",
        game: ""
    });

    const [searchQuery, setSearchQuery] = useState(""); // Recherche utilisateur
    const [filteredGames, setFilteredGames] = useState([]); // Jeux filtrés
    const [gamesList, setGamesList] = useState([]); // Liste des jeux

    // Récupérer les jeux depuis l'API
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/games");
                const data = await response.json();
                if (response.ok) {
                    setGamesList(data); // Met à jour la liste des jeux
                } else {
                    console.error("Erreur lors de la récupération des jeux");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des jeux :", error);
            }
        };

        fetchGames();
    }, []);

    // Fonction de recherche de jeu
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query); // Met à jour la requête de recherche

        // Filtrer les jeux en fonction de la recherche
        const filtered = gamesList.filter((game) =>
            game.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredGames(filtered); // Met à jour la liste des jeux filtrés
    };

    // Sélection d'un jeu dans la liste filtrée
    const handleGameSelect = (game) => {
        setChallenge({ ...challenge, game: game.id }); // Met à jour l'état avec le jeu sélectionné
        setSearchQuery(game.name); // Remplace le texte de la recherche par le nom du jeu
        setFilteredGames([]); // Vide la liste des jeux filtrés
    };

    // Mise à jour du formulaire
    const handleChange = (e) => {
        setChallenge({ ...challenge, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Challenge créé :", challenge);

        const challengeData = {
            title: challenge.title,
            type: challenge.type,
            description: challenge.description,
            rules: challenge.rules,
            video_url: challenge.videoUrl,
            game_id: challenge.game, // Assurez-vous que l'ID du jeu est envoyé
            account_id: 1, // Utilisez l'ID de l'utilisateur actuel
        };

        try {
            const response = await fetch("http://localhost:3000/api/challenge", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(challengeData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Challenge créé avec succès", data);
                alert(data.message || "Challenge créé avec succès.");
            } else {
                console.error("Erreur de création de challenge", data);
                alert(data.message || "Erreur lors de la création du challenge.");
            }
        } catch (error) {
            console.error("Erreur lors de l'appel à l'API", error);
            alert("Erreur lors de la création du challenge.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen text-white px-4">
            <div className="w-[70rem] max-w-5xl bg-opacity-60 p-14 rounded-lg shadow-xl">
                <h2 className="text-4xl font-mono mb-8 text-center">Créer votre challenge</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Titre & Type */}
                    <div className="flex space-x-6">
                        <input
                            type="text"
                            name="title"
                            placeholder="Titre"
                            value={challenge.title}
                            onChange={handleChange}
                            className="w-1/2 p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                        />
                        <input
                            type="text"
                            name="type"
                            placeholder="Type"
                            value={challenge.type}
                            onChange={handleChange}
                            className="w-1/2 p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                        />
                    </div>

                    {/* Description */}
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={challenge.description}
                        onChange={handleChange}
                        className="w-full h-40 p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                    />

                    {/* Règles */}
                    <textarea
                        name="rules"
                        placeholder="Règles"
                        value={challenge.rules}
                        onChange={handleChange}
                        className="w-full h-40 p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                    />

                    {/* Vidéo URL & Jeu concerné */}
                    <div className="flex space-x-6">
                        <input
                            type="text"
                            name="videoUrl"
                            placeholder="Vidéo URL"
                            value={challenge.videoUrl}
                            onChange={handleChange}
                            className="w-1/2 p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                        />
                        <div className="w-1/2 relative">
                            <input
                                type="text"
                                name="game"
                                placeholder="Rechercher un jeu"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                            />
                            {/* Affichage des résultats filtrés */}
                            {filteredGames.length > 0 && (
                                <ul className="bg-gray-700 p-2 rounded-md max-h-40 overflow-auto mt-2">
                                    {filteredGames.map((game, index) => (
                                        <li
                                            key={index}
                                            className="cursor-pointer hover:bg-gray-600 p-2"
                                            onClick={() => handleGameSelect(game)}
                                        >
                                            {game.name} {/* Affiche le nom du jeu */}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Lien ajouter un jeu */}
                    <p className="text-gray-400 text-sm">
                        Jeu non listé ? <span className="text-orange-500 cursor-pointer hover:underline">Ajoutez-le</span>
                    </p>

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        className="w-full p-3 mt-4 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-bold text-lg"
                    >
                        Créer le challenge
                    </button>
                </form>
            </div>
        </div>
    );
}
