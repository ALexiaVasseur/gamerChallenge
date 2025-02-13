import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

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
    const [successMessage, setSuccessMessage] = useState(""); // Message de succès
    const navigate = useNavigate(); // Hook pour la redirection

    // Vérifier si l'utilisateur est connecté dès le rendu de la page
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            // Redirige l'utilisateur vers la page de connexion si non connecté
            navigate("/login");
        }
    }, [navigate]);

    // Récupérer les jeux depuis l'API
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/games");
                const data = await response.json();
                if (response.ok) {
                    setGamesList(data);
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
        setSearchQuery(query);
    
        // Vérifier que la liste des jeux contient bien le champ title
        const filtered = gamesList.filter((game) =>
            game.title.toLowerCase().includes(query.toLowerCase())
        );
        
        setFilteredGames(filtered);
    };
    

    // Sélection d'un jeu dans la liste filtrée
    const handleGameSelect = (game) => {
        setChallenge({ ...challenge, game: game.id }); // Assurez-vous que c'est bien `id`
        setSearchQuery(game.title); // Utilisation de `title`
        setFilteredGames([]);
    };
    
    

    // Mise à jour du formulaire
    const handleChange = (e) => {
        setChallenge({ ...challenge, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const userData = localStorage.getItem("user");
        if (!userData) {
            alert("Utilisateur non connecté.");
            navigate("/login"); // Redirige vers la page de login si l'utilisateur n'est pas connecté
            return;
        }
    
        const challengeData = {
            title: challenge.title,
            type: challenge.type,
            description: challenge.description,
            rules: challenge.rules,
            video_url: challenge.videoUrl,
            game_id: challenge.game,
            account_id: JSON.parse(userData).id, // Ajout dynamique de l'ID utilisateur
        };
    
        try {
            const response = await fetch("http://localhost:3000/api/challenge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(challengeData),
            });
    
            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(data.message || "Challenge créé avec succès.");
            } else {
                alert(data.message || "Erreur lors de la création du challenge.");
            }
        } catch (error) {
            console.error("Erreur API:", error);
            alert("Erreur lors de la création du challenge.");
        }
    };
    
    

    return (
        
        <div className="flex justify-center items-center min-h-screen text-white px-4">
            <div className="w-[70rem] max-w-5xl bg-opacity-60 p-14 rounded-lg shadow-xl">
                <h2 className="text-4xl font-mono mb-8 text-center">Créer votre challenge</h2>

                {/* Message de succès */}
                {successMessage && (
                    <div className="mb-6 p-4 text-green-500 bg-green-100 rounded-md">
                        {successMessage}
                    </div>
                )}

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
                                <ul className="bg-[rgba(48,46,46,0.5) p-2 rounded-md max-h-40 overflow-auto mt-2">
                                    {filteredGames.map((game, index) => (
                                        <li
                                            key={index}
                                            className="cursor-pointer hover:bg-gray-600 p-2 text-white"
                                            onClick={() => handleGameSelect(game)}
                                        >
                                            {game.title} {/* Affiche le nom du jeu */}
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
