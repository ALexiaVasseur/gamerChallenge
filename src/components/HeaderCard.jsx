import logoGamer from '../assets/images/logo-gamer.webp';

export default function Header() {
    return (
        <header>
            <div>
                {/* Navbar */}
                <nav className="flex justify-between items-center px-8 py-6 mb-14">
                {/* Logo à gauche */}
                    <div>
                        <img src={logoGamer} alt="Logo" className="w-16 h-16 rounded-full" />
                    </div>

                    {/* Menu centré avec fond arrondi */}
                    <div className="flex space-x-6 px-60 py-4 bg-[rgba(48,46,46,0.5)] rounded-full text-white font-mono text-3xl gap-x-52">
                        <a href="#" className="hover:text-[#9f8b20]">Menu</a>
                        <a href="#" className="hover:text-[#9f8b20]">Catégories</a>
                        <a href="#" className="hover:text-[#9f8b20]">Leaderboard</a>
                    </div>

                    {/* Profil à droite */}
                    <div className="w-16 h-16 border border-white rounded-full flex items-center justify-center text-white font-bold">
                        CH
                    </div>
                </nav>
            </div>
        </header>
    )
};