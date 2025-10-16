import React from 'react';
import { Link } from 'react-router-dom';

const warehouses = [
  { id: 1, name: 'Central', location: 'Brasília - DF' },
  { id: 2, name: 'Recife', location: 'Recife - PE' },
  { id: 3, name: 'Curitiba', location: 'Curitiba - PR' },
];

const Stock = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Visão Geral dos Depósitos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {warehouses.map(wh => (
          <Link 
            to={`/stock/${wh.id}`}
            key={wh.id} 
            className="block p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow text-center"
          >
            <h2 className="text-2xl font-bold text-blue-600">{wh.name}</h2>
            <p className="text-gray-500">{wh.location}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Stock;
