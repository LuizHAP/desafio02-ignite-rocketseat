import { useState } from "react";
import api from "../../services/api";

import Header from '../../components/Header';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodData {
  id: number,
  image: string,
  name: string,
  description: string,
  price: number,
  available: boolean,
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [foods, setFoods] = useState<FoodData[]>([])
  const [editingFood, setEditingFood] = useState<FoodData>({} as FoodData)

  function handleNewPlateButton() {
    setIsModalOpen(!isModalOpen);
  }

  function handleEditPlate() {
    setIsModalEditOpen(!isModalEditOpen);
  }

  async function handleAddFood(food: FoodData) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  async function handleUpdateFood(food: FoodData) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleEditFood(food: FoodData) {
    setEditingFood(food);
    setIsModalEditOpen(true);
  }

  return (
    <>
      <Header openModal={handleNewPlateButton} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={handleNewPlateButton}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={handleEditPlate}
        setIsOpen={handleEditPlate}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}