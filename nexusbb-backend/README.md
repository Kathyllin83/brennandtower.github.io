# NexusBB - Backend

Backend da plataforma de gestão de estoque NexusBB, desenvolvido em Node.js, Express e Prisma.

## Tecnologias Utilizadas

- **Framework**: Express.js
- **Linguagem**: JavaScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JSON Web Tokens (JWT)
- **Segurança**: bcryptjs para hashing de senhas

## Guia de Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento.

### 1. Clone o Repositório

Se você ainda não o fez, clone o projeto para sua máquina local.

### 2. Navegue até o Diretório

```bash
cd nexusbb-backend
```

### 3. Adicione os Arquivos de Dados

Este projeto utiliza um script (`seed`) para popular o banco de dados com dados iniciais. Para que funcione, você precisa fornecer os arquivos de dados:

- Coloque seus arquivos `dados_hackathon.csv` e `dados_hackathon.xlsx - Sheet1.csv` dentro da pasta `prisma/seeds/`.

### 4. Configure as Variáveis de Ambiente

O projeto precisa de algumas chaves para funcionar, como a conexão com o banco de dados e um segredo para o JWT.

- Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.
  ```bash
  cp .env.example .env
  ```
- Abra o arquivo `.env` e edite as seguintes variáveis:
  - `DATABASE_URL`: Insira a string de conexão do seu banco de dados PostgreSQL.
    ```
    # Exemplo:
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    ```
  - `JWT_SECRET`: Altere para qualquer chave secreta segura de sua preferência.

### 5. Instale as Dependências

Use o `npm` para instalar todas as dependências listadas no `package.json`.

```bash
npm install
```

### 6. Execute as Migrations do Prisma

Este comando irá ler o `schema.prisma` e criar toda a estrutura de tabelas no seu banco de dados.

```bash
npx prisma migrate dev --name init
```

### 7. Popule o Banco de Dados (Seed)

Este comando executará o script em `prisma/seeds/seed.js` para popular o banco com os dados dos arquivos CSV.

```bash
npx prisma db seed
```

### 8. Inicie o Servidor de Desenvolvimento

Com tudo configurado, inicie o servidor.

```bash
npm run dev
```

O servidor será iniciado (normalmente na porta 3000). Você verá a mensagem `Server is running on port 3000` no console e a API estará pronta para receber requisições.
