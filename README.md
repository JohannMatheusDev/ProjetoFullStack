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
- **Estoque:** gestão de produtos, entradas e saídas com alertas de nível crítico
- **Vendas:** registro de pedidos vinculados ao estoque, confirmação e cancelamento de pagamento

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5 (strict) |
| Estilização | Tailwind CSS v4 |
| Formulários | React Hook Form + Zod |
| Back-end | NestJS + Prisma ORM |
| Banco | PostgreSQL (Neon) |
| Auth | JWT + Passport |
| Docs | Swagger |


## D5 — Security

Autenticação JWT, proteção de rotas e integração completa front-end ↔ back-end.

**Autenticação:**

- `POST /auth/cadastro` — cria conta, retorna JWT + dados do usuário
- `POST /auth/login` — valida credenciais, retorna JWT
- Senhas hasheadas com bcryptjs (salt 10)
- Comparação timing-safe: bcrypt roda mesmo quando o e-mail não existe
- JWT com expiração de 7 dias, secret via variável de ambiente

**Segurança:**

- `JwtGuarda` em todos os controllers — qualquer rota sem token retorna 401
- `LocalGuarda` no login via Passport Strategy
- `usuarioId` extraído do JWT no servidor — nunca aceito do body do cliente
- Valor da venda calculado no servidor a partir de `produto.preco × quantidade`
- Rate limiting global (60 req/min) + login restrito a 5 tentativas/min (`@Throttle`)
- `ValidationPipe` com `whitelist` e `forbidNonWhitelisted` — rejeita campos não declarados nos DTOs
- CORS restrito a `http://localhost:3000`

**Regras de negócio (Service Layer):**

- Criação de venda em transação atômica: valida estoque → decrementa → cria venda
- Cancelamento de venda devolve a quantidade ao estoque na mesma transação
- Estoque insuficiente lança `BadRequestException` antes de qualquer escrita

**Integração front-end:**

- `lib/api.ts` — cliente HTTP centralizado com Bearer token automático e normalização de respostas
- 401 redireciona para `/login` e limpa o token local
- Erros do backend (400, 404, 409) exibidos via toast
- Dashboard, vendas, estoque e finanças consumindo dados reais do backend
- Sidebar exibe nome do usuário autenticado; logout encerra sessão e remove token

## Estrutura

```
fullstack/
├── frontend/
│   └── app/
│       ├── (auth)/
│       │   ├── login/page.tsx
│       │   └── cadastro/page.tsx
│       ├── dashboard/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── financas/page.tsx
│       │   ├── estoque/page.tsx
│       │   └── vendas/page.tsx
│       ├── components/
│       │   ├── ui/          ← Botao, Campo, Emblema, Divisor, Spinner, Toast, Modal
│       │   ├── compostos/   ← CampoRotulado, CartaoMetrica, ItemNav
│       │   └── blocos/      ← Sidebar, Topbar, CascoLayout, GuardaAuth
│       ├── contexts/        ← ToastContext, NavegacaoContext
│       ├── lib/             ← api.ts, auth.ts
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
        ├── auth/
        │   ├── dto/
        │   ├── estrategias/  ← local.estrategia.ts, jwt.estrategia.ts
        │   └── guardas/      ← jwt.guarda.ts, local.guarda.ts
        ├── usuarios/
        ├── vendas/
        ├── estoque/
        └── financas/
```

## Protótipo

[Figma](https://www.figma.com/design/zepJqvuStQap501MYW3pyQ/ERP?node-id=29-120&t=VdUnYthv31phVkXy-1)

## Setup

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Acesse em `http://localhost:3000`

**Backend**
```bash
cd backend
cp .env.example .env   # preencher DATABASE_URL e JWT_SECRET
npm install
npx prisma migrate dev
npm run start:dev
```
API em `http://localhost:3001` — Swagger em `http://localhost:3001/api`


# Adendo importante Commits 
```
d26e18f D5 Fix
938a767 Dados do banco
9e7cd3e Preparando integração D5
```
**Foram Apagados por push force e repostos """quase""" sem perdas por (D5 Reup pos bug - 58c1ede)**
