import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [filters, setFilters] = useState({ timePeriod: '3m', warehouseId: '', itemId: '' });
  const [metrics, setMetrics] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [oldestOpenOrders, setOldestOpenOrders] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/items').then(res => setItems(res.data));
    api.get('/items/low-stock').then(res => setLowStockItems(res.data));
    api.get('/orders?status=Aberto&sort=asc').then(res => setOldestOpenOrders(res.data.slice(0, 5)));
    setWarehouses([ { id: 1, name: 'Central' }, { id: 2, name: 'Recife' }, { id: 3, name: 'Curitiba' } ]);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(filters).toString();
        const [metricsRes, predictionRes] = await Promise.all([
          api.get(`/dashboard/metrics?${params}`),
          api.get(`/dashboard/prediction?${params}`)
        ]);
        setMetrics(metricsRes.data);
        setPrediction(predictionRes.data.prediction);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Avisos de Estoque Baixo */}
      {lowStockItems.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Avisos de Estoque</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {lowStockItems.map(item => {
              const isCritical = item.status === 'Crítico' || item.quantity === 0;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover"/>
                  <div className="p-4">
                    <h3 className="font-bold truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.warehouse.name}</p>
                    <p className="text-sm text-gray-600 mt-2">Restam: {item.quantity} unidades</p>
                    <div className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${isCritical ? 'bg-red-500 text-white' : 'bg-yellow-400 text-gray-800'}`}>
                      {isCritical ? 'Crítico' : 'Atenção'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 mt-8">Métricas Interativas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white p-4 rounded-lg shadow-md">
        <select name="timePeriod" value={filters.timePeriod} onChange={handleFilterChange} className="p-2 border rounded-md">
          <option value="3m">Últimos 3 meses</option>
          <option value="6m">Últimos 6 meses</option>
        </select>
        <select name="warehouseId" value={filters.warehouseId} onChange={handleFilterChange} className="p-2 border rounded-md">
          <option value="">Todos os Depósitos</option>
          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <select name="itemId" value={filters.itemId} onChange={handleFilterChange} className="p-2 border rounded-md">
          <option value="">Todos os Itens</option>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>

      {loading ? <p>Carregando métricas...</p> : (metrics && metrics.weightedSalesAverage != null) ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Média Ponderada de Saídas</h3>
              <p className="text-3xl text-blue-600">{metrics.weightedSalesAverage.toFixed(2)} <span className="text-lg">/ mês</span></p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Necessidade de Compra</h3>
              <ul className="text-sm space-y-1">
                {metrics.restockList.slice(0, 5).map((item, index) => (
                  <li key={index} className="flex justify-between"><span>{item.name}</span> <span className="font-semibold">{item.quantityToBuy} un.</span></li>
                ))}
                {metrics.restockList.length > 5 && <li className="text-center text-gray-500">e mais...</li>}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Itens Mais Requisitados</h3>
              <ul>
                {Object.values(metrics.topItemsByWarehouse).flat().map((item, index) => (
                  <li key={index} className="flex justify-between"><span>{item.name}</span> <span>{item.count}x</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-6 rounded-lg shadow-md flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="font-bold text-lg mb-1">Recomendação Preditiva</h3>
              <p>{prediction}</p>
            </div>
          </div>
        </>
      ) : <p>Não há dados suficientes para exibir as métricas.</p>}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Pedidos Antigos Pendentes</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Tipo</th>
                  <th className="text-left py-3 px-4">Origem</th>
                  <th className="text-left py-3 px-4">Item</th>
                  <th className="text-left py-3 px-4">Ação</th>
                </tr>
              </thead>
              <tbody>
                {oldestOpenOrders.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.type}</td>
                    <td className="py-3 px-4">{order.originWarehouse?.name || 'N/A'}</td>
                    <td className="py-3 px-4">{order.item?.name}</td>
                    <td className="py-3 px-4">
                      <Link to={`/orders/${order.id}`} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">Detalhes</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;