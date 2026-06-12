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
- Autenticação real integrada com a API do backend.
- Login e cadastro consomem `/api/auth/login` e `/api/auth/register`.
- Token JWT salvo no navegador e enviado automaticamente nas requisições autenticadas.
- Sessão restaurada via `/api/auth/me` quando existe token salvo.
- Logout remove token e usuário do navegador.
- Listagem real de receitas consumindo a API, com busca e filtro por categoria.
- Cadastro, edição, visualização e exclusão de receitas integrados com a API.
- Estados de carregamento e mensagens de erro nas telas de receitas.
- Biblioteca pessoal de receitas, separando receitas próprias e receitas adicionadas de outros usuários.
- Formulários principais criados para receitas, lista de compras, comentários e histórico.
- Comentários da página de detalhes integrados com a API real.
- Usuário autenticado pode criar, editar e excluir seus próprios comentários.
- Testes automatizados para autenticação real, rotas protegidas, listagem, filtros, formulários, ações de receitas e comentários integrados.

### Backend

- API Express configurada.
- Conexão com MongoDB Atlas via `MONGODB_URI`.
- Autenticação com cadastro, login, JWT e middleware de rota protegida.
- Senhas armazenadas com hash usando Argon2.
- Model base de receitas criado com ingredientes e modo de preparo como listas de strings.
- Model base de comentários criado com relação para usuário e receita.
- Categorias de receitas definidas por enum no backend.
- Rota de saúde disponível em `GET /api/health`.
- Rotas de autenticação disponíveis em `/api/auth`.
- CRUD de receitas disponível em `/api/recipes`, com ações protegidas por JWT.
- CRUD de comentários disponível em `/api/comments`.
- Middleware para rota não encontrada.
- Middleware central de erro.
- Testes automatizados com Jest + Supertest, incluindo validações dos models base e rotas de comentários.

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

Para o frontend, o arquivo `frontend/.env.example` define:

```env
VITE_API_URL=/api
```

Em desenvolvimento, esse valor usa o proxy do Vite para encaminhar chamadas `/api` para `http://localhost:3000`.

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

Para usar login e cadastro reais pelo frontend, mantenha o backend rodando ao mesmo tempo.

Fluxo sugerido:

- Inicie o backend em `http://localhost:3000`.
- Inicie o frontend em `http://localhost:5173`.
- Acesse `/register` para criar uma conta real.
- Use essa conta em `/login`.
- Recarregue a página para validar a restauração da sessão via token.
- Clique em logout para remover token e usuário salvos.

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

### Receitas

- `GET /api/recipes` — lista receitas, exigindo token Bearer.
- `GET /api/recipes?busca=bolo` — busca receitas por título ou descrição.
- `GET /api/recipes?categoria=Sobremesa` — filtra receitas por categoria.
- `GET /api/recipes/:id` — busca detalhes de uma receita.
- `POST /api/recipes` — cria receita para o usuário logado.
- `PATCH /api/recipes/:id` — edita receita do dono logado.
- `DELETE /api/recipes/:id` — remove receita do dono logado.

Exemplo de receita:

```json
{
  "titulo": "Bolo de cenoura",
  "descricao": "Receita simples para o café da tarde.",
  "ingredientes": ["2 cenouras", "2 ovos", "1 xícara de açúcar"],
  "modoPreparo": ["Bata os ingredientes", "Leve ao forno"],
  "tempoPreparo": 45,
  "categoria": "Sobremesa",
  "imagemUrl": ""
}
```

### Comentários

- `GET /api/comments` — lista comentários.
- `GET /api/comments?receita=idDaReceita` — lista comentários de uma receita.
- `GET /api/comments/:id` — busca um comentário.
- `POST /api/comments` — cria comentário, exigindo token Bearer.
- `PUT /api/comments/:id` — edita comentário do autor logado, exigindo token Bearer.
- `DELETE /api/comments/:id` — remove comentário do autor logado, exigindo token Bearer.

Exemplo de comentário:

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


## Preparacao de deploy

O projeto foi preparado para deploy separado de backend e frontend.

### Backend

Sugestao gratuita: Render Web Service.

Configuracoes esperadas:

- Arquivo de referencia: `render.yaml`.
- Build command: `npm install`.
- Start command: `npm --workspace backend start`.
- Healthcheck: `/api/health`.

