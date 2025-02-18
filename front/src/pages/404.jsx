import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleHomePageRedirect = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6">
      <h1 className="text-8xl font-bold text-white">404</h1>
      <p className="text-2xl text-gray-300 mt-6">
        La page que vous cherchez a expiré ou n&apos;existe plus.
      </p>
      <button
        onClick={handleHomePageRedirect}
        className="mt-8 px-6 py-3 bg-[rgba(159,139,32,0.7)] hover:bg-[rgba(159,139,32,1)] hover:scale-102 transition-all duration-500 text-white rounded-lg shadow-lg"
      >
        Retour à l&apos;accueil
      </button>
    </div>
  );
}
