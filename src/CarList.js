import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarList = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/cars')
      .then(res => setCars(res.data))
      .catch(err => console.error(err));
  }, []);

  const deleteCar = (id) => {
    axios.delete(`http://localhost:5000/deleteCar/${id}`)
      .then(() => setCars(cars.filter(car => car.id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h3>Cars List</h3>
      <ul>
        {cars.map(car => (
          <li key={car.id}>
            {car.model} - {car.owner} - {car.weight} kg
            <button onClick={() => deleteCar(car.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarList;
