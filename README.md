# NexusBB - Sistema de Gerenciamento de Estoque e Pedidos

Bem-vindo ao NexusBB, um sistema completo para gerenciamento de estoque e acompanhamento de pedidos, desenvolvido para otimizar a logística e o controle de inventário em múltiplos depósitos.

## Visão Geral

Este projeto é uma aplicação full-stack que permite aos usuários:

- Visualizar o dashboard com métricas interativas e sugestões preditivas.
- Gerenciar o estoque em diferentes depósitos, incluindo a definição de pesos para cada um.
- Criar, acompanhar e gerenciar pedidos de requisição e reparo, com um fluxo de aprovação/recusa.
- Transferir itens entre depósitos (central e satélites) de forma controlada.
- Interagir com um chatbot assistente para consultas rápidas sobre estoque e pedidos.

## Funcionalidades Principais

### Dashboard

- **Métricas Interativas:** Visualize a média ponderada de saídas, necessidade de compra e itens mais requisitados, com filtros por período, depósito e item.
- **Sugestão Preditiva:** Receba recomendações inteligentes baseadas no histórico de requisições e níveis de estoque.
- **Avisos de Estoque Baixo:** Alertas visuais para itens com quantidade crítica.
- **Pedidos Antigos Pendentes:** Gerencie rapidamente os pedidos mais antigos que aguardam aprovação ou recusa diretamente do dashboard.

### Estoque

- **Visão Geral por Depósito:** Visualize todos os depósitos e seus respectivos itens.
- **Pesos de Depósito:** Defina e ajuste o peso de cada depósito, influenciando as métricas do dashboard.
- **Gerenciamento de Itens:** Adicione, edite e remova itens em cada depósito.

### Pedidos

- **Criação Flexível:** Crie pedidos de requisição (entre depósitos ou para fornecedores externos) e reparo.
- **Fluxo de Aprovação:** Pedidos pendentes podem ser aprovados ou recusados, com transição de status.
- **Acompanhamento Detalhado:** Visualize o status atual de cada pedido (Pendente, Aprovado, Em Andamento, Entregue, Encerrado, Recusado).
- **Transferências Controladas:** Regras de negócio para garantir que transferências entre depósitos satélites passem pela Central.

### Chatbot Assistente

- **Consultas Rápidas:** Obtenha informações sobre o estoque, itens críticos, relatórios de pedidos e o último pedido realizado através de uma interface de chat.

## Tecnologias Utilizadas

### Backend

- **Node.js:** Ambiente de execução JavaScript.
- **Express.js:** Framework web para construção da API RESTful.
- **Sequelize:** ORM (Object-Relational Mapper) para Node.js, facilitando a interação com o banco de dados.
- **SQLite:** Banco de dados leve e baseado em arquivo, ideal para desenvolvimento e pequenas aplicações.
- **Sequelize-CLI:** Ferramenta de linha de comando para gerenciar migrações e seeds do banco de dados.

### Frontend

- **React:** Biblioteca JavaScript para construção de interfaces de usuário.
- **React Router DOM:** Para gerenciamento de rotas na aplicação SPA (Single Page Application).
- **Tailwind CSS:** Framework CSS utilitário para estilização rápida e responsiva.
- **Axios:** Cliente HTTP para fazer requisições à API do backend.

## Instalação e Configuração

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter o Node.js e o npm (ou Yarn) instalados em sua máquina.

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### 1. Clonar o Repositório

```bash
git clone https://github.com/brennandtower/brennandtower.github.io.git
cd brennandtower.github.io
```

### 2. Configurar o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis de ambiente (baseado em `.env.example`):

```
PORT=3001
```

Execute as migrações do banco de dados e os seeds (dados iniciais):

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Inicie o servidor backend:

```bash
npm start
# ou para desenvolvimento com hot-reload:
npm run dev
```

O servidor estará rodando em `http://localhost:3001`.

### 3. Configurar o Frontend

Abra um novo terminal e navegue para a pasta `frontend`:

```bash
cd ../frontend
npm install
```

Inicie a aplicação frontend:

```bash
npm start
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta, dependendo da configuração do seu ambiente).

## Uso

Após a instalação, você pode navegar pela aplicação:

- **Dashboard:** `http://localhost:5173/`
- **Estoque:** `http://localhost:5173/stock`
- **Pedidos:** `http://localhost:5173/orders`

Explore as funcionalidades, crie novos pedidos, gerencie o estoque e interaja com o chatbot!

## Estrutura do Projeto

```
brennandtower.github.io/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/          # Configurações do banco de dados
│   │   ├── controllers/     # Lógica de negócio para cada recurso
│   │   ├── migrations/      # Migrações do banco de dados
│   │   ├── models/          # Definição dos modelos Sequelize
│   │   ├── routes/          # Definição das rotas da API
│   │   └── seed.js          # Dados iniciais para o banco de dados
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Componente principal da aplicação
│   │   ├── index.css        # Estilos globais (Tailwind CSS)
│   │   ├── main.jsx         # Ponto de entrada do React
│   │   ├── components/      # Componentes reutilizáveis (ex: Header)
│   │   ├── context/         # Contextos React (se houver)
│   │   ├── pages/           # Páginas da aplicação (ex: Dashboard, Stock)
│   │   └── services/        # Serviços para interação com a API
│   ├── package.json
│   └── ...
├── README.md
└── ...
```

## Contribuição

Sinta-se à vontade para contribuir com o projeto! Para isso, siga os passos:

1. Faça um fork do repositório.
2. Crie uma nova branch (`git checkout -b feature/sua-feature`).
3. Faça suas alterações e commit (`git commit -m 'feat: adiciona nova funcionalidade'`).
4. Envie para o branch original (`git push origin feature/sua-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.