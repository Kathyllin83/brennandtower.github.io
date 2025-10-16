import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filterType, setFilterType] = useState('');
  const navigate = useNavigate();

  const fetchOrders = () => {
    let url = '/orders';
    if (filterType) {
      url += `?type=${filterType}`;
    }
    api.get(url)
      .then(response => setOrders(response.data))
      .catch(error => console.error("Erro ao buscar pedidos:", error));
  };

  useEffect(() => {
    fetchOrders();
  }, [filterType]);

  const handleUpdateStatus = (orderId, newStatus) => {
    api.put(`/orders/${orderId}`, { status: newStatus })
      .then(() => fetchOrders()) // Re-fetch orders to show updated status
      .catch(err => console.error('Falha ao atualizar status', err));
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Acompanhamento de Pedidos</h1>
        <Link to="/orders/new" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700">Criar Pedido</Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-center mb-6 bg-white p-4 rounded-lg shadow-md">
        <div>
          <label className="mr-2 font-semibold">Filtrar por tipo:</label>
          <button onClick={() => setFilterType('')} className={`px-4 py-2 rounded-md mr-2 ${!filterType ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            Todos
          </button>
          <button onClick={() => setFilterType('Requisição')} className={`px-4 py-2 rounded-md mr-2 ${filterType === 'Requisição' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            Requisição
          </button>
          <button onClick={() => setFilterType('Reparo')} className={`px-4 py-2 rounded-md ${filterType === 'Reparo' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            Reparo
          </button>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Tipo</th>
                <th className="text-left py-3 px-4">Item</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{order.id}</td>
                  <td className="py-3 px-4">{order.type}</td>
                  <td className="py-3 px-4">{order.item?.name || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${{
                      'Pendente': 'bg-gray-200 text-gray-800',
                      'Aprovado': 'bg-green-200 text-green-800',
                      'Recusado': 'bg-red-200 text-red-800',
                      'Em Andamento': 'bg-yellow-200 text-yellow-800',
                      'Entregue': 'bg-blue-200 text-blue-800',
                      'Encerrado': 'bg-purple-200 text-purple-800',
                    }[order.status] || 'bg-gray-200'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {order.status === 'Pendente' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdateStatus(order.id, 'Aprovado')} className="text-sm bg-green-500 text-white px-3 py-1 rounded-md">Aprovar</button>
                        <button onClick={() => handleUpdateStatus(order.id, 'Recusado')} className="text-sm bg-red-500 text-white px-3 py-1 rounded-md">Recusar</button>
                      </div>
                    )}
                    {order.status === 'Aprovado' && (
                      <button onClick={() => handleUpdateStatus(order.id, 'Em Andamento')} className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-md">Em Andamento</button>
                    )}
                    {order.status === 'Em Andamento' && (
                      <button onClick={() => handleUpdateStatus(order.id, 'Entregue')} className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md">Entregue</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;