Variaveis de ambiente obrigatorias no servico de backend:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=sua_connection_string_do_mongodb_atlas
JWT_SECRET=uma_chave_forte_e_secreta
ALLOWED_ORIGINS=https://url-do-frontend-publicado
```

### Frontend

Sugestao gratuita: Vercel.

Configuracoes esperadas:

- Arquivo de referencia: `vercel.json`.
- Install command: `npm install`.
- Build command: `npm --workspace frontend run build`.
- Output directory: `frontend/dist`.

Variavel de ambiente obrigatoria no servico de frontend:

```env
VITE_API_URL=https://url-do-backend-publicado/api
```

### Ordem recomendada

1. Publicar o backend primeiro.
2. Copiar a URL publica do backend.
3. Configurar `VITE_API_URL` no frontend com a URL do backend + `/api`.
4. Publicar o frontend.
5. Copiar a URL publica do frontend.
6. Configurar `ALLOWED_ORIGINS` no backend com a URL do frontend.
7. Reiniciar o backend e testar cadastro, login e rotas protegidas.

### Cuidados de seguranca

- Nunca colocar `MONGODB_URI` ou `JWT_SECRET` diretamente no codigo.
- Usar secrets/variaveis de ambiente do servico de deploy.
- Conferir `git status` antes de commitar alteracoes envolvendo deploy.
- No MongoDB Atlas, liberar apenas os IPs necessarios quando possivel.
- Se usar `0.0.0.0/0` no Atlas, manter senha forte e considerar restringir depois da apresentacao.

## Funcionalidades concluidas e pendentes

Concluidas:

- Favoritos individuais por usuario.
- Lista de compras persistida.
- Historico persistido de receitas feitas.
- Compartilhamento de receitas por link e Web Share API quando disponivel.
- Fluxo Fazer Receita com checklist de ingredientes e envio de faltantes para lista de compras.

Pendentes:

- Executar deploy nos servicos escolhidos.

## Roadmap incremental

1. Executar deploy nos servicos escolhidos.
2. Revisar o sistema completo para apresentacao.

## Observacoes de regra de negocio

- Categorias sao pre-definidas e nao terao CRUD proprio.
- Ingredientes nao terao CRUD proprio; serao salvos como lista de strings dentro da receita.
- Modo de preparo tambem sera salvo como lista de strings dentro da receita.
- Receitas proprias aparecem como parte da biblioteca do usuario.
- Receitas de outras pessoas adicionadas a biblioteca devem indicar o autor original.
- O nome do autor original aparece apenas quando a receita foi adicionada de outra pessoa.

## Seguranca e variaveis de ambiente

- O arquivo `.env` real nao deve ser commitado.
- Credenciais do MongoDB Atlas, `JWT_SECRET` e URLs de producao devem ficar apenas no ambiente local ou no servico de deploy.
- O repositorio deve manter apenas exemplos seguros, como `.env.example`.
- Antes de qualquer commit envolvendo backend, banco ou deploy, conferir `git status` para evitar subir segredos.
- Nao use usuario administrador global do Atlas se nao for necessario.
- Use senha forte para o usuario do banco.
- Senhas de usuarios da aplicacao sao salvas apenas como hash.
- A API nao retorna `passwordHash` nas respostas.

## Atualizacao - Compartilhamento de receitas

A pagina de detalhes da receita agora permite compartilhar receitas.

- Usa Web Share API quando disponivel no navegador.
- Usa copia do link para a area de transferencia como alternativa.
- Exibe feedback de sucesso ou erro para o usuario.
- Testes automatizados cobrem os dois fluxos.

Pull Request relacionado:

```txt
Closes #31
```

## Atualizacao - Favoritos de receitas

Os favoritos foram integrados com backend e frontend reais.

- Backend: favoritos protegidos por JWT em `/api/favorites`.
- Frontend: botao de estrela nas telas de receitas e detalhes.
- Pagina `/favoritos` lista receitas favoritadas pela API real.
- Favoritos sao individuais por usuario.
- Testes automatizados cobrem API e integracao da tela.

Pull Request relacionado:

```txt
Closes #29
```

## Atualizacao - Fazer Receita

O fluxo Fazer Receita foi integrado na pagina de detalhes da receita.

- Usuario pode abrir o modo de preparo com o botao `Fazer Receita`.
- Ingredientes aparecem em checklist para marcar o que o usuario ja possui.
- Ingredientes nao marcados aparecem na secao `Para comprar`.
- Ingredientes faltantes podem ser enviados para uma nova lista de compras pela API real.
- Testes automatizados cobrem checklist e criacao da lista de compras.

Pull Request relacionado:

```txt
Closes #30
```

## Atualizacao - Preparacao de deploy

O projeto foi preparado para publicacao em servicos gratuitos.

- Backend aceita `ALLOWED_ORIGINS` para liberar o frontend publicado via CORS.
- `.env.example` documenta as variaveis necessarias de producao.
- `frontend/.env.example` documenta `VITE_API_URL` para apontar para a API publicada.
- `render.yaml` registra uma configuracao base para backend no Render.
- `vercel.json` registra uma configuracao base para frontend na Vercel.
- README documenta ordem recomendada de publicacao e cuidados com secrets.

Pull Request relacionado:

```txt
Closes #32
```

## Atualizacao - Revisao final

Revisao final para apresentacao do trabalho escolar.

- Documentacao revisada para remover textos quebrados na parte final do README.
- Mensagens de erro de favoritos revisadas.
- Seguranca de variaveis de ambiente conferida.
- Testes e build devem passar antes do PR final.

Pull Request relacionado:

```txt
Closes #33
```

## Atualizacao - Mensagens de autenticacao

As telas de login e cadastro agora exibem mensagens de erro retornadas pela API.

- Login mostra mensagens como `Credenciais invalidas.` quando a API retorna esse erro.
- Cadastro mostra mensagens como `Email ja cadastrado.` quando o email informado ja existe.
- As telas mantem mensagens genericas como fallback para erros inesperados.
- Testes do frontend cobrem as mensagens reais da API nas telas de autenticacao.
