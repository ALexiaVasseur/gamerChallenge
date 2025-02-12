import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BaseChallenge from '../components/BaseChallenge' 
const CategoriesPage = () => {
    const { type } = useParams();
    const [challenges, setChallenges] = useState([]);

    useEffect(() => {
        const fetchChallenges = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/challenges/category/${type}`);
            const data = await response.json();
            console.log(data)

            setChallenges(data);
        } catch (error) {
            console.error(error);
        }
        }; 

        fetchChallenges();
    }, [type]);

    return (
      <>
      <BaseChallenge
        title={type}
        name_button={`Voir les challenges de la catégorie ${type}`}
        section_title="Les challenges"
        challengesList={challenges}
      />
    </>
        
    );
};

export default CategoriesPage;
