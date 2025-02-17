import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BaseChallenge from '../components/BaseChallenge';

const CategoriesPage = () => {
  const { id } = useParams();  // Récupère l'ID de la catégorie depuis l'URL
  const [categoryData, setCategoryData] = useState(null);  // Stocke les données de la catégorie
  const [loading, setLoading] = useState(true);           // État de chargement
  const [error, setError] = useState(null);               // Gestion des erreurs

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/category/${id}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données de la catégorie');
        }
        const data = await response.json();
        setCategoryData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!categoryData) {
    return <div>Aucune donnée de catégorie trouvée.</div>;
  }

  return (
    <BaseChallenge
      title={categoryData.name}  // Nom de la catégorie
      name_button={`Voir les challenges de la catégorie ${categoryData.name}`}
      section_title="Les challenges"
      challengesList={categoryData.challenges}  // Liste des challenges
    >
      {/* Description de la catégorie avec formatage similaire à la page d'accueil */}
      <p className='text-2xl text-[#898989] mb-8'>
        {categoryData.description}  {/* Ici tu insères la description de la catégorie */}
      </p>
    </BaseChallenge>
  );
};

export default CategoriesPage;
