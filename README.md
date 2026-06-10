# Sistema Web de Receitas (Trabalho Escolar)

Sistema web de receitas desenvolvido de forma **incremental**, em etapas pequenas, com **testes automatizados** criados e executados junto de cada funcionalidade.

## Stack do projeto

- Frontend: React + Vite
- UI: Bootstrap + CSS
- Backend: Node.js + Express
- Banco de dados: MongoDB Atlas com Mongoose
- AutenticaÃ§Ã£o: JWT + Argon2
- Testes:
  - Frontend: Jest + React Testing Library
  - Backend: Jest + Supertest
- CI: GitHub Actions

## Estrutura do repositÃ³rio

- `frontend/` â€” aplicaÃ§Ã£o React com Vite
- `backend/` â€” API Node.js com Express
- `backend/src/config/` â€” configuraÃ§Ãµes do backend, incluindo conexÃ£o com banco
- `backend/src/controllers/` â€” controllers da API
- `backend/src/middlewares/` â€” middlewares de erro e autenticaÃ§Ã£o
- `backend/src/models/` â€” models do Mongoose
- `backend/src/routes/` â€” rotas da API
- `backend/src/services/` â€” serviÃ§os auxiliares, como autenticaÃ§Ã£o
- `.github/workflows/` â€” workflows de integraÃ§Ã£o contÃ­nua
- `.env.example` â€” modelo de variÃ¡veis de ambiente
- `README.md` â€” documentaÃ§Ã£o do projeto

## Status atual

### Frontend

- Layout autenticado com Topbar e Sidebar.
- Sidebar conectada ao canto da tela, usando Bootstrap + CSS.
- Rotas pÃºblicas para login e cadastro.
- Rotas protegidas para dashboard, receitas, favoritos, lista de compras, histÃ³rico e perfil.
- AutenticaÃ§Ã£o real integrada com a API do backend.
- Login e cadastro consomem `/api/auth/login` e `/api/auth/register`.
- Token JWT salvo no navegador e enviado automaticamente nas requisiÃ§Ãµes autenticadas.
- SessÃ£o restaurada via `/api/auth/me` quando existe token salvo.
- Logout remove token e usuÃ¡rio do navegador.
- Listagem real de receitas consumindo a API, com busca e filtro por categoria.
- Cadastro, ediÃ§Ã£o, visualizaÃ§Ã£o e exclusÃ£o de receitas integrados com a API.
- Estados de carregamento e mensagens de erro nas telas de receitas.
- Biblioteca pessoal de receitas, separando receitas prÃ³prias e receitas adicionadas de outros usuÃ¡rios.
- FormulÃ¡rios principais criados para receitas, lista de compras, comentÃ¡rios e histÃ³rico.
- Comentários da página de detalhes integrados com a API real.
- Usuário autenticado pode criar, editar e excluir seus próprios comentários.
- Testes automatizados para autenticação real, rotas protegidas, listagem, filtros, formulários, ações de receitas e comentários integrados.

### Backend

- API Express configurada.
- ConexÃ£o com MongoDB Atlas via `MONGODB_URI`.
- AutenticaÃ§Ã£o com cadastro, login, JWT e middleware de rota protegida.
- Senhas armazenadas com hash usando Argon2.
- Model base de receitas criado com ingredientes e modo de preparo como listas de strings.
- Model base de comentÃ¡rios criado com relaÃ§Ã£o para usuÃ¡rio e receita.
- Categorias de receitas definidas por enum no backend.
- Rota de saÃºde disponÃ­vel em `GET /api/health`.
- Rotas de autenticaÃ§Ã£o disponÃ­veis em `/api/auth`.
- CRUD de receitas disponÃ­vel em `/api/recipes`, com aÃ§Ãµes protegidas por JWT.
- CRUD de comentÃ¡rios disponÃ­vel em `/api/comments`.
- Middleware para rota nÃ£o encontrada.
- Middleware central de erro.
- Testes automatizados com Jest + Supertest, incluindo validaÃ§Ãµes dos models base e rotas de comentÃ¡rios.

### IntegraÃ§Ã£o contÃ­nua

- Workflow de CI configurado em `.github/workflows/ci.yml`.
- A pipeline roda automaticamente em Pull Requests para `main`.
- A pipeline tambÃ©m roda em pushes para `main`.
- O CI instala dependÃªncias com `npm ci`.
- O CI executa testes do frontend.
- O CI gera o build do frontend.
- O CI executa testes do backend.

## Como rodar o projeto

PrÃ©-requisitos:

- Node.js instalado, de preferÃªncia versÃ£o LTS.
- Conta gratuita no MongoDB Atlas.
- Cluster criado no MongoDB Atlas.

### Instalar dependÃªncias

Na raiz do projeto:

```bash
npm install
```

## Configurar variÃ¡veis de ambiente

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

Para o frontend, o arquivo `frontend/.env.example` define:

```env
VITE_API_URL=/api
```

Em desenvolvimento, esse valor usa o proxy do Vite para encaminhar chamadas `/api` para `http://localhost:3000`.

## Configurar MongoDB Atlas

No MongoDB Atlas:

- Crie um cluster gratuito.
- Crie um usuÃ¡rio de banco com senha forte.
- Libere seu IP em **Network Access**.
- Copie a connection string do cluster.
- Substitua `usuario`, `senha` e `cluster` no `.env`.

Para desenvolvimento escolar, Ã© comum liberar temporariamente `0.0.0.0/0` no Atlas, mas isso permite conexÃ£o de qualquer IP. Use apenas se necessÃ¡rio e com senha forte.

## Rodar o frontend

```bash
cd frontend
npm run dev
```

Acesse:

- `http://localhost:5173`

