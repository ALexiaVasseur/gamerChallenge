import { useState, useEffect, useRef } from "react";
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
  const menuRef = useRef(null);
  

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    updateUser();
    window.addEventListener("userChanged", updateUser);

    return () => {
      window.removeEventListener("userChanged", updateUser);
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL; // Récupère l'URL de l'API depuis les variables d'environnement
        const response = await fetch(`${apiUrl}/api/auth/check`, {
          credentials: "include",
        });
  
        if (!response.ok) {
          console.warn("Token expiré, déconnexion...");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("userChanged"));
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
      }
    };
  
    const initialTimeout = setTimeout(() => {
      checkAuth();
  
      const intervalId = setInterval(() => {
        checkAuth();
      }, 5000);
  
      return () => clearInterval(intervalId);
    }, 3000);
  
    return () => clearTimeout(initialTimeout);
  }, []);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL; // Récupère l'URL de l'API depuis les variables d'environnement

    fetch(`${apiUrl}/categories`)
      .then((response) =>
        response.ok ? response.json() : Promise.reject("Erreur API")
      )
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitials = (pseudo) =>
    pseudo ? pseudo.substring(0, 2).toUpperCase() : "";

  const handleProfileRedirect = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const userInformations = JSON.parse(userData);
      if (userInformations.id) {
        setIsMenuOpen(false);
        navigate("/profile");
      } else {
        alert("ID utilisateur invalide !");
      }
    } else {
      alert("Vous devez être connecté pour accéder à votre profil !");
    }
  };
  

  const handleHomePageRedirect = () => {
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    setUser(null);
    setIsMenuOpen(false);
  };

  const handleCategorySelect = (categoryId) => {
    navigate(`/category/${categoryId}`);
    setIsCategoryOpen(false);
  };

  return (
    <header className="relative top-0 left-0 w-full h-16 sm:h-20 lg:h-24 flex flex-col justify-center bg-[rgba(48,46,46,0.9)] z-50">
      <nav className="relative flex justify-between items-center px-6 py-4 w-full max-w-screen-xl mx-auto">
        <div>
          <img
            src={logoGamer}
            alt="Logo"
            className="w-14 h-14 rounded-full cursor-pointer"
            onClick={handleHomePageRedirect}
          />
        </div>

        <div className="hidden lg:flex space-x-20 px-10 py-2 text-white text-xl">
        <a
            href="/challenges"
            className="hover:scale-110 hover:text-[#9f8b20] transition-all duration-500"
          >
            Challenges
          </a>
        <div className="relative">
          
        <div
            className="hover:scale-110 hover:text-[#9f8b20] transition-all duration-500 cursor-pointer"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
          Catégories ▾
        </div>

            {isCategoryOpen && (
              <div className="absolute mt-2 w-48 bg-[#2a2a2a] rounded-md shadow-lg py-1 text-white z-20">
                {categories.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Aucune catégorie disponible
                  </div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-white hover:text-[#FFD700] transition-all duration-300"
                    >
                      {category.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          
          
          <a
            href="/externals/games"
            className="hover:scale-110 hover:text-[#9f8b20] transition-all duration-500"
          >
            Games
          </a>

          <a
            href="/leaderboard"
            className="hover:scale-110 hover:text-[#9f8b20] transition-all duration-500"
          >
            Leaderboard
          </a>
        </div>

        <div className="hidden lg:flex items-center">
          {user ? (
            <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-16 h-16 border border-white text-white flex items-center justify-center rounded-full font-bold text-lg hover:bg-[rgba(159,139,32,0.7)] transition"
          >
            {getInitials(user.pseudo)}
          </button>

              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
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
              className="w-40 h-16 border border-white rounded-full flex items-center justify-center text-white font-bold hover:bg-[rgba(159,139,32,0.7)] transition hidden lg:flex"
            >
              Connexion
            </button>
          )}
        </div>

        <div className="lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <AiOutlineClose size={30} color="white" />
            ) : (
              <AiOutlineMenu size={30} color="white" />
            )}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="lg:hidden flex flex-col items-center py-6 bg-[rgba(48,46,46,0.9)] text-white text-xl space-y-6 absolute top-16 left-0 w-full z-40"
        >
          <a href="/" onClick={() => setIsMobileMenuOpen(false)}>
            Accueil
          </a>
          

          <a href="/challenges" onClick={() => setIsMobileMenuOpen(false)}>
            Challenges
          </a>
          

          <div
            className="relative w-full text-center"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <div className="w-full py-2 text-white hover:text-[#9f8b20] transition-all duration-500 cursor-pointer">
              Catégories ▾
            </div>

            {isCategoryOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-[#2a2a2a] rounded-md shadow-lg py-1 text-white z-20">
                {categories.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Aucune catégorie disponible
                  </div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-[#2a2a2a] hover:text-[#FFD700] transition-all duration-300"
                    >
                      {category.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
            <a
            href="/externals/games"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Games
          </a>
          <a
            href="/leaderboard"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Leaderboard
          </a>

          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className="text-white"
            >
              Mon Profil
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="text-white border border-white rounded-full px-6 py-3"
            >
              Connexion
            </button>
          )}
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
