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

## D3 — UI Milestone

Interface completa com estados complexos, validação de formulários e consumo de API mock.

**Módulos implementados:**

- **Estoque:** listagem de produtos com status dinâmico, modal de criação com formulário validado (Zod + RHF), edição inline via modal pré-preenchido e remoção com toast de feedback. Métricas de total em estoque e itens críticos calculadas em tempo real.
- **Vendas:** registro de nova venda via modal validado, listagem com badges de status. Métricas de vendas no mês, clientes ativos e ticket médio calculadas a partir dos dados.
- **Finanças:** lançamentos com tipo entrada/saída, modal de criação com select validado. Métricas de entradas, saídas e saldo líquido recalculadas a cada novo lançamento.
- **Autenticação:** fluxo completo de login e cadastro com validação por Zod, toasts de erro/sucesso e redirect automático.

**Destaques técnicos:**

- 5 formulários com React Hook Form + Zod (login, cadastro, nova venda, novo produto, novo lançamento)
- Toast system global via Context API com auto-dismiss
- Guarda de rotas (`GuardaAuth`) sem divergência de hidratação SSR/cliente
- API mock com estado em memória — GET, POST, PUT e DELETE
- TypeScript strict: zero `any`, zero erros de lint

## Estrutura

```
fullstack/app/
├── (auth)/
│   ├── login/page.tsx
│   └── cadastro/page.tsx
├── dashboard/
│   ├── layout.tsx         
│   ├── page.tsx
│   ├── financas/page.tsx
│   ├── estoque/page.tsx
│   └── vendas/page.tsx
├── components/
│   ├── ui/                
│   ├── compostos/          
│   └── blocos/  
├── contexts/               
├── types/                  
├── layout.tsx
└── page.tsx
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

```bash
cd fullstack
npm install
npm run dev
```

Acesse Localmente [http://localhost:3000](http://localhost:3000).
Acesse Online [erp-dujojo.vercel.app](erp-dujojo.vercel.app)
