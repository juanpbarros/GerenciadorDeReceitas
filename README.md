# Sistema Web de Receitas (Trabalho Escolar)

Sistema web de receitas desenvolvido **incrementalmente** (por etapas pequenas), com **testes automatizados** criados e executados a cada etapa.

## Stack (obrigatória)

- Frontend: React + Vite
- Backend: Node.js + Express
- Banco: MongoDB (Mongoose)
- Autenticação: JWT + bcrypt
- Testes:
  - Frontend: Jest + React Testing Library
  - Backend: Jest + Supertest (planejado)

## Estrutura do repositório

- `frontend/` — aplicação React (Vite)
- `backend/` — API Node/Express (em construção)

## O que já foi feito (Etapa 1 — Frontend base)

- Layout moderno com **Topbar** e **Sidebar** (área autenticada).
- Rotas:
  - Pública: `GET /login`, `GET /register`
  - Autenticada (protegida): `GET /`, `GET /receitas`, `GET /receitas/nova`, `GET /favoritos`, `GET /lista-compras`, `GET /historico`, `GET /perfil`
- Auth **mock** com persistência em `localStorage` (para demonstrar fluxo no frontend antes do backend).
- Tailwind CSS configurado (PostCSS compatível com Tailwind v4).
- Testes automatizados iniciais:
  - Redireciona para `/login` quando não autenticado
  - Renderiza dashboard quando autenticado
  - Logout retorna para `/login`

## Como acessar (Frontend)

Pré-requisitos:
- Node.js instalado (recomendado LTS)

Rodar o frontend:
```bash
cd frontend
npm install
npm run dev
```

Abrir no navegador:
- `http://localhost:5173`

Login (mock):
- Email: qualquer (ex.: `joao@email.com`)
- Senha: qualquer (ex.: `123456`)

Rodar testes do frontend:
```bash
cd frontend
npm test
```

## O que falta fazer (roadmap resumido)

O desenvolvimento continuará em **etapas pequenas** com testes a cada entrega.

Próximas etapas sugeridas:
1. Frontend: página de **Receitas** com cards (mock), busca e filtro por categoria + testes.
2. Backend: bootstrap do Express + testes (healthcheck).
3. Backend: autenticação real (register/login/me) + testes; integrar frontend com backend.
4. Backend + Frontend: CRUD de receitas (com permissões do dono) + testes.
5. Comentários/avaliações, Favoritos, Lista de compras, Histórico (sempre com testes).

## Observações

- As categorias serão pré-definidas (sem CRUD): Café da manhã, Almoço, Jantar, Sobremesa, Massas, Bebidas, Saladas, Lanches.
- Ingredientes e modo de preparo serão listas de strings (sem CRUD próprio).
