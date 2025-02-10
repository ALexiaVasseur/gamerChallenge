import { useState } from "react";
import logoGamer from "../assets/images/logo-gamer.webp";
import AuthModal from "../components/ModalConnexion";

export default function Header() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <header>
            <div>
                {/* Navbar */}
                <nav className="flex justify-between items-center px-8 py-6 mb-14">
                    {/* Logo à gauche */}
                    <div>
                        <img src={logoGamer} alt="Logo" className="w-16 h-16 rounded-full" />
                    </div>

                    {/* menu centré avec fond arrondi */}
                    <div className="flex space-x-6 px-60 py-4 bg-[rgba(48,46,46,0.5)] rounded-full text-white font-mono text-3xl gap-x-52">
                        <a href="#" className="hover:text-[#9f8b20]">Menu</a>
                        <a href="#" className="hover:text-[#9f8b20]">Catégories</a>
                        <a href="#" className="hover:text-[#9f8b20]">Leaderboard</a>
                    </div>

                    {/*connexion / inscription */}
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-40 h-16 border border-white rounded-full flex items-center justify-center text-white font-bold hover:bg-[#FF8C00] transition"
                    >
                        Connexion
                    </button>
                </nav>
            </div>

            {/* modale d'authentification */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </header>
    );
}
