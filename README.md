# Sistema Web de Receitas

Sistema web de receitas desenvolvido para trabalho escolar, com frontend em React, backend em Node.js/Express e banco de dados MongoDB Atlas.

O projeto permite que usuários criem receitas, comentem, favoritem, montem listas de compras e registrem receitas já feitas.

## Links do projeto

- Frontend: https://gerenciador-de-receitas-frontend.vercel.app
- Backend: https://gerenciadordereceitas.onrender.com
- Healthcheck da API: https://gerenciadordereceitas.onrender.com/api/health

> Observação: o backend está no plano gratuito do Render. No primeiro acesso, ele pode demorar alguns segundos para responder.

## Tecnologias utilizadas

### Frontend

- React
- Vite
- React Router
- Bootstrap + CSS
- Axios
- Jest
- React Testing Library

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- Argon2
- Jest
- Supertest

### Deploy e integração

- Frontend publicado na Vercel
- Backend publicado no Render
- Banco de dados no MongoDB Atlas
- CI/CD com GitHub Actions

## Funcionalidades implementadas

- Cadastro e login de usuários.
- Autenticação com JWT.
- Senhas protegidas com Argon2.
- Rotas protegidas no frontend e backend.
- CRUD de receitas.
- Busca e filtro de receitas por categoria.
- Comentários e avaliações em receitas.
- Favoritos por usuário.
- Lista de compras.
- Histórico de receitas feitas.
- Fluxo "Fazer Receita" com checklist de ingredientes.
- Compartilhamento de receita por link ou Web Share API.
- Mensagens de erro vindas da API nas telas de login e cadastro.
- Testes automatizados no frontend e backend.

## Estrutura do projeto

```txt
GerenciadorDeReceitas/
  backend/
    src/
      config/
      controllers/
      middlewares/
      models/
      routes/
      services/
      tests/
  frontend/
    src/
      components/
      contexts/
      layouts/
      pages/
      services/
      tests/
  .github/
    workflows/
  .env.example
  render.yaml
  vercel.json
```

## Como rodar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/juanpbarros/GerenciadorDeReceitas.git
cd GerenciadorDeReceitas
```

### 2. Instalar dependências

Na raiz do projeto:

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
copy .env.example .env
```

No Linux/macOS:

```bash
cp .env.example .env
```

Depois edite o `.env` com seus dados:

```env
PORT=3000
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/gerenciador-receitas?retryWrites=true&w=majority
JWT_SECRET=sua_chave_secreta
ALLOWED_ORIGINS=http://localhost:5173
```

Para rodar localmente, o frontend usa `/api` por padrão, conforme `frontend/.env.example`.

### 4. Rodar o backend

Em um terminal:

```bash
cd backend
npm run dev
```

A API ficará disponível em:

```txt
http://localhost:3000
```

Healthcheck local:

```txt
http://localhost:3000/api/health
```

### 5. Rodar o frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

O frontend ficará disponível em:

```txt
http://localhost:5173
```

## Como rodar os testes

### Testes do frontend

Na raiz do projeto:

```bash
npm --workspace frontend test -- --runInBand
```

Ou dentro da pasta `frontend`:

```bash
npm test
```

### Testes do backend

Na raiz do projeto:

```bash
npm --workspace backend test
```

Ou dentro da pasta `backend`:

```bash
npm test
```

### Build do frontend

Na raiz do projeto:

```bash
npm --workspace frontend run build
```

Ou dentro da pasta `frontend`:

```bash
npm run build
```

## Principais rotas da API

### Autenticação

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Receitas

- `GET /api/recipes`
- `POST /api/recipes`
- `GET /api/recipes/:id`
- `PATCH /api/recipes/:id`
- `DELETE /api/recipes/:id`

### Comentários

- `GET /api/comments`
- `POST /api/comments`
- `PUT /api/comments/:id`
- `DELETE /api/comments/:id`

### Favoritos

- `GET /api/favorites`
- `POST /api/favorites/:recipeId`
- `DELETE /api/favorites/:recipeId`

### Lista de compras

- `GET /api/shopping-lists`
- `POST /api/shopping-lists`
- `GET /api/shopping-lists/:id`
- `PATCH /api/shopping-lists/:id`
- `DELETE /api/shopping-lists/:id`

### Histórico

- `GET /api/recipe-history`
- `POST /api/recipe-history`
- `GET /api/recipe-history/:id`
- `PATCH /api/recipe-history/:id`
- `DELETE /api/recipe-history/:id`

## Deploy

O deploy foi separado em três serviços:

- Frontend: Vercel.
- Backend: Render.
- Banco de dados: MongoDB Atlas.

Variáveis importantes em produção:

### Frontend na Vercel

```env
VITE_API_URL=https://gerenciadordereceitas.onrender.com/api
```

### Backend no Render

```env
NODE_ENV=production
MONGODB_URI=sua_connection_string_do_mongodb_atlas
JWT_SECRET=sua_chave_secreta
ALLOWED_ORIGINS=https://gerenciador-de-receitas-frontend.vercel.app
```

Após merge na branch `main`, a Vercel e o Render fazem o deploy automaticamente.

## Segurança

- O arquivo `.env` real não deve ser versionado.
- Credenciais do MongoDB Atlas e `JWT_SECRET` devem ficar apenas em variáveis de ambiente.
- Senhas dos usuários são armazenadas como hash usando Argon2.
- A API não retorna o hash da senha nas respostas.

## Autores

- Juan Barros
- Rafaela Fayad
- Luís Borges
