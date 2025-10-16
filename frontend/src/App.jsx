import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Stock from './pages/Stock';
import StockDetail from './pages/StockDetail';
import ItemDetail from './pages/ItemDetail';
import OrderList from './pages/OrderList';
import NewOrder from './pages/NewOrder';
import OrderDetail from './pages/OrderDetail';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/stock/:warehouseId" element={<StockDetail />} />
            <Route path="/item/:itemId" element={<ItemDetail />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/new" element={<NewOrder />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
