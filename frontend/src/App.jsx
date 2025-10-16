
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Importe suas páginas e componentes principais
// Certifique-se de que esses arquivos existem nas pastas corretas do seu projeto
import Dashboard from './pages/Dashboard';
import Stock from './pages/Stock';
import StockDetail from './pages/StockDetail';
import ItemDetail from './pages/ItemDetail';
import OrderList from './pages/OrderList';
import NewOrder from './pages/NewOrder';
import OrderDetail from './pages/OrderDetail';
import Header from './components/Header';

// --- DADOS MOCKADOS PARA O CHATBOT ---
// (No futuro, você pode substituir isso por chamadas de API)
const initialStock = [
    { id: 'prod1', name: 'Cabo Óptico 12 Fibras', quantity: 15, critical: false },
    { id: 'prod2', name: 'Conector SC/APC', quantity: 8, critical: true },
    { id: 'prod3', name: 'Caixa de Emenda Óptica', quantity: 25, critical: false },
    { id: 'prod4', name: 'Splitter 1x8', quantity: 5, critical: true },
];
const mockOrders = [
    { id: 'req1', product: 'Cabo Óptico 12 Fibras', quantity: 5, status: 'Em trânsito' },
    { id: 'req2', product: 'Conector SC/APC', quantity: 50, status: 'Aprovado' },
    { id: 'req3', product: 'Splitter 1x8', quantity: 10, status: 'Pendente' },
];


// --- COMPONENTES DO CHATBOT (INTEGRADOS NO APP.JSX) ---

// Ícones SVG para o Chatbot
const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>);
const ChatbotIconSVG = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> );

