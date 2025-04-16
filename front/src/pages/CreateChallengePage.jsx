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
        video_url: "",
        is_external: false // Indication if the game is external
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredGames, setFilteredGames] = useState([]);
    const [gamesList, setGamesList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedGameImage, setSelectedGameImage] = useState(null); // State for selected game image
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL; // Utilise la variable d'environnement


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
                const response = await fetch(`${apiUrl}/games`);
                const data = await response.json();
                if (response.ok) {
                    setGamesList(data);
                } else {
                    console.error("Error fetching games");
                }
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        };

        fetchGames();
    }, [apiUrl]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${apiUrl}/categories`);
                const data = await response.json();
                if (response.ok) {
                    setCategories(data);
                } else {
                    console.error("Error fetching categories");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [apiUrl]);

    useEffect(() => {
        const fetchExternalGames = async () => {
            try {
                const response = await fetch(`${apiUrl}/freetogames`);
                const data = await response.json();
                if (response.ok) {
                    const validGames = data.filter(game => game.thumbnail && isValidUrl(game.thumbnail));
                    setGamesList(prevGames => [...prevGames, ...validGames]);
                } else {
                    console.error("Error fetching external games");
                }
            } catch (error) {
                console.error("Error fetching external games:", error);
            }
        };

        fetchExternalGames();
    }, [apiUrl]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    
        const filtered = gamesList.filter((game) =>
            game.title.toLowerCase().includes(query.toLowerCase())
        );
    
        setFilteredGames(filtered.slice(0, 20));
    };

    const handleGameSelect = (game) => {
        setChallenge(prevChallenge => ({
            ...prevChallenge,
            game: game.id,
            video_url: game.video_url || "", // Automatically set video URL if available
            is_external: !game.thumbnail // Detect if the game comes from the external API
        }));
        setSelectedGameImage(game.thumbnail); // Set the selected game image
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
            alert("User not logged in.");
            navigate("/login");
            return;
        }
    
        if (!challenge.game || challenge.game <= 0) {
            alert("Please select a valid game.");
            return;
        }
    
        // Check that the URLs are valid
        if (!isValidUrl(challenge.image_url)) {
            alert("The image URL must be valid.");
            return;
        }
    
        if (challenge.is_external && !isValidUrl(challenge.video_url)) {
            alert("The video URL must be valid.");
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
            video_url: challenge.video_url || "", // Ensure this is an empty string if no video
        };
    
        try {
            const response = await fetch(`${apiUrl}/challenge`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(challengeData),
            });
    
            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("Challenge créé avec succès."); // Success message updated
                window.scrollTo(0, 0);
            } else {
                alert(data.message || "Error creating the challenge.");
            }
        } catch (error) {
            console.error("API error:", error);
            alert("Error creating the challenge.");
        }
    };
    
    // URL validation function
    function isValidUrl(url) {
        const regex = /^(ftp|http|https):\/\/[^ "]+$/;
        return regex.test(url);
    }
    
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
                    <input
                        type="text"
                        name="title"
                        placeholder="Titre"
                        value={challenge.title}
                        onChange={handleChange}
                        className="w-full p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                    />

                    <input
                        type="text"
                        name="image_url"
                        placeholder="URL de l'image du challenge"
                        value={challenge.image_url}
                        onChange={handleChange}
                        className="w-full p-4 rounded-md bg-white text-black border border-gray-500 placeholder-gray-500 text-lg"
                    />

                    {challenge.image_url && isValidUrl(challenge.image_url) && (
                        <div className="mt-4 flex justify-center">
                            <img
                                src={challenge.image_url}
                                alt="Aperçu de l'image du challenge"
                                className="w-full max-w-[300px] h-auto max-h-[200px] object-cover rounded-md shadow-md"
                            />
                        </div>
                    )}

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
                                {filteredGames.map((game) => (
                                    <li
                                        key={game.id}
                                        className="cursor-pointer hover:bg-gray-600 p-2 text-white"
                                        onClick={() => handleGameSelect(game)}
                                    >
                                        {game.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Display the selected game's image below the game selection */}
                    {selectedGameImage && (
                        <div className="mt-4 flex justify-center">
                            <img
                                src={selectedGameImage}
                                alt="Image du jeu sélectionné"
                                className="w-full max-w-[300px] h-auto max-h-[200px] object-cover rounded-md shadow-md"
                            />
                        </div>
                    )}

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

                    <button type="submit" className="w-full p-3 mt-4 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white font-bold text-lg">
                        Créer le challenge
                    </button>
                </form>
            </div>
        </div>
    );
}
