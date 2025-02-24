import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

export default function CreateChallengePage() {
    const [challenge, setChallenge] = useState({
        title: "",
        description: "",
        rules: "",
        image_url: "",
        game: "",
        type: "",
        category_id: "",
        video_url: ""
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredGames, setFilteredGames] = useState([]);
    const [gamesList, setGamesList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const isValidUrl = (url) => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
        return youtubeRegex.test(url);
    };

    useEffect(() => {
        window.dispatchEvent(new Event("userChanged"));
        const userData = localStorage.getItem("user");
        if (!userData) {
            navigate("/login");
        }
    }, [navigate]);

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

    useEffect(() => {
        const fetchExternalGames = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/freetogames");
                const data = await response.json();
                if (response.ok) {
                    setGamesList(prevGames => [...prevGames, ...data]);
                } else {
                    console.error("Erreur lors de la récupération des jeux externes");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des jeux externes :", error);
            }
        };

        fetchExternalGames();
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    
        const filtered = gamesList.filter((game) =>
            game.title.toLowerCase().includes(query.toLowerCase())
        );
    
        setFilteredGames(filtered.slice(0, 20));
    };

    const handleGameSelect = (game) => {
        setChallenge({ ...challenge, game: game.id, image_url: game.thumbnail }); 
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

        if (!challenge.game || challenge.game <= 0) {
            alert("Veuillez sélectionner un jeu valide.");
            return;
        }
    
        if (challenge.video_url && !isValidUrl(challenge.video_url)) {
            alert("L'URL de la vidéo YouTube n'est pas valide. Veuillez utiliser un lien YouTube valide.");
            return;
        }

        const challengeData = {
            title: challenge.title,
            description: challenge.description,
            rules: challenge.rules,
            image_url: challenge.image_url,
            game_id: Number(challenge.game),
            category_id: Number(challenge.category_id),
            account_id: JSON.parse(userData).id,
            type: challenge.type || "default",
            video_url : challenge.video_url
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
                window.scrollTo(0, 0);
            } else {
                alert(data.message || "Erreur lors de la création du challenge.");
            }
        } catch (error) {
            console.error("Erreur API:", error);
            alert("Erreur lors de la création du challenge.");
        }
    };
    
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
                navigate("/");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [successMessage, navigate]);

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

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={challenge.description}
                        onChange={handleChange}
                        className="w-full h-40 p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                    />

                    <textarea
                        name="rules"
                        placeholder="Règles"
                        value={challenge.rules}
                        onChange={handleChange}
                        className="w-full h-40 p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                    />

                    <input
                        type="text"
                        name="video_url"
                        placeholder="URL de la vidéo du jeu YouTube"
                        className="w-full p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                        value={challenge.video_url}
                        onChange={handleChange}
                        
                    />
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
                                        key={`${game.id}-${index}`}
                                        className="cursor-pointer hover:bg-gray-600 p-2 text-white"
                                        onClick={() => handleGameSelect(game)}
                                    >
                                        {game.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {challenge.image_url && (
                        <div className="mt-4">
                            <img src={challenge.image_url} alt="Game Thumbnail" className="w-full h-auto rounded-md" />
                        </div>
                    )}

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

                    <p className="text-gray-400 text-sm">
                        Jeu non listé ? <span className="text-orange-500 cursor-pointer hover:underline">Ajoutez-le</span>
                    </p>

                    <button
                        type="submit"
                        className="w-full p-3 mt-4 bg-[rgba(159,139,32,0.7)] hover:bg-[rgba(159,139,32,0.9)] rounded-lg text-white font-bold text-lg"
                    >
                        Créer le challenge
                    </button>
                </form>
            </div>
        </div>
    );
}
