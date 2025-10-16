import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  const fetchOrder = () => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error('Erro ao buscar pedido', err));
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = (newStatus) => {
    api.put(`/orders/${id}`, { status: newStatus })
      .then(() => fetchOrder()) // Re-fetch to show updated status
      .catch(err => console.error('Falha ao atualizar status', err));
  };

  if (!order) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Detalhes do Pedido #{order.id}</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Informações Gerais</h2>
            <p><strong>Tipo:</strong> {order.type}</p>
            <p><strong>Status:</strong> 
              <span className={`font-semibold px-2 py-1 rounded-full text-sm ml-2 ${{
                'Pendente': 'bg-gray-200 text-gray-800',
                'Aprovado': 'bg-green-200 text-green-800',
                'Recusado': 'bg-red-200 text-red-800',
                'Em Andamento': 'bg-yellow-200 text-yellow-800',
                'Entregue': 'bg-blue-200 text-blue-800',
                'Encerrado': 'bg-purple-200 text-purple-800',
              }[order.status]}`}>
                {order.status}
              </span>
            </p>
            <p><strong>Origem:</strong> {order.originWarehouse?.name || 'N/A'}</p>
            <p><strong>Destino:</strong> {order.destinationWarehouse?.name || 'N/A'}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Item</h2>
            <p><strong>Produto:</strong> {order.item?.name}</p>
            <p><strong>Quantidade:</strong> {order.quantity}</p>
            <p><strong>Código:</strong> {order.item?.code}</p>
            <p><strong>Valor Unitário:</strong> R$ {order.item?.value}</p>
          </div>
        </div>
        {order.observation && (
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-bold mb-2">Observação</h2>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{order.observation}</p>
          </div>
        )}

        {order.status === 'Pendente' && (
          <div className="mt-8 border-t pt-6 flex justify-end gap-4">
            <button onClick={() => handleUpdateStatus('Recusado')} className="px-6 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700">Recusar Pedido</button>
            <button onClick={() => handleUpdateStatus('Aprovado')} className="px-6 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700">Aceitar Pedido</button>
          </div>
        )}
        {order.status === 'Aprovado' && (
          <div className="mt-8 border-t pt-6 flex justify-end gap-4">
            <button onClick={() => handleUpdateStatus('Em Andamento')} className="px-6 py-2 bg-yellow-600 text-white rounded-md shadow-md hover:bg-yellow-700">Iniciar Andamento</button>
          </div>
        )}
        {order.status === 'Em Andamento' && (
          <div className="mt-8 border-t pt-6 flex justify-end gap-4">
            <button onClick={() => handleUpdateStatus('Entregue')} className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700">Marcar como Entregue</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
