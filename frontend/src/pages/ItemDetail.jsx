import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ItemDetail = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [observation, setObservation] = useState('');

  useEffect(() => {
    api.get(`/items/${itemId}`)
      .then(response => setItem(response.data))
      .catch(error => console.error("Erro ao buscar detalhe do item:", error));
  }, [itemId]);

  const handleRequestRepair = () => {
    if (!item) return;

    const newOrder = {
      type: 'Reparo',
      originWarehouseId: item.warehouseId, // O item sai do seu depósito atual
      destinationWarehouseId: 1, // Supondo que o reparo é na central (ID 1)
      itemId: item.id,
      quantity: 1, // Supondo reparo de 1 unidade
      observation,
    };

    api.post('/orders', newOrder)
      .then(() => {
        alert('Pedido de reparo criado com sucesso!');
        navigate('/orders');
      })
      .catch(error => {
        console.error("Erro ao criar pedido de reparo:", error);
        alert('Falha ao criar pedido de reparo.');
      });
  };

  if (!item) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            {/* Placeholder para a imagem */}
            <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-500">Imagem</span>
            </div>
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
            <p className="text-lg text-gray-700">Depósito: {item.warehouse?.name || 'N/A'}</p>
            <p className="mt-4">Quantidade em Estoque: <span className="font-bold">{item.quantity}</span></p>
            <p>Status: 
              <span className={`font-semibold ${item.status === 'Disponível' ? 'text-green-600' : 'text-red-600'}`}>
                {item.status}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-2xl font-bold mb-4">Requisitar Reparo</h2>
          <div className="mb-4">
            <label htmlFor="observation" className="block text-sm font-medium text-gray-700 mb-2">
              Observação (Opcional)
            </label>
            <textarea
              id="observation"
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Descreva o problema ou a razão do reparo..."
            />
          </div>
          <button 
            onClick={handleRequestRepair}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Confirmar Requisição de Reparo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
