// App.jsx
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Profile from './pages/UserPage';
import CategoriesPage from './pages/CategoriesPage';
import NotFoundPage from './pages/404';
import CreateChallengePage from './pages/CreateChallengePage';
import LeaderBoard from './pages/LeaderBoard';
import ChallengePage from './pages/ChallengePage';
import GameList from './pages/GamesPage';
import ContactPage from './pages/ContactPage';
import PolitiqueConfidentialite from './pages/PolitiqueConfid';
import MentionsLegales from './pages/MentionsLegales';
import ChallengesPage from './pages/ChallengesPage';
import { WebSocketProvider } from "./components/WebSocketContext"; // Assurez-vous que le chemin est correct
import PrivateChat from './components/PrivateChat'; 

const App = () => {
  return (
    <>
      <WebSocketProvider>  {/* ✅ Ajout du WebSocketProvider ici */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/category/:id" element={<CategoriesPage />} />
            <Route path="/create-challenge" element={<CreateChallengePage />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/challenge/:id" element={<ChallengePage />} />
            <Route path="/externals/games" element={<GameList />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/politique" element={<PolitiqueConfidentialite />} />
            <Route path="/mentions" element={<MentionsLegales />} />
            <Route path="/challenges" element={<ChallengesPage />} />
          </Routes>
        </main>
        <PrivateChat />
      </WebSocketProvider>
    </>
  );
};

export default App;
