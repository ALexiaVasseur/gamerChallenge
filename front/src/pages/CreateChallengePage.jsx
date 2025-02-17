import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

export default function CreateChallengePage() {
    const [challenge, setChallenge] = useState({
        title: "",
        description: "",
        rules: "",
        imageUrl: "",
        game: "",
        category_id: "" // Champ pour la catégorie
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredGames, setFilteredGames] = useState([]);
    const [gamesList, setGamesList] = useState([]);
    const [categories, setCategories] = useState([]); // Pour stocker les catégories
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
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

    // Récupérer les catégories depuis l'API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/categories");
                const data = await response.json();
                if (response.ok) {
                    setCategories(data);
                } else {
                    console.error("Erreur lors de la récupération des catégories");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories :", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const filtered = gamesList.filter((game) =>
            game.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredGames(filtered);
    };

    const handleGameSelect = (game) => {
        setChallenge({ ...challenge, game: game.id });
        setSearchQuery(game.title);
        setFilteredGames([]);
    };

    const handleChange = (e) => {
        setChallenge({ ...challenge, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const userData = localStorage.getItem("user");
        if (!userData) {
            alert("Utilisateur non connecté.");
            navigate("/login");
            return;
        }

        const challengeData = {
            title: challenge.title,
            description: challenge.description,
            rules: challenge.rules,
            image_url: challenge.imageUrl,
            game_id: Number(challenge.game),
            category_id: Number(challenge.category_id),
            account_id: JSON.parse(userData).id,
            type: "default", // ou la valeur par défaut que vous souhaitez
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

                {successMessage && (
                    <div className="mb-6 p-4 text-green-500 bg-green-100 rounded-md">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Titre */}
                    <div>
                        <input
                            type="text"
                            name="title"
                            placeholder="Titre"
                            value={challenge.title}
                            onChange={handleChange}
                            className="w-full p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
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

                    {/* URL de l'image */}
                    <input
                        type="text"
                        name="imageUrl"
                        placeholder="Image URL"
                        value={challenge.imageUrl}
                        onChange={handleChange}
                        className="w-full p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                    />

                    {/* Sélection du jeu */}
                    <div className="relative">
                        <input
                            type="text"
                            name="game"
                            placeholder="Rechercher un jeu"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                        />
                        {filteredGames.length > 0 && (
                            <ul className="bg-[rgba(48,46,46,0.5)] p-2 rounded-md max-h-40 overflow-auto mt-2">
                                {filteredGames.map((game, index) => (
                                    <li
                                        key={index}
                                        className="cursor-pointer hover:bg-gray-600 p-2 text-white"
                                        onClick={() => handleGameSelect(game)}
                                    >
                                        {game.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Sélection de la catégorie */}
                    <div className="relative">
                        <select
                            name="category_id"
                            value={challenge.category_id}
                            onChange={handleChange}
                            className="w-full p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
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
