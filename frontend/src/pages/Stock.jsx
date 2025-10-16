import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const warehouses = [
  { id: 1, name: 'Central', location: 'Brasília - DF' },
  { id: 2, name: 'Recife', location: 'Recife - PE' },
  { id: 3, name: 'Curitiba', location: 'Curitiba - PR' },
];

const Stock = () => {
  const [weights, setWeights] = useState({});

  useEffect(() => {
    api.get('/warehouses/weights').then(res => {
      const newWeights = res.data.reduce((acc, w) => {
        acc[w.warehouseId] = w.weight;
        return acc;
      }, {});
      setWeights(newWeights);
    });
  }, []);

  const handleWeightChange = (warehouseId, weight) => {
    setWeights(prev => ({ ...prev, [warehouseId]: weight }));
    api.put(`/warehouses/${warehouseId}/weight`, { weight });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Visão Geral dos Depósitos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {warehouses.map(wh => (
          <div key={wh.id} className="p-8 bg-white rounded-lg shadow-md text-center">
            <Link to={`/stock/${wh.id}`} className="block">
              <h2 className="text-2xl font-bold text-blue-600">{wh.name}</h2>
              <p className="text-gray-500">{wh.location}</p>
            </Link>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Peso</label>
              <input 
                type="number" 
                value={weights[wh.id] || ''} 
                onChange={(e) => handleWeightChange(wh.id, e.target.value)} 
                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stock;
