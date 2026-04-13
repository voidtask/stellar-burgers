import { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { IngredientDetailsUI, Preloader } from '@ui';
import { selectIngredients } from '../../slices/constructor-slice';

export const IngredientDetails: FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const ingredients = useSelector(selectIngredients);
  const ingredientData = ingredients.find((item) => item._id === params.id);

  useEffect(() => {
    if (!params.id) {
      navigate('/', { replace: true });
    }
  }, []);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
