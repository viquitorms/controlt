# ControlT: Sistema de Gestão de Produtividade (GTD + CMMI)

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg">
  <img alt="React" src="https://img.shields.io/badge/React-18-blue?logo=react">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-18-green?logo=node.js">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-5-blueviolet?logo=prisma">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-15-darkblue?logo=postgresql">
</p>

<p align="center">
  <strong>Sistema web de gestão de produtividade que integra a metodologia Getting Things Done (GTD) com métricas de maturidade de processos do CMMI nível 2</strong>
</p>

<p align="center">
  <em>Trabalho de Conclusão de Curso - Sistemas de Informação - PUC Minas</em>
</p>

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
  - [O Problema](#o-problema)
  - [A Solução](#a-solução)
- [Principais Funcionalidades](#-principais-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Métricas CMMI](#-métricas-cmmi)
- [Screenshots](#-screenshots)
- [Documentação](#-documentação)
- [Autor](#-autor)
- [Licença](#-licença)

## 🎯 Sobre o Projeto

### O Problema

Organizações de TI enfrentam um desafio duplo: manter a produtividade individual dos colaboradores enquanto buscam maturidade nos processos organizacionais. Frameworks como CMMI exigem medição e análise contínuas, mas a coleta de métricas geralmente é manual e burocrática, criando sobrecarga administrativa.

### A Solução

O **ControlT** integra duas abordagens complementares:

- **Bottom-up (GTD)**: Os colaboradores gerenciam seu fluxo de trabalho através dos 5 estágios do GTD (Capturar, Esclarecer, Organizar, Refletir, Engajar)
- **Top-down (CMMI)**: O sistema captura automaticamente métricas de eficiência alinhadas ao CMMI nível 2, sem esforço adicional do usuário

## ✨ Principais Funcionalidades

### 📥 Fluxo GTD Completo
- **Caixa de Entrada (Inbox)**: Captura rápida de todas as tarefas e ideias
- **Wizard de Processamento**: Interface guiada para classificação (É acionável? < 2 min? Delegar?)
- **Listas GTD**:
  - ✅ Próximas Ações
  - ⏳ Aguardando
  - 📅 Agendadas
  - 💭 Algum Dia/Talvez
  - 📚 Referências
  - 🗂️ Projetos

### 📊 Métricas Automáticas CMMI
- **Lead Time**: Tempo desde captura até conclusão
- **Taxa de Conclusão**: Percentual de tarefas concluídas vs planejadas
- **Tempo de Processamento**: Análise da eficiência do fluxo
- **Distribuição por Status**: Visibilidade do pipeline de trabalho

### 👥 Gestão Organizacional
- Sistema de usuários com perfis (Colaborador/Gerente)
- Gestão de equipes
- Gestão de projetos
- Autenticação JWT segura

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────┐
│         Frontend (React + MUI)          │
│         SPA - Single Page App           │
└─────────────────────────────────────────┘
                    │
                    │ HTTP/REST
                    ▼
┌─────────────────────────────────────────┐
│         Backend (Node + Express)        │
│              API REST                   │
├─────────────────────────────────────────┤
│  Controllers → Services → Repository    │
└─────────────────────────────────────────┘
                    │
                    │ Prisma ORM
                    ▼
┌─────────────────────────────────────────┐
│        PostgreSQL (Supabase)            │
│           Banco de Dados                │
└─────────────────────────────────────────┘
```

## 🛠️ Tecnologias

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| **Frontend** | React.js | 18.x |
| **UI Library** | Material-UI (MUI) | 5.x |
| **Backend** | Node.js | 18.x |
| **Framework** | Express.js | 4.x |
| **ORM** | Prisma | 5.x |
| **Banco de Dados** | PostgreSQL | 15.x |
| **Linguagem** | TypeScript | 5.x |
| **Autenticação** | JWT | - |
| **Hospedagem DB** | Supabase | - |

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- PostgreSQL (local ou Supabase)

### Backend

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/controlt.git
cd controlt/backend

# Instale as dependências
npm install

# Configure o .env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="seu-secret-aqui"
PORT=3333

# Execute as migrações
npx prisma migrate dev

# Popule o banco com dados iniciais
npx prisma db seed

# Inicie o servidor
npm run dev
```

### Frontend

```bash
# Em outro terminal
cd controlt/frontend

# Instale as dependências  
npm install

# Configure o .env
VITE_API_URL="http://localhost:3333"

# Inicie a aplicação
npm run dev
```

Acesse: http://localhost:5173

**Credenciais padrão:**
- Email: admin@controlt.com
- Senha: admin

## 📁 Estrutura do Projeto

```
controlt/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── dtos/
│   └── index.html
│
└── docs/
    └── diagrams/
```

## 📈 Métricas CMMI

### Lead Time
```javascript
LeadTime = DataConclusao - DataCaptura
```
Mede o tempo total desde a captura de um item até sua conclusão, fornecendo visibilidade sobre a eficiência do fluxo.

### Taxa de Conclusão
```javascript
TaxaConclusao = (TarefasConcluidas / TarefasPlanejadas) × 100%
```
Avalia a capacidade de entrega da equipe comparando o planejado vs realizado.

### Mapeamento GTD → CMMI

| Estágio GTD | Área CMMI | Métrica Capturada |
|-------------|-----------|-------------------|
| Capturar | Requirements Management | Timestamp inicial, volume |
| Esclarecer | Project Planning | Tempo de decisão |
| Organizar | Work Planning | Distribuição por contexto |
| Refletir | Measurement & Analysis | Frequência de revisão |
| Engajar | Project Monitoring | Taxa de conclusão |

## 👨‍💻 Autor

**Victor Magalhães de Souza**

- GitHub: [@victormagalhaes](https://github.com/viquitorms)
- LinkedIn: [Victor Magalhães](https://linkedin.com/in/victormagalhaes)
- Email: vicmagalhaes20@gmail.com

**Orientador:** Prof. Leonardo Vilela Cardoso

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Desenvolvido com ❤️ para o TCC de Sistemas de Informação<br>
  PUC Minas - 2024
</p>
