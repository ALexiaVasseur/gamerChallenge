import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleHomePageRedirect = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="text-xl text-gray-300 mt-4">
        La page que vous cherchez a expiré ou n&apos;existe plus.
      </p>
      <button
        onClick={handleHomePageRedirect}
        className="mt-6 px-4 py-2 bg-orange-600 text-white rounded-lg shadow-lg"
      >
        Retour à l&apos;accueil
      </button>
    </div>
  );
}
