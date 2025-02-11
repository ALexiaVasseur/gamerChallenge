/* eslint-disable no-unused-vars */
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChallengeCard from './components/ChallengeCard';
import HomePage from './pages/HomePage';
import Profile from './pages/UserPage';

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
            
            {/* Si tu as d'autres pages ou fonctionnalités, tu peux les ajouter ici */}
            {/* Exemple : */}
            {/* <Route path="/other-page" element={<OtherPage />} /> */}
          </Routes>
          
        </main>

      </>

  );
};

export default App;

