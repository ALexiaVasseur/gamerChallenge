/* eslint-disable no-unused-vars */
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Profile from './pages/UserPage';
import CategoriesPage from './pages/CategoriesPage';
import NotFoundPage from './pages/404';
import CreateChallengePage from './pages/CreateChallengePage'
import LeaderBoard from './pages/LeaderBoard';
import ChallengePage from './pages/ChallengePage'
import GameList from './pages/GamesPage';
import ContactPage from './pages/ContactPage';
import PolitiqueConfidentialite from './pages/PolitiqueConfid';
import MentionsLegales from './pages/MentionsLegales';

const App = () => {
  return (
      <>

        <main>
        
          <Routes>
            {/* Route vers la page d'accueil */}
            <Route path="/" element={<HomePage />} />
            
            {/* Route vers la page de profil, accessible uniquement si l'utilisateur est connecté */}
            <Route path="/profile" element={<Profile />} />
            
            
            <Route path="/category/:id" element={<CategoriesPage />} />

            {/* Définir la route pour la page de création de challenge */}
            <Route path="/create-challenge" element={<CreateChallengePage />} />


            <Route path="/leaderboard" element={<LeaderBoard />} />

            {/* Route pour la page 404 */}
            <Route path="*" element={<NotFoundPage />} />

            <Route path="/challenge/:id" element={<ChallengePage />} />

            <Route path="/externals/games" element={<GameList />} />

            <Route path="/contact" element={<ContactPage />} />

            <Route path="/politique" element={<PolitiqueConfidentialite />} />

            <Route path="/mentions" element={<MentionsLegales />} />
            
          </Routes>
          
        </main>

      </>

  );
};

export default App;

