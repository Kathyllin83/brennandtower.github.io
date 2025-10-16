import React, { useState, useEffect } from 'react';

// --- MOCK DATA ---
const mockProduct = {
  id: 'prod1',
  name: 'Cabo Óptico 12 Fibras',
  sku: 'CO-12F-001',
  quantity: 15,
  status: 'Em estoque',
  critical: false,
  image: 'https://via.placeholder.com/300x200.png?text=Cabo+Óptico'
};

const mockStock = [
  { id: 'prod1', name: 'Cabo Óptico 12 Fibras', quantity: 15, critical: false, image: 'https://via.placeholder.com/150.png?text=Cabo+12F' },
  { id: 'prod2', name: 'Conector SC/APC', quantity: 8, critical: true, image: 'https://via.placeholder.com/150.png?text=Conector+SC' },
  { id: 'prod3', name: 'Caixa de Emenda Óptica', quantity: 25, critical: false, image: 'https://via.placeholder.com/150.png?text=Caixa+Emenda' },
  { id: 'prod4', name: 'Splitter 1x8', quantity: 5, critical: true, image: 'https://via.placeholder.com/150.png?text=Splitter+1x8' },
];

const mockOrders = [
    { id: 'req1', product: 'Cabo Óptico 12 Fibras', quantity: 5, date: '14/10/2025', status: 'Em trânsito' },
    { id: 'req2', product: 'Conector SC/APC', quantity: 50, date: '12/10/2025', status: 'Aprovado' },
    { id: 'req3', product: 'Splitter 1x8', quantity: 10, date: '11/10/2025', status: 'Pendente' },
    { id: 'req4', product: 'Cabo Óptico 24 Fibras', quantity: 10, date: '15/10/2025', status: 'Em trânsito' },
    { id: 'req5', product: 'Caixa de Emenda Óptica 24F', quantity: 20, date: '15/10/2025', status: 'Aprovado' },
    { id: 'req6', product: 'Conector LC/APC', quantity: 100, date: '13/10/2025', status: 'Pendente' },
];

// --- SVG ICONS ---
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a3 3 0 00-6 0v.083A6 6 0 002 11v3.159c0 .538-.214 1.055-.595 1.436L0 17h5m10 0v1a3 3 0 01-6 0v-1m6 0H9" /></svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
);

// --- SCREENS ---

const SplashScreen = ({ navigateTo }) => {
  useEffect(() => {
    const timer = setTimeout(() => navigateTo('login'), 2000);
    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">NexusBB</h1>
      <p className="mt-2 text-lg">Seu Hub de Gestão de Estoque</p>
    </div>
  );
};

const LoginScreen = ({ navigateTo }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">NexusBB Login</h2>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigateTo('home'); }}>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="voce@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
            <input id="password" name="password" type="password" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="********" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" onClick={() => navigateTo('register')} className="font-medium text-indigo-600 hover:text-indigo-500">Cadastre-se</a>
            </div>
            <div className="text-sm text-right">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Esqueceu sua senha?</a>
            </div>
          </div>
          <button type="submit" className="w-full py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
        </form>
      </div>
    </div>
  );
};

const RegisterScreen = ({ navigateTo }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Cadastro NexusBB</h2>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigateTo('login'); }}>
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Nome</label>
            <input id="name" name="name" type="text" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Seu Nome" />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="voce@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
            <input id="password" name="password" type="password" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="********" />
          </div>
          <button type="submit" className="w-full py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

