import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewOrder = () => {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('Requisição');
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    originWarehouseName: '',
    destinationWarehouseName: '',
    itemId: '',
    quantity: 1,
    observation: ''
  });

  useEffect(() => {
    api.get('/items').then(res => setItems(res.data));
    api.get('/warehouses').then(res => setWarehouses(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const originWarehouse = warehouses.find(w => w.name.toLowerCase() === formData.originWarehouseName.toLowerCase());
    const destinationWarehouse = warehouses.find(w => w.name.toLowerCase() === formData.destinationWarehouseName.toLowerCase());

    const payload = {
      type: orderType,
      itemId: formData.itemId,
      quantity: formData.quantity,
      observation: formData.observation,
      status: 'Pendente',
      originWarehouseId: originWarehouse ? originWarehouse.id : null,
      destinationWarehouseId: destinationWarehouse ? destinationWarehouse.id : null,
    };
    api.post('/orders', payload)
      .then(() => {
        alert('Pedido criado com sucesso!');
        navigate('/orders');
      })
      .catch(err => {
        console.error('Erro ao criar pedido:', err);
        alert('Falha ao criar pedido.');
      });
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Criar Novo Pedido</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Pedido</label>
          <select onChange={(e) => setOrderType(e.target.value)} value={orderType} className="w-full p-2 border-gray-300 rounded-md shadow-sm">
            <option>Requisição</option>
            <option>Reparo</option>
            <option>Abastecimento</option>
          </select>
          {orderType === 'Requisição' && <p className="text-xs text-gray-500 mt-2">Regra: Requisições entre depósitos satélite devem ser enviadas para a Central para autorização.</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Origem</label>
              <input
                type="text"
                name="originWarehouseName"
                value={formData.originWarehouseName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"
                placeholder="Digite a origem"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Destino</label>
              <input
                type="text"
                name="destinationWarehouseName"
                value={formData.destinationWarehouseName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"
                placeholder="Digite o destino"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Item</label>
              <select name="itemId" value={formData.itemId} onChange={handleChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" required>
                <option value="">Selecione</option>
                {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Quantidade</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" required />
            </div>
          </div>

          <div className="mt-6 mb-4">
            <label className="block text-sm font-medium text-gray-700">Observação</label>
            <textarea name="observation" value={formData.observation} onChange={handleChange} rows="3" className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"></textarea>
          </div>

          <div className="flex justify-end mt-6">
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700">Criar Pedido</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrder;
