# Fullstack Transactions Dashboard

Uma aplicação fullstack que permite que usuários e administradores visualizem, filtrem e importem transações financeiras. Administradores podem fazer upload de planilhas para importar transações; usuários podem acompanhar seu extrato e saldo.

---

## 🛠 Tecnologias utilizadas

**Backend**
- Node.js
- Express
- Sequelize (ORM)
- MySQL
- JWT (Autenticação)
- Multer (Upload de arquivos)
- XLSX (Leitura de planilhas)

**Frontend**
- React e Typescript
- React Hook Form + Yup (formulários e validação)

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js (v18+)
- MySQL
- npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/laisbvieira/fullstack-transactions-dashboard.git
cd fullstack-transactions-dashboard
```

### 2. Configure o banco de dados MySQL

Crie um banco de dados chamado nex_challenge (ou o nome de sua preferência).

```bash
CREATE DATABASE nex_challenge;
```
⚠️ Se mudar o nome, atualize o arquivo .env do backend com o nome correto.

### 3. Backend

Edite o .env com suas credenciais MySQL, por exemplo:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=transactions_db
JWT_SECRET=sua_chave_secreta
```

Agora instale as dependências e rode as migrações:

```bash
npm install
npx sequelize-cli db:migrate
npm run dev
```

O backend estará disponível em: http://localhost:4000

### 4. Frontend

Edite o .env com a URL da API:

```bash
REACT_APP_API_URL=http://localhost:4000/api
```

Depois instale e rode:
```bash
npm install
npm start
```

O frontend estará disponível em: http://localhost:3000

## ✨ Funcionalidades

### Usuário comum

* Cadastro e login
* Visualização de extrato pessoal com filtros: Status e Período
* Visualização de saldo (pontos aprovados)

### Administrador

* Login com token
* Upload de planilhas de transações .xlsx no formato: CPF | Descrição | Data da transação | Valor em pontos | Valor | Status
* Relatório completo com filtros: CPF, Descrição, Período da transação, Faixa de valor e Status

⚠️ Na pasta assets foi adicionado uma planilha teste para testes


## 📂 Estrutura do projeto

```text
fullstack-transactions-dashboard/
│
├── backend/         # API em Node.js
│   ├── src/
│   ├── .env.example
│   └── ...
│
├── frontend/        # Aplicação React
│   ├── src/
│   ├── .env.example
│   └── ...
│
└── README.md
```

## Roadmap de melhorias 🛣️

🔧 Melhorias no layout e UX

📊 Incluir operações nas transações

📈 Adicionar relatórios gráficos

🔒 Otimizar segurança e autenticação

☁️ Deploy e escalabilidade (Migrar banco de dados para cloud, etc)

