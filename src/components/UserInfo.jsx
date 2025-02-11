import { useEffect, useState } from "react";

const UserInfo = () => {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // 🔹 Récupérer les infos utilisateur du localStorage
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
    }

    if (!user) {
        return;
    }

    return (
        <>
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
        </>
    );
};

export default UserInfo;
