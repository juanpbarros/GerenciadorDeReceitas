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

## Estrutura do repositório

- `frontend/` — aplicação React com Vite
- `backend/` — API Node.js com Express
- `.env.exemplo` — modelo de variáveis de ambiente
- `README.md` — documentação do projeto

## Status atual

### Frontend base

- Layout autenticado com Topbar e Sidebar.
- Sidebar conectada ao canto da tela, usando Bootstrap + CSS.
- Rotas públicas para login e cadastro.
- Rotas protegidas para dashboard, receitas, favoritos, lista de compras, histórico e perfil.
- Autenticação mock com `localStorage`, apenas para simular o fluxo visual antes da integração com o backend.
- Listagem mock de receitas com busca e filtro por categoria.
- Testes automatizados iniciais do fluxo de autenticação e navegação.

### Backend base

- API Express configurada.
- Estrutura inicial em `src/` com controllers, routes, middlewares e tests.
- Rota de saúde disponível em `GET /api/health`.
- Middleware para rota não encontrada.
- Middleware central de erro.
- Testes automatizados com Jest + Supertest.

## Como rodar o projeto

Pré-requisitos:

- Node.js instalado, de preferência versão LTS.
- MongoDB será necessário nas próximas etapas do backend com banco real.

### Rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse:

- `http://localhost:5173`

Login mock:

- Email: qualquer email, por exemplo `joao@email.com`
- Senha: qualquer senha, por exemplo `123456`

### Rodar o backend

```bash
cd backend
npm install
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

## Funcionalidades planejadas

- Autenticação real com cadastro, login, logout, JWT e senha criptografada.
- CRUD de receitas com ingredientes e modo de preparo em campos dinâmicos.
- Biblioteca pessoal de receitas, separando receitas próprias e receitas adicionadas de outros usuários.
- Comentários e avaliações.
- Favoritos individuais por usuário.
- Checklist para fazer receita e identificar ingredientes faltantes.
- Lista de compras gerada a partir dos ingredientes faltantes.
- Histórico de receitas feitas.
- Compartilhamento de receitas por link e Web Share API quando disponível.

## Roadmap incremental

1. Frontend: completar os formulários principais e ajustar biblioteca pessoal de receitas.
2. Backend: implementar autenticação com JWT e testes.
3. Backend: implementar CRUD de receitas com regras de dono e testes.
4. Frontend: integrar autenticação e receitas com a API.
5. Implementar comentários, favoritos, lista de compras e histórico em etapas separadas.

## Observações de regra de negócio

- Categorias são pré-definidas e não terão CRUD próprio.
- Ingredientes não terão CRUD próprio; serão salvos como lista de strings dentro da receita.
- Modo de preparo também será salvo como lista de strings dentro da receita.
- Receitas próprias aparecem como parte da biblioteca do usuário.
- Receitas de outras pessoas adicionadas à biblioteca devem indicar o autor original, por exemplo: `Receita de Rafaela`.

## Controle de versão

O projeto está sendo desenvolvido com commits pequenos e organizados.

Esta branch de backend base deve fechar a issue `#3` quando o Pull Request for aberto ou atualizado com:

```txt
Closes #3
```
