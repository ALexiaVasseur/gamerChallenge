/* eslint-disable no-unused-vars */
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChallengeCard from './components/ChallengeCard';
import HomePage from './pages/HomePage';
import Profile from './pages/UserPage';
import CategoriesPage from './pages/CategoriesPage';
import CreateChallengePage from './pages/CreateChallengePage'

const App = () => {
  const [user, setUser] = useState(null);  // Si tu veux gérer l'état de l'utilisateur ici aussi

  return (
      <>

        <main>
        
          <Routes>
            {/* Route vers la page d'accueil */}
            <Route path="/" element={<HomePage />} />
            
            {/* Route vers la page de profil, accessible uniquement si l'utilisateur est connecté */}
            <Route path="/profile" element={<Profile />} />
            
            
            <Route path="/category/:type" element={<CategoriesPage />} />

            {/* Définir la route pour la page de création de challenge */}
            <Route path="/create-challenge" element={<CreateChallengePage />} />
          </Routes>
          
        </main>

      </>

  );
};

export default App;

