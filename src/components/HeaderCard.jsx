import { useState, useEffect } from "react";
import logoGamer from "../assets/images/logo-gamer.webp";
import AuthModal from "../components/ModalConnexion";


export default function Header() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 🔹 Récupérer l'utilisateur depuis localStorage au chargement du composant
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);        

    // Fonction pour récupérer les initiales du pseudo
    const getInitials = (pseudo) => {
        return pseudo
        ? pseudo
            .split(" ")
            .map((word) => word[0].toUpperCase())
            .join("")
        : "";
    };
    
    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setIsMenuOpen(false);
    };
    return (
        <header>
            <nav className="flex justify-between items-center px-8 py-6 mb-14">
                {/* Logo à gauche */}
                <div>
                    <img src={logoGamer} alt="Logo" className="w-16 h-16 rounded-full" />
                </div>

                {/* Menu centré */}
                <div className="flex space-x-6 px-60 py-4 bg-[rgba(48,46,46,0.5)] rounded-full text-white font-mono text-3xl gap-x-52">
                    <a href="#" className="hover:text-[#9f8b20]">Menu</a>
                    <a href="#" className="hover:text-[#9f8b20]">Catégories</a>
                    <a href="#" className="hover:text-[#9f8b20]">Leaderboard</a>
                </div>

                {/* Icône Connexion / Avatar */}
                <div className="flex justify-end px-8 pt-4">
                    {user ? (
                        // Afficher le composant UserInfo si l'utilisateur est connecté
                        <div>
                            <div className="flex items-center justify-center">
                                {/* Bouton rond avec initiales */}
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold text-lg hover:bg-blue-700 transition">
                                    {getInitials(user.pseudo)}
                                </button>
                            </div>
                
                            {isMenuOpen && (
                                <div className="absolute right-5 mt-14 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Modifier mon profil
                                    </button>
                                    <button  onClick={handleLogout}
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
