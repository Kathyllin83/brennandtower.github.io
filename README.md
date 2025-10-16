# NexusBB - Sistema de Gestão de Estoque

Este é um projeto full-stack de um sistema de gestão de estoque chamado NexusBB, construído com React, Node.js e PostgreSQL.

## Estrutura do Projeto

O projeto é um monorepo com a seguinte estrutura:

- **/backend**: Contém a API RESTful construída com Node.js, Express e Sequelize.
- **/frontend**: Contém a aplicação de cliente construída com React, Vite e Tailwind CSS.

---

## Requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

---

## Como Rodar o Projeto

Siga os passos abaixo para configurar e rodar a aplicação localmente.

### 1. Configuração do Back-end

O back-end agora usa SQLite, então a configuração é muito mais simples.

```bash
# 1. Navegue até a pasta do back-end
cd backend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O banco de dados será criado automaticamente como um arquivo `database.sqlite` na pasta `backend`.

O servidor do back-end estará rodando em `http://localhost:3001` (ou na porta que você definiu no arquivo `.env`).

### 2. Configuração do Front-end

Agora, em um **novo terminal**, vamos configurar e iniciar a aplicação React.

```bash
# 1. Navegue até a pasta do front-end
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação do front-end estará acessível em `http://localhost:5173` (ou em outra porta indicada pelo Vite).

### 3. Acessando a Aplicação

- **API URL**: O front-end fará chamadas para a API do back-end na URL `http://localhost:3001`.
- **App URL**: Abra seu navegador e acesse a URL fornecida pelo Vite (geralmente `http://localhost:5173`) para usar o NexusBB.