// Componentes Visuais do Chatbot
const BotAvatar = () => ( <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0"> N </div> );
const UserAvatar = () => ( <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 flex-shrink-0"> <UserIcon /> </div> );
const TypingIndicator = () => ( <div className="flex items-center space-x-2"> <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div> <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div> <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div> </div> );

// Componente do Botão Flutuante
const ChatIconButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="fixed bottom-8 right-8 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-50 animate-fade-in"
        aria-label="Abrir assistente"
    >
        <ChatbotIconSVG />
    </button>
);

// Componente Principal do Chatbot
const Chatbot = ({ isOpen, onClose, stock, orders, navigate }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: 1, sender: 'bot', text: "Olá! Sou o assistente NexusBB. Como posso te ajudar hoje?",
                actions: [{ label: "Ver Comandos", value: "ajuda" }]
            }]);
        }
    }, [isOpen, messages.length]);

    const getBotResponse = (userInput) => {
        const lowerInput = userInput.toLowerCase();
        
        if (lowerInput.includes('ajuda')) return { text: "Eu posso te ajudar com:\n\n- **Relatório de Pedidos**\n- **Buscar Item** no estoque\n- **Itens Críticos** com baixo estoque\n- **Último Pedido** realizado" };
        if (lowerInput.startsWith('olá') || lowerInput.startsWith('oi')) return { text: "Olá! O que você precisa?" };

        if (lowerInput.includes('relatório')) {
            const statusCounts = orders.reduce((acc, order) => { acc[order.status] = (acc[order.status] || 0) + 1; return acc; }, {});
            return {
                text: `Certo! Aqui está o resumo dos seus pedidos:\n\n- **Aprovados:** ${statusCounts['Aprovado'] || 0}\n- **Em trânsito:** ${statusCounts['Em trânsito'] || 0}\n- **Pendentes:** ${statusCounts['Pendente'] || 0}`,
                actions: [{ label: "Ver Todos os Pedidos", path: "/orders" }]
            };
        }

        if (lowerInput.includes('crítico')) {
            const criticalItems = stock.filter(item => item.critical);
            if (criticalItems.length === 0) return { text: "Boas notícias! Nenhum item está em nível crítico." };
            let responseText = `Encontrei ${criticalItems.length} item(ns) em nível crítico:\n\n`;
            criticalItems.forEach(item => { responseText += `- **${item.name}:** Apenas ${item.quantity} unidades.\n`; });
            return { text: responseText, actions: [{ label: "Ver Estoque Completo", path: "/stock" }] };
        }

        if (lowerInput.includes('último pedido')) {
            if (!orders || orders.length === 0) return { text: "Ainda não há pedidos registrados." };
            const lastOrder = orders[orders.length - 1];
            return { text: `Seu pedido mais recente é:\n\n- **Produto:** ${lastOrder.product}\n- **Status:** ${lastOrder.status}` };
        }

        if (lowerInput.startsWith('buscar') || lowerInput.includes('quantos')) {
            const searchTerm = lowerInput.replace('buscar', '').replace('quantos', '').replace(/temos|em|estoque|\?/g, '').trim();
            if (!searchTerm) return { text: "Claro, o que você gostaria de buscar?" };
            const results = stock.filter(item => item.name.toLowerCase().includes(searchTerm));
            if (results.length === 0) return { text: `Desculpe, não encontrei nada parecido com "${searchTerm}".` };
            if (results.length === 1) {
                const item = results[0];
                return {
                    text: `Temos **${item.quantity} unidades** de "${item.name}" em estoque.`,
                    actions: [{ label: `Ver Detalhes de ${item.name}`, path: `/item/${item.id}` }]
                };
            }
            let responseText = `Encontrei alguns itens para "${searchTerm}":\n\n`;
            results.forEach(item => { responseText += `- **${item.name}:** ${item.quantity} unidades\n`; });
            return { text: responseText };
        }

        return { text: "Não entendi o que você quis dizer. Digite 'ajuda' para ver o que posso fazer." };
    };

    const handleSendMessage = (text) => {
        if (!text.trim()) return;
        const userMessage = { id: Date.now(), text, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        setTimeout(() => {
            const botResponse = getBotResponse(text);
            const botMessage = { id: Date.now() + 1, ...botResponse, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
            setIsLoading(false);
        }, 1200);
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed bottom-24 right-8 w-96 h-[60vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in">
            <header className="flex items-center justify-between p-4 bg-indigo-600 text-white rounded-t-2xl">
                <h3 className="font-bold text-lg">Assistente NexusBB</h3>
                <button onClick={onClose} className="font-bold text-2xl leading-none">&times;</button>
            </header>
            <main className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-6">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && <BotAvatar />}
                            <div className={`max-w-xs p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                <div className="whitespace-pre-wrap">{msg.text.split('\n').map((line, index) => <p key={index} className={line.trim() === '' ? 'h-2' : ''}>{line.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}</p>)}</div>
                                {msg.actions && (
                                    <div className="mt-3 border-t pt-2 flex flex-col items-start gap-2">
                                        {msg.actions.map((action, index) => (
                                            <button key={index}
                                                onClick={() => {
                                                    if (action.path) {
                                                        navigate(action.path);
                                                        onClose(); // Fecha o chat ao navegar
                                                    } else {
                                                        handleSendMessage(action.value);
                                                    }
                                                }}
                                                className="text-sm font-semibold text-indigo-600 bg-indigo-100/50 px-3 py-1 rounded-full hover:bg-indigo-100">
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {msg.sender === 'user' && <UserAvatar />}
                        </div>
                    ))}
                    {isLoading && <div className="flex items-end gap-3"><BotAvatar /><div className="p-3 rounded-2xl bg-gray-100"><TypingIndicator /></div></div>}
                </div>
            </main>
            <footer className="p-4 bg-white border-t rounded-b-2xl">
                <form onSubmit={e => { e.preventDefault(); handleSendMessage(input); }} className="flex items-center gap-3">
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Digite 'ajuda'..." className="flex-1 w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <button type="submit" className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-400" disabled={!input.trim()}><SendIcon /></button>
                </form>
            </footer>
        </div>
    );
};


// --- COMPONENTE DE GERENCIAMENTO DE ROTAS E ESTADO ---
// Este componente intermediário é necessário para que possamos usar o hook `useNavigate`
// e passá-lo como prop para o Chatbot, já que o hook só funciona dentro do contexto do Router.
function AppContent() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate(); // Hook para obter a função de navegação

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 md:p-8">
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

      {/* --- RENDERIZAÇÃO DO CHATBOT --- */}
      {!isChatOpen && <ChatIconButton onClick={() => setIsChatOpen(true)} />}
      
      <Chatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        stock={initialStock}
        orders={mockOrders}
        navigate={navigate} // Passando a função de navegação para o chatbot
      />
    </div>
  );
}

// --- COMPONENTE PRINCIPAL QUE FORNECE O CONTEXTO DO ROUTER ---
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
