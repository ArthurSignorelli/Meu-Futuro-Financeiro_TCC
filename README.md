# Meu Futuro Financeiro

Portal de educação financeira para jovens entre 15 e 29 anos, desenvolvido como Trabalho de Conclusão de Curso no Instituto Federal de Educação, Ciência e Tecnologia de São Paulo (IFSP) — Curso de Tecnologia em Análise e Desenvolvimento de Sistemas (ADS).

## Identidade Visual

O portal utiliza uma identidade visual preto e verde, associada às cores institucionais do IFSP. Possui três telas acessíveis (inicial, login/cadastro e dashboard), seguindo as diretrizes de acessibilidade WCAG 2.1.

## Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Front-end | React + Vite, CSS puro (sem frameworks), Axios |
| Back-end | Node.js + Express, API REST |
| Banco de Dados | PostgreSQL |
| Autenticação | JWT (JSON Web Token) + bcryptjs |
| Hospedagem | Render (Web Service + Static Site + PostgreSQL) |

## Estrutura do Projeto

```
tcc-app-react/
├── client/                 # Front-end React + Vite
│   ├── src/
│   │   ├── components/      # 11 componentes (Login, Dashboard, BehavioralTest, etc.)
│   │   ├── context/         # AuthContext (login, logout, JWT)
│   │   ├── api/             # Cliente Axios
│   │   └── styles/          # 6 arquivos CSS puro
│   └── .env.example
├── server/                 # Back-end Node.js + Express
│   ├── src/
│   │   ├── routes/         # auth.js, budget.js, test.js
│   │   ├── middleware/     # auth.js (verifyToken)
│   │   └── db.js           # Pool de conexão PostgreSQL
│   ├── migrations/
│   │   ├── 001_init.sql    # Criação das tabelas users, test_results, budgets
│   │   └── 002_add_field_data.sql  # Coluna field_data JSONB
│   └── .env.example
├── render.yaml             # Configuração de deploy no Render
└── package.json            # Scripts para rodar front + back juntos
```

## Funcionalidades

### Teste Comportamental

Questionário de cinco perguntas que identifica o perfil financeiro do usuário. Quatro perfis possíveis: Poupador, Consumidor Impulsivo, Investidor Iniciante e Equilibrado. Inspirado em referências como o teste de personalidade do 16Personalities. Cada perfil recebe recomendações de trilhas de aprendizagem personalizadas. O resultado é protegido por login e salvo no banco de dados.

### Trilhas de Aprendizagem

Trilhas de dicas de educação financeira, acessíveis apenas após login. Recomendadas com base no perfil identificado no teste comportamental.

### Calculadora de Orçamento Mensal

Calculadora interativa que permite organizar renda, contas fixas, contas não fixas e investimentos. Os dados são salvos por mês, permitindo comparar os meses e acompanhar a evolução financeira. Todos os campos individuais são persistidos no banco.

### Vídeos Educativos

A biblioteca de recursos disponibiliza vídeos demonstrativos de educação financeira para complementar o aprendizado.

### Login Obrigatório

O resultado do teste, as trilhas de aprendizagem e a calculadora de orçamento são protegidos por login. O usuário precisa se cadastrar e entrar para acessar essas funcionalidades, permitindo que o portal salve o progresso individual.

## Rodando Localmente no VSCode

Pré-requisitos: Node.js 18+ e PostgreSQL instalado.

```bash
# 1. Instalar dependências da raiz (concurrently)
npm install

# 2. Instalar dependências do front-end
cd client && npm install

# 3. Instalar dependências do back-end
cd ../server && npm install

# 4. Voltar para a raiz
cd ..

# 5. Criar o banco de dados
createdb -U postgres educa_finance

# 6. Rodar as migrations
psql -U postgres educa_finance -f server/migrations/001_init.sql
psql -U postgres educa_finance -f server/migrations/002_add_field_data.sql

# 7. Copiar arquivos .env
cp server/.env.example server/.env
cp client/.env.example client/.env

# 8. Configurar server/.env
# DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/educa_finance
# JWT_SECRET=minha-chave-secreta-2026
# PORT=3001

# 9. Rodar o projeto
npm run dev
```

O front-end abre em http://localhost:5173 e o back-end em http://localhost:3001.

## Deploy no Render

1. Faça push do código para um repositório no GitHub.
2. No Render, crie um PostgreSQL chamado `educa-finance-db` e copie a **Internal Database URL**.
3. Crie um **Web Service** apontando para a pasta `server/`, com build `npm install` e start `npm start`. Configure as variáveis:
   - `DATABASE_URL` = Internal Database URL do PostgreSQL
   - `JWT_SECRET` = uma chave secreta qualquer
4. Crie um **Static Site** apontando para a pasta `client/`, com build `npm install && npm run build`, publish directory `dist`. Configure a variável:
   - `VITE_API_URL` = URL do Web Service (sem barra no final)
5. Rode as migrations no banco do Render:
   ```bash
   psql "$EXTERNAL_DATABASE_URL" -f server/migrations/001_init.sql
   psql "$EXTERNAL_DATABASE_URL" -f server/migrations/002_add_field_data.sql
   ```

## Acessibilidade

O portal implementa recursos de acessibilidade WCAG 2.1: skip link, labels associados, fieldset/legend, estados de carregamento com aria-live, foco visível, navegação por teclado, landmarks semânticos, tabela com caption e suporte a prefers-reduced-motion.

## Autor

**Arthur dos Santos Signorelli**  
RA: CP3031004  
Curso de Tecnologia em Análise e Desenvolvimento de Sistemas (ADS)  
Instituto Federal de Educação, Ciência e Tecnologia de São Paulo (IFSP)  
2026
