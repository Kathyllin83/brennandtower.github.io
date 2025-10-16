import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProductForm = ({ productToEdit, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        supplier: '',
        initialStock: '',
        warehouseId: '' // Assuming a default or selectable warehouse
    });
    const [warehouses, setWarehouses] = useState([]);
    const isEditMode = !!productToEdit;

    useEffect(() => {
        // In a real app, you would fetch warehouses from the API
        setWarehouses([
            { id: '1', city: 'Recife' },
            { id: '2', city: 'São Paulo' },
        ]);

        if (isEditMode) {
            setFormData({
                name: productToEdit.productName,
                sku: productToEdit.sku,
                supplier: productToEdit.supplier,
                initialStock: productToEdit.initialStock,
                currentStock: productToEdit.currentStock, // for PUT request
                warehouseId: productToEdit.warehouseId,
            });
        }
    }, [productToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await api.put(`/products/${productToEdit.id}`, { currentStock: formData.currentStock });
            } else {
                await api.post('/products', formData);
            }
            onFormSubmit(); // Callback to refresh list or close modal
        } catch (error) {
            console.error('Failed to submit product form', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded">
            <h2 className="text-xl font-bold">{isEditMode ? 'Editar Produto' : 'Adicionar Produto'}</h2>
            <div>
                <label className="block mb-1">Nome</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={isEditMode} className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="block mb-1">SKU</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} disabled={isEditMode} className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="block mb-1">Fornecedor</label>
                <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} disabled={isEditMode} className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="block mb-1">Estoque {isEditMode ? 'Atual' : 'Inicial'}</label>
                <input type="number" name={isEditMode ? 'currentStock' : 'initialStock'} value={isEditMode ? formData.currentStock : formData.initialStock} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
             {!isEditMode && (
                <div>
                    <label className="block mb-1">Armazém</label>
                    <select name="warehouseId" value={formData.warehouseId} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="">Selecione o Armazém</option>
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.city}</option>)}
                    </select>
                </div>
            )}
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {isEditMode ? 'Salvar Alterações' : 'Adicionar Produto'}
            </button>
        </form>
    );
};

export default ProductForm;