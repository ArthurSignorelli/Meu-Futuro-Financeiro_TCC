# Meu Futuro Financeiro — React + Express + PostgreSQL

Aplicação acadêmica do TCC de educação financeira para jovens. Esta versão substitui o Firebase por uma API REST em Express, autenticação JWT, PostgreSQL e uma interface React/Vite com CSS puro. O visual e os fluxos foram convertidos a partir do protótipo HTML em `../tcc-app/index.html`.

## Estrutura

- `client/`: front-end React + Vite, Axios e estado de navegação simples (sem React Router).
- `server/`: API Express, `pg`, `bcryptjs`, JWT e rotas de autenticação, teste e orçamento.
- `server/migrations/001_init.sql`: tabelas `users`, `test_results` e `budgets`.
- `render.yaml`: configuração do web service, static site e PostgreSQL no Render.

## Rodar local no VSCode

Pré-requisitos: Node.js 18+ e PostgreSQL local (ou uma URL de PostgreSQL). Na raiz `data/tcc-app-react`:

```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
createdb educa_finance
psql educa_finance -f server/migrations/001_init.sql
cp server/.env.example server/.env
cp client/.env.example client/.env
# ajuste DATABASE_URL e JWT_SECRET em server/.env
npm run dev
```

Abra `http://localhost:5173`. O Vite encaminha `/api` para `http://localhost:3001`. Para iniciar somente a API use `npm start`; o endpoint `GET /api/health` confirma que o Express está ativo.

## Deploy no Render

1. Faça push deste diretório para um repositório GitHub.
2. No Render, crie um PostgreSQL chamado `educa-finance-db`.
3. Crie um Web Service com root directory `server`, build `npm install` e start `npm start`; configure `DATABASE_URL` e `JWT_SECRET`.
4. Crie um Static Site com root directory `client`, build `npm install && npm run build`, publish directory `dist` e `VITE_API_URL` com a URL do Web Service.
5. Ou use `render.yaml` como blueprint. Depois de criar o banco, rode a migration usando a URL interna: `psql "$DATABASE_URL" -f migrations/001_init.sql` a partir de `server`.

Não coloque `.env` no Git. `client/.env.example` e `server/.env.example` mostram somente os nomes das variáveis necessárias.

## Funcionalidades

A home tem hero, apresentação, teste com cinco perguntas, quatro perfis e recomendações diferentes. O resultado do teste e as trilhas são protegidos por login. Após o login iniciado pelo teste, o fluxo retorna à home e processa automaticamente as respostas preservadas na sessão. O dashboard apresenta sidebar fixa de 240px, progresso, biblioteca, dois vídeos YouTube, calculadora completa por mês de 2026 e comparativo dos orçamentos salvos.

A API expõe `POST/GET /api/auth`, `POST/GET /api/test` e `POST/GET /api/budget`, com Bearer JWT nas rotas privadas. Senhas são armazenadas somente como hash bcrypt.

## Acessibilidade

Há skip link, labels associados, `fieldset`/`legend`, estados de carregamento com `aria-live`, foco visível, navegação por teclado, landmarks semânticos, tabela com caption e suporte a `prefers-reduced-motion`.
