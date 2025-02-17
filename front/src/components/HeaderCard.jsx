import { useState, useEffect } from "react";
import logoGamer from "../assets/images/logo-gamer.webp";
import AuthModal from "../components/ModalConnexion";
import { useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

export default function HeaderCard() { 
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        fetch("http://localhost:3000/api/categories")
            .then((response) => response.ok ? response.json() : Promise.reject("Erreur API"))
            .then(setCategories)
            .catch(console.error);
    }, []);

    const getInitials = (pseudo) => pseudo ? pseudo.substring(0, 2).toUpperCase() : "";

    const handleProfileRedirect = () => {
        setIsMenuOpen(false);
        navigate("/profile");
    };

    const handleHomePageRedirect = () => {
        setIsMenuOpen(false);
        navigate("/");
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setIsMenuOpen(false);
    };

    const handleCategorySelect = (categoryId) => {
        navigate(`/category/${categoryId}`);
        setIsCategoryOpen(false);
    };

    return (
        <header className="top-0 left-0 w-full h-16 sm:h-20 lg:h-24 flex flex-col justify-center bg-[rgba(48,46,46,0.9)] z-50">
            <nav className="relative flex justify-between items-center px-6 py-4 w-full max-w-screen-xl mx-auto">
                
                {/* Logo */}
                <div>
                    <img 
                        src={logoGamer} 
                        alt="Logo" 
                        className="w-14 h-14 rounded-full cursor-pointer" 
                        onClick={handleHomePageRedirect} 
                    />
                </div>

                {/* MENU NAVIGATION - Desktop */}
                <div className="hidden sm:flex space-x-40 px-10 py-2 text-white text-xl">
                    <div className="relative">
                        <button 
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="hover:scale-110 hover:text-[#9f8b20] transition-all duration-500"
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
                                            key={category.id}  
                                            onClick={() => handleCategorySelect(category.id)}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                                        >
                                            {category.name}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                    <a href="/leaderboard" className="hover:scale-110 hover:text-[#9f8b20] transition-all duration-500">Leaderboard</a>
                </div>

                {/* Icône Connexion / Avatar - Desktop */}
                <div className="hidden sm:flex items-center">
                    {user ? (
                        <div className="relative">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                className="w-16 h-16 border border-white text-white flex items-center justify-center rounded-full font-bold text-lg hover:bg-[#FF8C00] transition"
                            >
                                {getInitials(user.pseudo)}
                            </button>

                            {/* Menu déroulant utilisateur */}
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
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
                            className="w-40 h-16 border border-white rounded-full flex items-center justify-center text-white font-bold hover:bg-[#FF8C00] transition hidden sm:flex"
                        >
                            Connexion
                        </button>
                    )}
                </div>

                {/* Menu Burger - Mobile */}
                <div className="sm:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <AiOutlineClose size={30} color="white" /> : <AiOutlineMenu size={30} color="white" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden flex flex-col items-center py-6 bg-[rgba(48,46,46,0.9)] text-white text-xl space-y-6">
                    <a href="/" onClick={() => setIsMobileMenuOpen(false)}>Accueil</a>
                    <a href="/leaderboard" onClick={() => setIsMobileMenuOpen(false)}>Leaderboard</a>
                    {user ? (
                        <>
                            <button onClick={handleProfileRedirect} className="text-white">Mon Profil</button>
                            <button onClick={handleLogout} className="text-white">Déconnexion</button>
                        </>
                    ) : (
                        <button onClick={() => setIsAuthModalOpen(true)} className="text-white border border-white rounded-full px-6 py-3">
                            Connexion
                        </button>
                    )}
                </div>
            )}

            {/* Modale d'authentification */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </header>
    );
}
