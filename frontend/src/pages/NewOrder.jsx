import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewOrder = () => {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('Requisição');
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    originWarehouseId: '',
    destinationWarehouseId: '',
    itemId: '',
    quantity: 1,
    observation: ''
  });
  const [isCentralOrigin, setIsCentralOrigin] = useState(false);

  useEffect(() => {
    api.get('/items').then(res => setItems(res.data));
    // Mock warehouses - in a real app, this would be an API call
    setWarehouses([
      { id: 1, name: 'Central' },
      { id: 2, name: 'Recife' },
      { id: 3, name: 'Curitiba' },
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'originWarehouseId') {
      setIsCentralOrigin(value == 1);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      type: orderType,
      ...formData,
      status: 'Pendente',
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
          </select>
          {orderType === 'Requisição' && <p className="text-xs text-gray-500 mt-2">Regra: Requisições entre depósitos satélite devem ser enviadas para a Central para autorização.</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orderType !== 'ABASTECIMENTO' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Depósito de Origem</label>
                <select name="originWarehouseId" value={formData.originWarehouseId} onChange={handleChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" required>
                  <option value="">Selecione</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Depósito de Destino</label>
              <select name="destinationWarehouseId" value={formData.destinationWarehouseId} onChange={handleChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" required={!isCentralOrigin}>
                <option value="">Selecione</option>
                {isCentralOrigin && <option value="">Fornecedor Externo</option>}
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
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
