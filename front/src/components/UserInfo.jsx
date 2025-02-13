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


            
        </>
    );
};

export default UserInfo;
