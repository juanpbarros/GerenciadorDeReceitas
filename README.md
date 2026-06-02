# Sistema Web de Receitas (Trabalho Escolar)

Sistema web de receitas desenvolvido de forma **incremental**, em etapas pequenas, com **testes automatizados** criados e executados junto de cada funcionalidade.

## Stack do projeto

- Frontend: React + Vite
- UI: Bootstrap + CSS
- Backend: Node.js + Express
- Banco de dados: MongoDB com Mongoose
- Autenticação: JWT + bcrypt
- Testes:
  - Frontend: Jest + React Testing Library
  - Backend: Jest + Supertest
- CI: GitHub Actions

## Estrutura do repositório

- `frontend/` — aplicação React com Vite
- `backend/` — API Node.js com Express
- `.github/workflows/` — workflows de integração contínua
- `.env.exemplo` — modelo de variáveis de ambiente
- `README.md` — documentação do projeto

## Status atual

### Frontend

- Layout autenticado com Topbar e Sidebar.
- Sidebar conectada ao canto da tela, usando Bootstrap + CSS.
- Rotas públicas para login e cadastro.
- Rotas protegidas para dashboard, receitas, favoritos, lista de compras, histórico e perfil.
- Autenticação mock com `localStorage`, apenas para simular o fluxo visual antes da integração com o backend.
- Listagem mock de receitas com busca e filtro por categoria.
- Biblioteca pessoal de receitas, separando receitas próprias e receitas adicionadas de outros usuários.
- Exibição de autoria apenas para receitas adicionadas de outras pessoas, por exemplo: `Receita de Rafaela`.
- Formulário de receita com ingredientes e modo de preparo em campos dinâmicos.
- Formulário de lista de compras com itens dinâmicos e status comprado/não comprado.
- Formulário de comentários e avaliações com nota de 1 a 5.
- Formulário de histórico de receitas feitas com data, observação e nota pessoal opcional.
- Testes automatizados para autenticação mock, listagem, filtros e formulários principais.

### Backend

- API Express configurada.
- Estrutura inicial em `src/` com controllers, routes, middlewares e tests.
- Rota de saúde disponível em `GET /api/health`.
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
- MongoDB Atlas será usado nas próximas etapas do backend com banco real.

### Instalar dependências

Na raiz do projeto:

```bash
npm install
```

Também é possível instalar por workspace:

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
```

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

Antes de abrir um Pull Request, recomenda-se rodar localmente:

```bash
cd frontend
npm test
npm run build
```

```bash
cd backend
npm test
```

## Funcionalidades planejadas

- Conexão com MongoDB Atlas usando variáveis de ambiente.
- Autenticação real com cadastro, login, logout, JWT e senha criptografada.
- CRUD real de receitas no backend.
- Integração do frontend com a API.
- Favoritos individuais por usuário.
- Checklist para fazer receita e identificar ingredientes faltantes.
- Lista de compras gerada a partir dos ingredientes faltantes.
- Histórico persistido de receitas feitas.
- Compartilhamento de receitas por link e Web Share API quando disponível.
- Deploy do frontend e backend.

## Roadmap incremental

1. Configurar conexão com MongoDB Atlas.
2. Implementar autenticação com JWT e testes.
3. Implementar CRUD de receitas com regras de dono e testes.
4. Integrar autenticação e receitas do frontend com a API.
5. Implementar comentários, favoritos, lista de compras e histórico com backend real.
6. Preparar deploy do frontend e backend.

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
- O repositório deve manter apenas exemplos seguros, como `.env.exemplo`.
- Antes de qualquer commit envolvendo backend, banco ou deploy, conferir `git status` para evitar subir segredos.

## Controle de versão

O projeto está sendo desenvolvido com commits pequenos e organizados.

Cada Pull Request deve informar as issues relacionadas usando:

```txt
Closes #numero-da-issue
```

Para a issue de CI, use:

```txt
Closes #5
```
