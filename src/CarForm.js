import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import './CarForm.css';

const CarForm = () => {
  const [carData, setCarData] = useState({
    model: '',
    owner: '',
    weight: ''
  });
  const [qrCodeValue, setQrCodeValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/addCar', carData)
      .then(() => {
        const generatedCarDataString = `Model: ${carData.model}, Owner: ${carData.owner}, Weight: ${carData.weight}`;
        setQrCodeValue(generatedCarDataString);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container">
      <h1>Car Information</h1>
      <form onSubmit={handleSubmit}>
        <label>Model</label>
        <input
          type="text"
          placeholder="Model"
          value={carData.model}
          onChange={(e) => setCarData({ ...carData, model: e.target.value })}
        />
        <label>Owner</label>
        <input
          type="text"
          placeholder="Owner"
          value={carData.owner}
          onChange={(e) => setCarData({ ...carData, owner: e.target.value })}
        />
        <label>Weight</label>
        <input
          type="number"
          placeholder="Weight"
          value={carData.weight}
          onChange={(e) => setCarData({ ...carData, weight: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>

      {qrCodeValue && (
        <div className="qr-code">
          <QRCodeCanvas value={qrCodeValue} />
        </div>
      )}
    </div>
  );
};

export default CarForm;
