import type { Venda, Produto, Lancamento, StatusVenda, TipoLancamento } from "@/app/types";

const BASE = "http://localhost:3001";
const CHAVE_TOKEN = "erp_token";

export function salvarToken(token: string): void {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function buscarToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CHAVE_TOKEN);
}

export function removerToken(): void {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem("erp_usuario");
}

async function requisitar<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const token = buscarToken();
  const cabecalhos: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opcoes.headers as Record<string, string>),
  };
  if (token) cabecalhos["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE}${caminho}`, { ...opcoes, headers: cabecalhos });
  } catch {
    throw new Error("Servidor indisponível. Verifique se o backend está rodando.");
  }

  if (res.status === 401) {
    removerToken();
    window.location.href = "/login";
    throw new Error("Sessão expirada");
  }

  if (!res.ok) {
    const corpo = await res.json().catch(() => ({})) as { message?: string | string[] };
    const msg = Array.isArray(corpo.message)
      ? corpo.message[0]
      : (corpo.message ?? "Erro na requisição");
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

type VendaApi = {
  id: string;
  cliente: string;
  valor: string;
  status: string;
  usuarioId: string;
  usuario?: { nome: string };
};

type ProdutoApi = {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  preco: string;
  status: "normal" | "baixo" | "critico";
};

type LancamentoApi = {
  id: string;
  descricao: string;
  tipo: string;
  valor: string;
};

function normalizeVenda(v: VendaApi): Venda {
  return {
    id: v.id,
    cliente: v.cliente,
    valor: Number(v.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
    status: v.status.toLowerCase() as StatusVenda,
  };
}

function normalizeProduto(p: ProdutoApi): Produto {
  return {
    id: p.id,
    nome: p.nome,
    categoria: p.categoria,
    quantidade: p.quantidade,
    preco: Number(p.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
    status: p.status,
  };
}

function normalizeLancamento(l: LancamentoApi): Lancamento {
  return {
    id: l.id,
    descricao: l.descricao,
    tipo: l.tipo.toLowerCase() as TipoLancamento,
    valor: Number(l.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
  };
}

export const vendas = {
  listar: () =>
    requisitar<VendaApi[]>("/vendas").then((list) => list.map(normalizeVenda)),

  criar: (dados: { cliente: string; valor: number; produtoId?: string; quantidade?: number }) =>
    requisitar<VendaApi>("/vendas", {
      method: "POST",
      body: JSON.stringify(dados),
    }).then(normalizeVenda),

  atualizar: (id: string, dados: { cliente?: string; valor?: number; status?: string }) =>
    requisitar<VendaApi>(`/vendas/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...dados,
        ...(dados.status && { status: dados.status.toUpperCase() }),
      }),
    }).then(normalizeVenda),
};

export const estoque = {
  listar: () =>
    requisitar<ProdutoApi[]>("/estoque").then((list) => list.map(normalizeProduto)),

  criar: (dados: { nome: string; categoria: string; quantidade: number; preco: number }) =>
    requisitar<ProdutoApi>("/estoque", {
      method: "POST",
      body: JSON.stringify(dados),
    }).then(normalizeProduto),

  atualizar: (
    id: string,
    dados: { nome?: string; categoria?: string; quantidade?: number; preco?: number },
  ) =>
    requisitar<ProdutoApi>(`/estoque/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    }).then(normalizeProduto),

  remover: (id: string) =>
    requisitar<{ ok: boolean }>(`/estoque/${id}`, { method: "DELETE" }),
};

export const financas = {
  listar: () =>
    requisitar<LancamentoApi[]>("/financas").then((list) => list.map(normalizeLancamento)),

  criar: (dados: { descricao: string; tipo: string; valor: number }) =>
    requisitar<LancamentoApi>("/financas", {
      method: "POST",
      body: JSON.stringify({ ...dados, tipo: dados.tipo.toUpperCase() }),
    }).then(normalizeLancamento),

  resumo: () =>
    requisitar<{ entradas: number; saidas: number; saldo: number }>("/financas/resumo"),
};