const HomeScreen = ({ navigateTo }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white shadow-md">
        <button onClick={() => navigateTo('stock')}><MenuIcon /></button>
        <div className="text-center">
          <p className="text-sm text-gray-500">Bem-vinda,</p>
          <h1 className="font-bold">Juliana Almeida</h1>
          <p className="text-xs text-gray-500">Estoque - RE</p>
        </div>
        <div className="flex items-center space-x-4">
          <BellIcon />
          <UserIcon />
        </div>
      </header>

      <main className="pt-24 p-4">
        <div className="relative mb-6">
          <input type="text" placeholder="Buscar item..." className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full" />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Últimos Pedidos</h2>
          <div className="flex pb-4 space-x-4 overflow-x-auto">
            {mockOrders.map(order => (
              <div key={order.id} className="flex-shrink-0 w-64 p-4 bg-white rounded-lg shadow">
                <p className="font-bold">{order.product}</p>
                <p className="text-sm text-gray-600">Qtd: {order.quantity}</p>
                <p className={`text-sm font-semibold ${order.status === 'Em trânsito' ? 'text-blue-500' : order.status === 'Aprovado' ? 'text-green-500' : 'text-yellow-500'}`}>{order.status}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Alerta de estoques</h2>
          <div className="space-y-4">
            {mockStock.filter(item => item.critical).map(item => (
              <div key={item.id} onClick={() => navigateTo('productDetail', item)} className="flex items-center justify-between p-4 bg-white rounded-lg shadow cursor-pointer">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md mr-4"/>
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                  </div>
                </div>
                <div className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">Crítico</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around p-2 bg-white border-t">
        <button onClick={() => navigateTo('home')} className="p-2 text-indigo-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg></button>
        <button onClick={() => navigateTo('stock')} className="p-2 text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg></button>
        <button onClick={() => navigateTo('orders')} className="p-2 text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zM3 11h10" /></svg></button>
      </nav>
    </div>
  );
};

const StockScreen = ({ navigateTo }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center p-4 bg-white shadow-md">
        <button onClick={() => navigateTo('home')}><ChevronLeftIcon /></button>
        <h1 className="mx-auto text-xl font-bold">Recife, PE</h1>
        <div className="w-6"></div>
      </header>

      <main className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div onClick={() => navigateTo('addProduct')} className="flex flex-col items-center justify-center p-4 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer aspect-square">
          <PlusIcon />
          <p className="mt-2 text-sm font-semibold text-center">Adicione um item</p>
        </div>
        {mockStock.map(item => (
          <div key={item.id} className="p-4 bg-white rounded-lg shadow aspect-square flex flex-col justify-between">
            <img src={item.image} alt={item.name} className="w-full h-1/2 object-cover rounded-md mb-2"/>
            <p className="font-bold text-sm leading-tight">{item.name}</p>
            <button onClick={() => navigateTo('productDetail', item)} className="w-full mt-2 py-1 px-2 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Saiba mais</button>
          </div>
        ))}
      </main>
    </div>
  );
};

const AddProductScreen = ({ navigateTo }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center p-4 bg-white shadow-md">
        <button onClick={() => navigateTo('stock')}><ChevronLeftIcon /></button>
        <h1 className="mx-auto text-xl font-bold">Adicionar Produto</h1>
        <div className="w-6"></div>
      </header>

      <main className="p-4">
        <form className="space-y-6">
          <div className="flex items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-indigo-600 font-medium">Clique para fazer upload</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
            </label>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Nome do Produto</label>
            <input type="text" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Quantidade</label>
            <input type="number" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
          <div className="flex items-center">
            <input id="critical" name="critical" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
            <label htmlFor="critical" className="ml-2 block text-sm text-gray-900">Marcar como nível crítico</label>
          </div>
          <button type="submit" onClick={() => navigateTo('stock')} className="w-full py-2 px-4 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Adicionar</button>
        </form>
      </main>
    </div>
  );
};

const ProductDetailScreen = ({ navigateTo, product }) => {
  if (!product) return <div className="p-4">Produto não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center p-4 bg-white shadow-md">
        <button onClick={() => navigateTo('stock')}><ChevronLeftIcon /></button>
        <h1 className="mx-auto text-xl font-bold">Detalhes do Produto</h1>
        <div className="w-6"></div>
      </header>

      <main className="p-4">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-gray-500">SKU: {product.sku || 'N/A'}</p>
        <div className="mt-4 flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div>
            <p className="text-sm text-gray-500">Quantidade</p>
            <p className="text-2xl font-bold">{product.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className={`text-lg font-semibold ${product.critical ? 'text-red-500' : 'text-green-500'}`}>{product.critical ? 'Crítico' : 'OK'}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="w-full py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Requisitar</button>
          <button onClick={() => navigateTo('request', product)} className="w-full py-3 font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600">Reparo</button>
        </div>
      </main>
    </div>
  );
};

const RequestScreen = ({ navigateTo, product }) => {
  if (!product) return <div className="p-4">Produto não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center p-4 bg-white shadow-md">
        <button onClick={() => navigateTo('productDetail', product)}><ChevronLeftIcon /></button>
        <h1 className="mx-auto text-xl font-bold">Solicitar Reparo</h1>
        <div className="w-6"></div>
      </header>

      <main className="p-4">
        <form className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Produto</label>
            <input type="text" readOnly value={product.name} className="w-full px-3 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Quantidade</label>
            <input type="number" defaultValue="1" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Justificativa</label>
            <textarea rows="4" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" placeholder="Descreva o motivo da solicitação..."></textarea>
          </div>
          <button type="submit" onClick={() => navigateTo('home')} className="w-full py-2 px-4 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Enviar Solicitação</button>
        </form>
      </main>
    </div>
  );
};

const OrdersScreen = ({ navigateTo }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/requests')
            .then(response => response.json())
            .then(data => setOrders(data))
            .catch(error => console.error('Error fetching orders:', error));
    }, []);

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="flex items-center p-4 bg-white shadow-md">
          <button onClick={() => navigateTo('home')}><ChevronLeftIcon /></button>
          <h1 className="mx-auto text-xl font-bold">Meus Pedidos</h1>
          <div className="w-6"></div>
        </header>
  
        <main className="p-4">
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="p-4 bg-white rounded-lg shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-gray-800">{order.products[0].name}</p>
                        <p className="text-sm text-gray-500">Qtd: {order.products[0].quantity}</p>
                        <p className="text-sm text-gray-500">Data: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className={`px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' : order.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  };

// --- MAIN APP COMPONENT ---

function App() {
  const [screen, setScreen] = useState('splash'); // splash, login, home, stock, addProduct, productDetail, request, orders
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigateTo = (targetScreen, data = null) => {
    if (data) {
      setSelectedProduct(data);
    }
    setScreen(targetScreen);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen navigateTo={navigateTo} />;
      case 'login':
        return <LoginScreen navigateTo={navigateTo} />;
      case 'home':
        return <HomeScreen navigateTo={navigateTo} />;
      case 'stock':
        return <StockScreen navigateTo={navigateTo} />;
      case 'addProduct':
        return <AddProductScreen navigateTo={navigateTo} />;
      case 'productDetail':
        return <ProductDetailScreen navigateTo={navigateTo} product={selectedProduct || mockProduct} />;
      case 'request':
        return <RequestScreen navigateTo={navigateTo} product={selectedProduct || mockProduct} />;
      case 'register':
        return <RegisterScreen navigateTo={navigateTo} />;
      case 'orders':
        return <OrdersScreen navigateTo={navigateTo} />;
      default:
        return <LoginScreen navigateTo={navigateTo} />;
    }
  };

  return <div className="font-sans">{renderScreen()}</div>;
}

export default App;
