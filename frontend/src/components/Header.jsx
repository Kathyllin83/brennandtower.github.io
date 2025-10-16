import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          NexusBB
        </Link>
        <nav className="space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-500">Dashboard</Link>
          {/* Exemplo de link para um depósito específico */}
          <Link to="/stock" className="text-gray-600 hover:text-blue-500">Estoque</Link>
          <Link to="/orders" className="text-gray-600 hover:text-blue-500">Pedidos</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <p className="text-gray-700">Bem-vinda, Juliana</p>
          {/* Ícones podem ser adicionados aqui */}
        </div>
      </div>
    </header>
  );
};

export default Header;
