import React, { useEffect, useState } from 'react';
import api from '../services/api';

const StockManagementScreen = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await api.get('/inventory/status');
                setInventory(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Crítico':
                return 'bg-red-500 text-white';
            case 'Atenção':
                return 'bg-yellow-500 text-white';
            default:
                return 'bg-green-500 text-white';
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gerenciamento de Estoque</h1>
            <div className="mb-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Adicionar Novo Produto
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-2 px-4">Nome</th>
                            <th className="py-2 px-4">SKU</th>
                            <th className="py-2 px-4">Estoque Atual</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item) => (
                            <tr key={item.id} className="border-b">
                                <td className="py-2 px-4">{item.productName}</td>
                                <td className="py-2 px-4">{item.sku}</td>
                                <td className="py-2 px-4">{item.currentStock}</td>
                                <td className="py-2 px-4">
                                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="py-2 px-4">
                                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mr-2">Editar</button>
                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockManagementScreen;