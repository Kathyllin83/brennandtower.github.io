import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

// Modal Component
const ItemModal = ({ item, warehouses, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    item || { name: '', quantity: 0, status: 'Disponível', warehouseId: '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-xl w-11/12 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">{item ? 'Editar Item' : 'Adicionar Item'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields ... */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">URL da Imagem</label>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Código</label>
            <input type="text" name="code" value={formData.code} onChange={handleChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
            <input type="number" name="value" value={formData.value} onChange={handleChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fornecedor</label>
            <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm">
              <option>Disponível</option>
              <option>Crítico</option>
              <option>Em Reparo</option>
            </select>
          </div>
           <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Depósito</label>
            <select name="warehouseId" value={formData.warehouseId} onChange={handleChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" required>
              <option value="">Selecione um depósito</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const StockDetail = () => {
  const { warehouseId } = useParams();
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchItems = () => {
    api.get(`/items?warehouseId=${warehouseId}`)
      .then(response => setItems(response.data))
      .catch(error => console.error("Erro ao buscar itens:", error));
  };

  useEffect(() => {
    fetchItems();
    // Fetch warehouses for the modal dropdown. A real app might have a dedicated endpoint.
    setWarehouses([
      { id: 1, name: 'Central' },
      { id: 2, name: 'Recife' },
      { id: 3, name: 'Curitiba' },
    ]);
  }, [warehouseId]);

  const handleSave = (itemData) => {
    const promise = itemData.id
      ? api.put(`/items/${itemData.id}`, itemData) // Update
      : api.post('/items', { ...itemData, warehouseId }); // Create

    promise.then(() => {
      fetchItems();
      setIsModalOpen(false);
      setEditingItem(null);
    }).catch(err => console.error('Failed to save item', err));
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Tem certeza que deseja remover este item?')) {
      api.delete(`/items/${itemId}`).then(() => fetchItems());
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Estoque - Depósito {warehouseId}</h1>
        <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700">Adicionar Item</button>
      </div>

      {isModalOpen && <ItemModal item={editingItem} warehouses={warehouses} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col">
            <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover rounded-t-lg mb-4"/>
            <div className="flex-grow">
              <p className="text-xs text-gray-400 font-mono">{item.code}</p>
              <h3 className="font-bold text-lg truncate">{item.name}</h3>
              <p className="text-sm text-gray-600">Fornecedor: {item.supplier}</p>
              <p className="text-lg font-semibold text-blue-600 mt-1">R$ {item.value}</p>
              <p className="text-gray-600">Quantidade: {item.quantity}</p>
              <p className="text-sm mt-2">Status: <span className={`font-semibold ${item.status === 'Disponível' ? 'text-green-600' : 'text-red-600'}`}>{item.status}</span></p>
            </div>
            <div className="flex justify-end gap-2 mt-4 border-t pt-3">
              <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-sm bg-gray-200 px-3 py-1 rounded-md">Editar</button>
              <button onClick={() => handleDelete(item.id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded-md">Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockDetail;