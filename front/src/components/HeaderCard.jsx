import { useState, useEffect } from "react";
import logoGamer from "../assets/images/logo-gamer.webp";
import AuthModal from "../components/ModalConnexion";
import { useNavigate } from "react-router-dom";

export default function Header() { 
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false); // État du menu Catégories
    const [categories, setCategories] = useState([]); // État pour stocker les catégories
    const navigate = useNavigate();

    // 🔹 Récupérer l'utilisateur depuis localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // 🔹 Récupérer les catégories depuis l'API
    useEffect(() => {
        fetch("http://localhost:3000/api/categories") // Assure-toi que l'URL de ton API est correcte
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des catégories");
                }
                return response.json(); // Transformation de la réponse en JSON
            })
            .then((data) => {
                setCategories(data); // Stocke les catégories dans l'état
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des catégories:", error);
            });
    }, []);

    // Fonction pour récupérer les initiales du pseudo
    const getInitials = (pseudo) => {
        return pseudo ? pseudo.substring(0, 2).toUpperCase() : "";
    };

    // Redirection vers le profil
    const handleProfileRedirect = () => {
        setIsMenuOpen(false);
        navigate("/profile");
    };

    // Redirection vers l'accueil
    const handleHomePageRedirect = () => {
        setIsMenuOpen(false);
        navigate("/");
    };

    // Déconnexion utilisateur
    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setIsMenuOpen(false);
    };

    // Sélection d'une catégorie et fermeture du menu
    const handleCategorySelect = (categoryId) => {
        navigate(`/category/${categoryId}`); // Redirige vers la page de la catégorie sélectionnée
        setIsCategoryOpen(false);
    };

    return (
        <header>
            <nav className="flex justify-between items-center px-8 py-6 mb-14">
                {/* Logo à gauche */}
                <div>
                    <img 
                        src={logoGamer} 
                        alt="Logo" 
                        className="w-16 h-16 rounded-full cursor-pointer" 
                        onClick={handleHomePageRedirect} 
                    />
                </div>

                {/* Menu centré */}
                <div className="flex space-x-6 px-60 py-4 bg-[rgba(48,46,46,0.5)] rounded-full text-white font-mono text-3xl gap-x-52">

                    {/* 🔹 Catégories - Menu déroulant */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="hover:scale-125 hover:text-[#9f8b20] transition-all duration-500"
                        >
                            Catégories ▾
                        </button>

                        {isCategoryOpen && (
                            <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-black z-10">
                                {categories.length === 0 ? (
                                    <div className="px-4 py-2 text-sm text-gray-700">Aucune catégorie disponible</div>
                                ) : (
                                    categories.map((category) => (
                                        <button 
                                            key={category.id}  // Utilisation de l'ID unique pour chaque catégorie
                                            onClick={() => handleCategorySelect(category.id)}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                                        >
                                            {category.name}  {/* Affiche le nom de la catégorie */}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <a href="/leaderboard" className="hover:scale-125 hover:text-[#9f8b20] transition-all duration-500">Leaderboard</a>
                </div>

                {/* Icône Connexion / Avatar */}
                <div className="flex justify-end px-8 pt-4">
                    {user ? (
                        <div>
                            <div className="flex items-center justify-center">
                                {/* Bouton rond avec initiales */}
                                <button 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                    className="w-20 h-20 border border-white text-white flex items-center justify-center rounded-full font-bold text-lg hover:bg-[#FF8C00] transition"
                                >
                                    {getInitials(user.pseudo)}
                                </button>
                            </div>
                
                            {isMenuOpen && (
                                <div className="absolute right-5 mt-14 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <button
                                        onClick={handleProfileRedirect}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Voir mon profil
                                    </button>
                                    <button 
                                        onClick={() => { 
                                            handleLogout(); 
                                            handleHomePageRedirect(); 
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="w-40 h-16 border border-white rounded-full flex items-center justify-center text-white font-bold hover:bg-[#FF8C00] transition"
                        >
                            Connexion
                        </button>
                    )}
                </div>
            </nav>

            {/* Modale d'authentification */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </header>
    );
}
