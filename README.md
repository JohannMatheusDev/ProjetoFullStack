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
