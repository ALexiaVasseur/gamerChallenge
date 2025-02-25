/* eslint-disable react/prop-types */
import { useState } from "react";

const ModalConnexion = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!email || !password || (!isLogin && (!pseudo || !confirmPassword || !description))) {
      setErrorMessage("Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    const body = {
      email,
      password,
      ...(isLogin ? {} : { pseudo, confirmPassword, description }),
    };

    const url = isLogin
      ? "http://localhost:3000/api/auth/login"
      : "http://localhost:3000/api/auth/signup";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });
      
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("✅ Connexion réussie !");

        localStorage.setItem("user", JSON.stringify(data.user));
        
      
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 2000);
      }
      
    } catch (error) {
      setErrorMessage("Impossible de se connecter au serveur.");
      console.error("❌ Erreur réseau :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-40 backdrop-blur-lg transition-opacity duration-300">
      

      <div className="bg-[#222] text-white p-6 rounded-lg shadow-lg w-[400px] relative animate-fadeIn">
{successMessage && (
  <div className="mb-6 p-4 text-green-500 bg-green-100 rounded-md text-center">
    {successMessage}
  </div>
)}

        <h2 className="text-3xl font-bold text-center mb-4">
          {isLogin ? "Connexion" : "Inscription"}
        </h2>

        {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <>
            <input
              type="text"
              placeholder="Pseudo"
              className="p-2 rounded bg-gray-300 text-black"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              name="pseudo" // Ajouté pour le remplissage automatique
              autoComplete="username" // Ajouté pour le remplissage automatique
            />
            <textarea
                placeholder="Décrivez-vous en quelques mots..."
                className="p-2 rounded bg-gray-300 text-black h-20 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                name="description-pseudo" // Ajouté pour le remplissage automatique
              />
            </>
          )}
          <input
            type="email"
            placeholder="Adresse mail"
            className="p-2 rounded bg-gray-300 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email" // Ajouté pour le remplissage automatique
            autoComplete="email" // Ajouté pour le remplissage automatique
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="p-2 rounded bg-gray-300 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password" // Ajouté pour le remplissage automatique
            autoComplete="new-password" // Ajouté pour le remplissage automatique
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirmer votre mot de passe"
              className="p-2 rounded bg-gray-300 text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="confirmPassword" // Ajouté pour le remplissage automatique
              autoComplete="new-password" // Ajouté pour le remplissage automatique
            />
          )}

          <button
            type="submit"
            className="bg-[rgba(159,139,32,0.7)] hover:bg-[rgba(159,139,32,1)] text-white py-2 rounded font-semibold disabled:bg-gray-500"
            disabled={loading}
          >
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <span
            className="text-yellow-400 cursor-pointer"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage(""); 
            }}
          >
            {isLogin ? "S'inscrire" : "Se connecter"}
          </span>
        </p>

        <button onClick={onClose} className="absolute top-2 right-2 text-white text-lg">
          ✖
        </button>
      </div>
    </div>
  );
};

export default ModalConnexion;