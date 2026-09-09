import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { ingredientsFetch } from '../slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ingredientsFetch());
  }, [dispatch]);
  const { ingredients } = useSelector((store) => store.ingredientsSlice);

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