Para usar login e cadastro reais pelo frontend, mantenha o backend rodando ao mesmo tempo.

Fluxo sugerido:

- Inicie o backend em `http://localhost:3000`.
- Inicie o frontend em `http://localhost:5173`.
- Acesse `/register` para criar uma conta real.
- Use essa conta em `/login`.
- Recarregue a pÃ¡gina para validar a restauraÃ§Ã£o da sessÃ£o via token.
- Clique em logout para remover token e usuÃ¡rio salvos.

## Rodar o backend

```bash
cd backend
npm run dev
```

A API sobe por padrÃ£o em:

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

### SaÃºde

- `GET /api/health` â€” verifica se a API estÃ¡ respondendo.

### AutenticaÃ§Ã£o

- `POST /api/auth/register` â€” cadastra usuÃ¡rio.
- `POST /api/auth/login` â€” autentica usuÃ¡rio e retorna JWT.
- `GET /api/auth/me` â€” retorna usuÃ¡rio logado, exigindo token Bearer.

### Receitas

- `GET /api/recipes` â€” lista receitas, exigindo token Bearer.
- `GET /api/recipes?busca=bolo` â€” busca receitas por tÃ­tulo ou descriÃ§Ã£o.
- `GET /api/recipes?categoria=Sobremesa` â€” filtra receitas por categoria.
- `GET /api/recipes/:id` â€” busca detalhes de uma receita.
- `POST /api/recipes` â€” cria receita para o usuÃ¡rio logado.
- `PATCH /api/recipes/:id` â€” edita receita do dono logado.
- `DELETE /api/recipes/:id` â€” remove receita do dono logado.

Exemplo de receita:

```json
{
  "titulo": "Bolo de cenoura",
  "descricao": "Receita simples para o cafÃ© da tarde.",
  "ingredientes": ["2 cenouras", "2 ovos", "1 xÃ­cara de aÃ§Ãºcar"],
  "modoPreparo": ["Bata os ingredientes", "Leve ao forno"],
  "tempoPreparo": 45,
  "categoria": "Sobremesa",
  "imagemUrl": ""
}
```

### ComentÃ¡rios

- `GET /api/comments` â€” lista comentÃ¡rios.
- `GET /api/comments?receita=idDaReceita` â€” lista comentÃ¡rios de uma receita.
- `GET /api/comments/:id` â€” busca um comentÃ¡rio.
- `POST /api/comments` â€” cria comentÃ¡rio, exigindo token Bearer.
- `PUT /api/comments/:id` â€” edita comentÃ¡rio do autor logado, exigindo token Bearer.
- `DELETE /api/comments/:id` â€” remove comentÃ¡rio do autor logado, exigindo token Bearer.

Exemplo de comentÃ¡rio:

```json
{
  "receita": "idDaReceita",
  "texto": "Ficou muito bom.",
  "nota": 5
}
```

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

A CI do projeto valida automaticamente os principais pontos antes de uma alteraÃ§Ã£o entrar na `main`.

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

- Favoritos individuais por usuÃ¡rio.
- Checklist para fazer receita e identificar ingredientes faltantes.
- Lista de compras gerada a partir dos ingredientes faltantes.
- HistÃ³rico persistido de receitas feitas.
- Compartilhamento de receitas por link e Web Share API quando disponÃ­vel.
- Deploy do frontend e backend.

## Roadmap incremental

1. Implementar favoritos, lista de compras e histórico com backend real.
2. Integrar favoritos, lista de compras e histórico no frontend.
3. Preparar deploy do frontend e backend.

## ObservaÃ§Ãµes de regra de negÃ³cio

- Categorias sÃ£o prÃ©-definidas e nÃ£o terÃ£o CRUD prÃ³prio.
- Ingredientes nÃ£o terÃ£o CRUD prÃ³prio; serÃ£o salvos como lista de strings dentro da receita.
- Modo de preparo tambÃ©m serÃ¡ salvo como lista de strings dentro da receita.
- Receitas prÃ³prias aparecem como parte da biblioteca do usuÃ¡rio.
- Receitas de outras pessoas adicionadas Ã  biblioteca devem indicar o autor original.
- O nome do autor original aparece apenas quando a receita foi adicionada de outra pessoa.

## SeguranÃ§a e variÃ¡veis de ambiente

- O arquivo `.env` real nÃ£o deve ser commitado.
- Credenciais do MongoDB Atlas, `JWT_SECRET` e URLs de produÃ§Ã£o devem ficar apenas no ambiente local ou no serviÃ§o de deploy.
- O repositÃ³rio deve manter apenas exemplos seguros, como `.env.example`.
- Antes de qualquer commit envolvendo backend, banco ou deploy, conferir `git status` para evitar subir segredos.
- NÃ£o use usuÃ¡rio administrador global do Atlas se nÃ£o for necessÃ¡rio.
- Use senha forte para o usuÃ¡rio do banco.
- Senhas de usuÃ¡rios da aplicaÃ§Ã£o sÃ£o salvas apenas como hash.
- A API nÃ£o retorna `passwordHash` nas respostas.

## Controle de versÃ£o

O projeto estÃ¡ sendo desenvolvido com commits pequenos e organizados.

Cada Pull Request deve informar as issues relacionadas usando:

```txt
Closes #numero-da-issue
```

Para a issue de autenticaÃ§Ã£o backend, use:

```txt
Closes #12
```

Para a issue de integraÃ§Ã£o da autenticaÃ§Ã£o do frontend com o backend, use:

```txt
Closes #13
```

Para a issue de integração do CRUD de receitas no frontend, use:

```txt
Closes #17
```

Para a issue de integração dos comentários do frontend com o backend, use:

```txt
Closes #20
```
