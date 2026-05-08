# ERP Du Jojo

Sistema de Gestão Integrada (ERP) desenvolvido como SaaS, centralizando dados de finanças, estoque e vendas em uma única plataforma.

## Time

- **Du** — Eduardo Sochodolak
- **Jojo** — Johann Matheus Pedroso da Silva

## Problema

Pequenas e médias empresas operam com dados fragmentados entre planilhas, sistemas isolados e processos manuais. Isso gera inconsistência de informações, retrabalho e decisões baseadas em dados desatualizados.

O **ERP Du Jojo** resolve isso unificando os módulos de finanças, estoque e vendas em um painel centralizado, com dados em tempo real e acesso via browser — sem instalação, sem fricção.

## Solução

- **Finanças:** controle de receitas, despesas e fluxo de caixa
- **Estoque:** gestão de produtos, entradas e saídas
- **Vendas:** registro de pedidos e acompanhamento de clientes

## D4 — Data Core

Back-end inicial com NestJS, Prisma ORM e banco de dados PostgreSQL (Neon). Swagger ativo com documentação de todas as rotas.

**Módulos implementados:**

- **Usuários:** CRUD completo — criação com validação de e-mail único, listagem, busca por ID e remoção.
- **Vendas:** CRUD completo — registro com FK para usuário, atualização de status (PENDENTE / CONCLUIDO / CANCELADO).
- **Estoque:** CRUD completo — status do produto (normal / baixo / crítico) calculado no service layer a partir da quantidade.
- **Finanças:** CRUD + rota `GET /financas/resumo` retornando entradas, saídas e saldo consolidado.

**Destaques técnicos:**

- `PrismaModule` global com `PrismaService` injetável em todos os módulos
- DTOs com `class-validator` e `class-transformer` em todas as rotas de escrita
- Enums `StatusVenda` e `TipoLancamento` tipados no banco via Prisma
- Relacionamento `Venda → Usuario` com FK normalizada
- Campos monetários como `Decimal(10,2)` no PostgreSQL
- Swagger completo em `/api` com `ApiTags` e `ApiOperation` por rota
- Migrations versionadas em `backend/prisma/migrations/`

## Estrutura

```
fullstack/
├── frontend/
│   └── app/
│       ├── (auth)/
│       │   ├── login/page.tsx
│       │   └── cadastro/page.tsx
│       ├── api/                   ← mock (substituído no D5)
│       ├── dashboard/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── financas/page.tsx
│       │   ├── estoque/page.tsx
│       │   └── vendas/page.tsx
│       ├── components/
│       │   ├── ui/
│       │   ├── compostos/
│       │   └── blocos/
│       ├── contexts/
│       ├── types/
│       ├── layout.tsx
│       └── page.tsx
└── backend/
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    └── src/
        ├── main.ts
        ├── app.module.ts
        ├── prisma/
        ├── usuarios/
        ├── vendas/
        ├── estoque/
        └── financas/
```

## Protótipo

> Link Figma: [Figma](https://www.figma.com/design/zepJqvuStQap501MYW3pyQ/ERP?node-id=29-120&t=VdUnYthv31phVkXy-1)

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS v4 |
| Formulários | React Hook Form + Zod |
| Back-end | NestJS + Prisma ORM |
| Banco | PostgreSQL |
| Auth | JWT |
| Docs | Swagger |

## Setup

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Acesse em [http://localhost:3000](http://localhost:3000)

**Backend**
```bash
cd backend
cp .env.example .env   # configurar DATABASE_URL
npm install
npx prisma migrate dev --name init
npm run start:dev
```
API em [http://localhost:3001](http://localhost:3001) — Swagger em [http://localhost:3001/api](http://localhost:3001/api)
