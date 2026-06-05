# Sistema Web de Receitas (Trabalho Escolar)

Sistema web de receitas desenvolvido de forma **incremental**, em etapas pequenas, com **testes automatizados** criados e executados junto de cada funcionalidade.

## Stack do projeto

- Frontend: React + Vite
- UI: Bootstrap + CSS
- Backend: Node.js + Express
- Banco de dados: MongoDB Atlas com Mongoose
- Autenticação: JWT + Argon2
- Testes:
  - Frontend: Jest + React Testing Library
  - Backend: Jest + Supertest
- CI: GitHub Actions

## Estrutura do repositório

- `frontend/` — aplicação React com Vite
- `backend/` — API Node.js com Express
- `backend/src/config/` — configurações do backend, incluindo conexão com banco
- `backend/src/controllers/` — controllers da API
- `backend/src/middlewares/` — middlewares de erro e autenticação
- `backend/src/models/` — models do Mongoose
- `backend/src/routes/` — rotas da API
- `backend/src/services/` — serviços auxiliares, como autenticação
- `.github/workflows/` — workflows de integração contínua
- `.env.example` — modelo de variáveis de ambiente
- `README.md` — documentação do projeto

## Status atual

### Frontend

- Layout autenticado com Topbar e Sidebar.
- Sidebar conectada ao canto da tela, usando Bootstrap + CSS.
- Rotas públicas para login e cadastro.
- Rotas protegidas para dashboard, receitas, favoritos, lista de compras, histórico e perfil.
- Autenticação mock com `localStorage`, enquanto a integração real com a API ainda não foi feita.
- Listagem mock de receitas com busca e filtro por categoria.
- Biblioteca pessoal de receitas, separando receitas próprias e receitas adicionadas de outros usuários.
- Formulários principais criados para receitas, lista de compras, comentários e histórico.
- Testes automatizados para autenticação mock, listagem, filtros e formulários principais.

### Backend

- API Express configurada.
- Conexão com MongoDB Atlas via `MONGODB_URI`.
- Autenticação com cadastro, login, JWT e middleware de rota protegida.
- Senhas armazenadas com hash usando Argon2.
- Rota de saúde disponível em `GET /api/health`.
- Rotas de autenticação disponíveis em `/api/auth`.
- Middleware para rota não encontrada.
- Middleware central de erro.
- Testes automatizados com Jest + Supertest.

### Integração contínua

- Workflow de CI configurado em `.github/workflows/ci.yml`.
- A pipeline roda automaticamente em Pull Requests para `main`.
- A pipeline também roda em pushes para `main`.
- O CI instala dependências com `npm ci`.
- O CI executa testes do frontend.
- O CI gera o build do frontend.
- O CI executa testes do backend.

## Como rodar o projeto

Pré-requisitos:

- Node.js instalado, de preferência versão LTS.
- Conta gratuita no MongoDB Atlas.
- Cluster criado no MongoDB Atlas.

### Instalar dependências

Na raiz do projeto:

```bash
npm install
```

## Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
copy .env.example .env
```

No Linux/macOS:

```bash
cp .env.example .env
```

Depois edite o `.env` com os valores reais:

```env
PORT=3000
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/gerenciador-receitas?retryWrites=true&w=majority
JWT_SECRET=troque-por-uma-chave-secreta-forte
```

## Configurar MongoDB Atlas

No MongoDB Atlas:

- Crie um cluster gratuito.
- Crie um usuário de banco com senha forte.
- Libere seu IP em **Network Access**.
- Copie a connection string do cluster.
- Substitua `usuario`, `senha` e `cluster` no `.env`.

Para desenvolvimento escolar, é comum liberar temporariamente `0.0.0.0/0` no Atlas, mas isso permite conexão de qualquer IP. Use apenas se necessário e com senha forte.

## Rodar o frontend

```bash
cd frontend
npm run dev
```

Acesse:

- `http://localhost:5173`

Login mock:

- Email: qualquer email, por exemplo `joao@email.com`
- Senha: qualquer senha, por exemplo `123456`

## Rodar o backend

```bash
cd backend
npm run dev
```

A API sobe por padrão em:

- `http://localhost:3000`

Healthcheck:

- `GET http://localhost:3000/api/health`

Resposta esperada:

```json
{
  "ok": true
}
```

## Rotas da API

### Saúde

- `GET /api/health` — verifica se a API está respondendo.

### Autenticação

- `POST /api/auth/register` — cadastra usuário.
- `POST /api/auth/login` — autentica usuário e retorna JWT.
- `GET /api/auth/me` — retorna usuário logado, exigindo token Bearer.

Exemplo de cadastro:

```json
{
  "nome": "Maria",
  "email": "maria@email.com",
  "senha": "123456"
}
```

Exemplo de uso do token:

```txt
Authorization: Bearer seu_token_jwt
```

## Testes automatizados

Rodar testes do frontend:

```bash
cd frontend
npm test
```

Rodar testes do backend:

```bash
cd backend
npm test
```

Rodar build do frontend:

```bash
cd frontend
npm run build
```

## GitHub Actions

A CI do projeto valida automaticamente os principais pontos antes de uma alteração entrar na `main`.

Workflow:

- Arquivo: `.github/workflows/ci.yml`
- Eventos:
  - Pull Request para `main`
  - Push na `main`
- Comandos executados:
  - `npm ci`
  - `npm --workspace frontend test -- --runInBand`
  - `npm --workspace frontend run build`
  - `npm --workspace backend test`

## Funcionalidades planejadas

- Integração da autenticação real com o frontend.
- CRUD real de receitas no backend.
- Integração do frontend com a API.
- Favoritos individuais por usuário.
- Checklist para fazer receita e identificar ingredientes faltantes.
- Lista de compras gerada a partir dos ingredientes faltantes.
- Histórico persistido de receitas feitas.
- Compartilhamento de receitas por link e Web Share API quando disponível.
- Deploy do frontend e backend.

## Roadmap incremental

1. Integrar autenticação real do frontend com a API.
2. Implementar CRUD de receitas com regras de dono e testes.
3. Integrar receitas do frontend com a API.
4. Implementar comentários, favoritos, lista de compras e histórico com backend real.
5. Preparar deploy do frontend e backend.

## Observações de regra de negócio

- Categorias são pré-definidas e não terão CRUD próprio.
- Ingredientes não terão CRUD próprio; serão salvos como lista de strings dentro da receita.
- Modo de preparo também será salvo como lista de strings dentro da receita.
- Receitas próprias aparecem como parte da biblioteca do usuário.
- Receitas de outras pessoas adicionadas à biblioteca devem indicar o autor original.
- O nome do autor original aparece apenas quando a receita foi adicionada de outra pessoa.

## Segurança e variáveis de ambiente

- O arquivo `.env` real não deve ser commitado.
- Credenciais do MongoDB Atlas, `JWT_SECRET` e URLs de produção devem ficar apenas no ambiente local ou no serviço de deploy.
- O repositório deve manter apenas exemplos seguros, como `.env.example`.
- Antes de qualquer commit envolvendo backend, banco ou deploy, conferir `git status` para evitar subir segredos.
- Não use usuário administrador global do Atlas se não for necessário.
- Use senha forte para o usuário do banco.
- Senhas de usuários da aplicação são salvas apenas como hash.
- A API não retorna `passwordHash` nas respostas.

## Controle de versão

O projeto está sendo desenvolvido com commits pequenos e organizados.

Cada Pull Request deve informar as issues relacionadas usando:

```txt
Closes #numero-da-issue
```

Para a issue de autenticação backend, use:

```txt
Closes #12
```
