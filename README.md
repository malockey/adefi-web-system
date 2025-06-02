
# ADEFI Web App

Projeto de extensão da Associação de Deficientes Físicos de Itajaí (ADEFI), desenvolvido como trabalho prático para o curso de Ciência da Computação, sob orientação do Professor Thiago Felski.

Este sistema tem por objetivo facilitar o cadastramento de pessoas com deficiência física, o agendamento de sessões de atendimento, a consulta de cadastros, além do gerenciamento de eventos e doações.

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura e Estrutura](#-arquitetura-e-estrutura)
- [Instalação e Execução](#-instalação-e-execução)
- [Autenticação e Segurança](#-autenticação-e-segurança)
- [Personalização Visual](#-personalização-visual)
- [Autor e Agradecimentos](#-autor-e-agradecimentos)

---

## 🎯 Visão Geral

Como parte de uma ação de extensão universitária, este projeto busca oferecer à comunidade da ADEFI uma plataforma web que:

- Digitaliza cadastros e consultas de pessoas com deficiência física.
- Centraliza o agendamento de sessões (fisioterapia, terapia ocupacional, etc.).
<!-- - Organiza o histórico de doações e permite o registro rápido de contribuições. -->
- Divulga eventos voltados ao público-alvo, com interface simples e responsiva.

Tudo isso com foco em **acessibilidade**, **usabilidade** e **segurança**, promovendo inclusão digital e ganhos de eficiência para a associação.

---

## 🔧 Funcionalidades

- ✅ Login e autenticação via Supabase Auth.
- ✅ Controle de acesso: apenas administradores (flag `is_admin`) veem páginas protegidas.
- ✅ Cadastro de Pessoas: registro de dados pessoais e tipo de deficiência.
- ✅ Agendamentos: criação, listagem e histórico de sessões.
- ✅ Busca avançada: filtros por nome, cidade, bairro, idade, tipo de deficiência.
<!-- - ✅ Doações: registro de valores e itens, histórico financeiro com totalizador.  -->
- ✅ Eventos: listagem, criação e modal “Leia mais” com detalhes.
- ✅ Favicon e identidade visual: ícone de cadeirante SVG, paleta roxa neutra, fontes claras.
- ✅ Design responsivo para desktop (em breve extensível a mobile).

---

## 🛠 Tecnologias Utilizadas

### Frontend

- React 18 + Vite
- TypeScript
- Tailwind CSS
- shadcn/ui (componentes acessíveis)
- React Query (fetch/cache)
- date-fns (formatação de datas)
- react-router-dom (roteamento)

### Backend & BaaS

- Supabase (PostgreSQL + Auth + Storage)

### Ferramentas de Desenvolvimento

- ESLint + Prettier
- Sonner (toasts)
- Git & GitHub

---

## 🏗 Arquitetura e Estrutura

```
src/
├─ components/            # UI genéricos: Navbar, Footer, PrivateRoute, AuthContext
├─ contexts/              # AuthContext para login/logout
├─ pages/                 # Páginas principais (Index, Login, Cadastro, Agendamentos…)
├─ services/              # Chamada às APIs Supabase (eventService, authService…)
├─ types/                 # Interfaces TS (Person, Appointment, Event, Donation…)
├─ lib/                   # Configuração do Supabase client, utils
└─ App.tsx                # Rotas protegidas e públicas, layout geral
public/
├─ adefi.ico              # Favicon principal (ICO)
```

- Context + PrivateRoute garantem que apenas usuários autenticados acessem as rotas protegidas.
- React Query centraliza fetch/caching, simplificando o fluxo de dados.
- Tailwind + shadcn/ui fornecem consistência de design, foco em acessibilidade e responsividade.

---

## 🚀 Instalação e Execução

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/adefi-webapp.git
cd adefi-webapp
```

2. **Instale as dependências:**

```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente:**  
Crie um arquivo `.env` na raiz com sua URL e chave do Supabase:

```env
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Execute o servidor de desenvolvimento:**

```bash
npm run dev
# ou
yarn dev
```

Acesse em [http://localhost:5173](http://localhost:5173).

5. **Build para produção:**

```bash
npm run build
# ou
yarn build
```

---

## 🔒 Autenticação e Segurança

- 🔐 **Login:** via Supabase Auth (`signInWithPassword`).
- 🔑 **Token JWT:** armazenado em `localStorage` como `access_token`.
- 🧠 **Context:** `AuthContext` gerencia estado de login/logout.
- 🛡️ **Rotas protegidas:** via `<PrivateRoute>`, redireciona não autenticados para `/login`.
- 👤 **Flag `is_admin`:** somente administradores conseguem acessar as páginas de cadastro, agendamento e busca.

---

## 🎨 Personalização Visual

- **Paleta de cores:** tons de azul neutro, cinza para textos e fundo branco.
- **Tipografia:** sans-serif legível, tamanhos escalonados para hierarquia.
- **Favicon:** adefi.ico.

---

## 👤 Autor e Agradecimentos

- **Integrante:** Mateus Silva  
- **Orientador:** Prof. Thiago Felski  
- **Contexto:** Projeto de Extensão – Curso de Ciência da Computação – Universidade do Vale do Itajaí (UNIVALI)

> "Inclusão é um direito, e a tecnologia é uma ponte para aproximar realidades."  
> – Mateus Silva, 2025

---

## 📝 Licença

MIT © Mateus Silva
