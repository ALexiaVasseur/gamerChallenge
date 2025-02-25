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

const App = () => {
  return (
    <>
      <main>
        <Routes>
          {/* Route to the home page */}
          <Route path="/" element={<HomePage />} />

          {/* Route to the profile page, accessible only if the user is logged in */}
          <Route path="/profile" element={<Profile />} />

          {/* Route to a specific category page */}
          <Route path="/category/:id" element={<CategoriesPage />} />

          {/* Route to the challenge creation page */}
          <Route path="/create-challenge" element={<CreateChallengePage />} />

          {/* Route to the leaderboard page */}
          <Route path="/leaderboard" element={<LeaderBoard />} />

          {/* Route for the 404 error page */}
          <Route path="*" element={<NotFoundPage />} />

          {/* Route to a specific challenge page */}
          <Route path="/challenge/:id" element={<ChallengePage />} />

          {/* Route to the game list page */}
          <Route path="/externals/games" element={<GameList />} />

          {/* Route to the contact page */}
          <Route path="/contact" element={<ContactPage />} />

          {/* Route to the privacy policy page */}
          <Route path="/politique" element={<PolitiqueConfidentialite />} />

          {/* Route to the legal mentions page */}
          <Route path="/mentions" element={<MentionsLegales />} />

          <Route path="/challenges" element={<ChallengesPage />} />

        </Routes>
      </main>
    </>
  );
};

export default App;
