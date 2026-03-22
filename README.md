# Dossiê Municipal do Mandato

## 1. Objetivo do Projeto

Este é um web app construído para um deputado estadual da Bahia e sua equipe, com o objetivo de centralizar informações políticas e de relacionamento por município. O sistema funciona como um dossiê político, permitindo que o deputado acesse dados cruciais (contatos, emendas, pendências, etc.) através de um PWA otimizado para celular, enquanto a equipe de assessoria e as lideranças locais gerenciam e alimentam o sistema.

## 2. Stack de Tecnologia

- **Frontend:** Next.js 14 (App Router) com TypeScript
- **Backend & Banco de Dados:** Supabase (PostgreSQL + Auth + Storage)
- **Estilização:** Tailwind CSS
- **PWA:** `next-pwa` para geração de service worker e manifesto.
- **Hosting:** Cloudflare Pages (frontend) + Supabase (backend).

## 3. Setup e Instalação

### Pré-requisitos

- Node.js (versão 20.x ou superior)
- npm
- Uma conta no [Supabase](https://supabase.com/)

### 3.1. Configuração do Supabase

1.  **Crie um novo projeto** no seu dashboard do Supabase.
2.  **Pegue as credenciais:** Vá para `Project Settings` > `API`. Você precisará da **Project URL** e da **anon key**.
3.  **Execute os scripts SQL:** Vá para o `SQL Editor` no seu projeto Supabase. Copie o conteúdo dos arquivos da pasta `supabase/migrations` deste projeto e execute-os em ordem (pelo timestamp no nome do arquivo). Isso criará todas as tabelas, funções e políticas de segurança necessárias.
    - `..._initial_schema.sql`
    - `..._add_perfil_trigger.sql`

### 3.2. Configuração Local

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd sistema_mandato
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Crie o arquivo de ambiente:**
    Crie um arquivo chamado `.env.local` na raiz do projeto e adicione suas credenciais do Supabase:
    ```
    NEXT_PUBLIC_SUPABASE_URL="SUA_URL_DO_SUPABASE_AQUI"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="SUA_ANON_KEY_DO_SUPABASE_AQUI"
    ```
    Substitua os valores pelos que você copiou do seu projeto Supabase.

### 3.3. Rodando o Projeto

Com tudo configurado, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## 4. Deploy

- **Frontend (Next.js):** O projeto está configurado para deploy automático no **Cloudflare Pages**. O build utiliza o adaptador `@cloudflare/next-on-pages` para suportar o Next.js 16 no Edge Runtime. Certifique-se de adicionar as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`) e ativar a flag `nodejs_compat` no painel da Cloudflare.
- **Backend (Supabase):** O Supabase já está na nuvem.

**URL do Deploy:** [https://sistemandato.pages.dev/](https://sistemandato.pages.dev/)

## 5. Histórico de Desenvolvimento (Changelog)

- **Estrutura do Projeto:** Inicializado projeto Next.js 14 com TypeScript e Tailwind CSS.
- **Banco de Dados:** Scripts SQL criados para todas as tabelas, funções e políticas de segurança (Row Level Security) no Supabase.
- **Estilização:** Tema escuro, fontes (`DM Sans`, `DM Serif Display`) e paleta de cores do protótipo foram implementados globalmente via `globals.css` e `tailwind.config.ts`.
- **Autenticação:** Sistema de login, signup e logout implementado com Supabase Auth, incluindo middleware para gerenciamento de sessão e um gatilho no DB para criação automática de perfis.
- **Visão do Deputado:**
    - Dashboard principal com grade de municípios.
    - Visão de detalhes do município com busca de dados e interface de abas completas (`Contatos`, `Políticos`, `Emendas`, `Obras`, `Eventos`, `Notas`, `Pendências`).
- **Visão da Liderança:**
    - Dashboard principal com estatísticas de contatos.
    - Implementação completa do fluxo de importação de contatos via arquivos `.vcf`, incluindo parsing no frontend e envio para o backend.
- **Visão da Assessoria (CRM Completo):**
    - Painel central com estatísticas e aprovação de contatos (`AprovalQueue`).
    - Gestão de Equipe (cadastro de Lideranças).
    - **NOVO:** Painel de administração de dados dinâmico (`/assessoria/municipio/[id]`) com CRUD completo (Server Actions) focado em injetar e editar as 6 entidades vitais do dossiê: Emendas, Obras, Eventos, Notas, Pendências e Políticos.
- **PWA:** Configuração básica do `next-pwa` com `manifest.json` e headers no layout para tornar o app instalável.
- **Aprimoramento do Dashboard do Deputado (Busca em Tempo Real):**
    - Implementada busca instantânea de municípios via Componente de Cliente (`CitySection`).
    - Exibição dinâmica de estatísticas em tempo real (Contatos Aprovados e Emendas) no `CityCard`, eliminando valores estáticos.
    - Otimização do carregamento de dados com `getMunicipios` atualizado.
- **Evolução do CRM Assessoria (Experiência SPA):**
    - Refatoração do `CrudPanel` para eliminar `window.location.reload()`, utilizando `router.refresh()` e atualizações de estado local para um fluxo contínuo.
    - Melhoria técnica nas Server Actions para retornar dados criados, garantindo integridade e velocidade na UI.
    - Polimento visual dos modais e botões de ação (`PromoteToAdminButton`) seguindo o novo padrão "Vibe PT".
- **Refinamento Visual "UI Pro Max":**
    - Aplicação rigorosa do tema Beige/PT Red em todos os componentes de detalhes (`EmendasTab`, `ContatosTab`).
    - **Layout Compacto:** Redução da largura da sidebar para 220px, diminuição de paddings globais (de 48px para 32px) e ajuste de densidade em todas as listas e cards para um visual mais executivo e denso.
    - **Layout Flutuante (Premium):** Implementação de `gap` e `padding` no container principal para criar uma separação elegante entre sidebar e corpo. Ambos os elementos agora operam como cards independentes com cantos `rounded-3xl` e efeito `glass`.
    - **Divisão Lógica de Dashboards:** Separação entre a visão de "Inteligência Estratégica" (`/`) e a "Gestão Territorial de Municípios" (`/assessoria`), garantindo que cada menu lateral tenha um propósito único e funcional.
    - Correção de visibilidade: Substituição de `text-white` por `text-accent` em todo o portal administrativo para compatibilidade total com o fundo bege.
    - Correção de tipagem TypeScript (`any`/`unknown`) em todo o fluxo de dados para maior estabilidade técnica.
- **Correção de Erros & Migração (Cloudflare):** Resolvido o erro 500 no deploy (timeout/configuração do Supabase) e migrado do Netlify para o Cloudflare Pages visando melhores limites de cota e performance no Edge Runtime.
