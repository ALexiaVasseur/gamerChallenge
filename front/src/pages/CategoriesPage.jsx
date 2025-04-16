import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BaseChallenge from '../components/BaseChallenge';

const CategoriesPage = () => {
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState(null); 
  const [loading, setLoading] = useState(true);        
  const [error, setError] = useState(null);  
  const apiUrl = import.meta.env.VITE_API_URL;     

  useEffect(() => {
    const fetchCategoryData = async () => {
      window.dispatchEvent(new Event("userChanged"));
      try {
        const response = await fetch(`${apiUrl}/category/${id}`);
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
  }, [id, apiUrl]);

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
      title={categoryData.name} 
      name_button={`Voir les challenges de la catégorie ${categoryData.name}`}
      section_title="Les challenges"
      challengesList={categoryData.challenges} 
    >

      <p className='text-2xl text-[#898989] mb-8'>
        {categoryData.description} 
      </p>
    </BaseChallenge>
  );
};

export default CategoriesPage;
