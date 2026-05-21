"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Package, ShoppingCart, DollarSign } from "lucide-react";
import { CartaoMetrica } from "@/app/components/compostos/CartaoMetrica";
import { Emblema } from "@/app/components/ui/Emblema";
import { Spinner } from "@/app/components/ui/Spinner";
import { vendas as vendasApi, estoque as estoqueApi, financas as financasApi } from "@/app/lib/api";
import type { Venda, StatusVenda, VarianteEmblema } from "@/app/types";

type Resumo = { entradas: number; saidas: number; saldo: number };

const varianteStatus: Record<StatusVenda, VarianteEmblema> = {
  concluido: "sucesso",
  pendente: "aviso",
  cancelado: "erro",
};

const rotuloStatus: Record<StatusVenda, string> = {
  concluido: "Concluído",
  pendente: "Pendente",
  cancelado: "Cancelado",
};

export default function Dashboard() {
  const [carregando, setCarregando] = useState(true);
  const [resumo, setResumo] = useState<Resumo>({ entradas: 0, saidas: 0, saldo: 0 });
  const [totalVendas, setTotalVendas] = useState(0);
  const [totalEstoque, setTotalEstoque] = useState(0);
  const [recentes, setRecentes] = useState<Venda[]>([]);

  useEffect(() => {
    Promise.all([
      financasApi.resumo(),
      vendasApi.listar(),
      estoqueApi.listar(),
    ])
      .then(([res, listaVendas, listaProdutos]) => {
        setResumo(res);
        setTotalVendas(listaVendas.length);
        setTotalEstoque(listaProdutos.reduce((a, p) => a + p.quantidade, 0));
        setRecentes(listaVendas.slice(0, 5));
      })
      .finally(() => setCarregando(false));
  }, []);

  const margem =
    resumo.entradas > 0
      ? ((resumo.entradas - resumo.saidas) / resumo.entradas) * 100
      : 0;

  const metricas = [
    {
      titulo: "Receita total",
      valor: "R$ " + resumo.entradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      variacao: 12.4,
      icone: DollarSign,
    },
    {
      titulo: "Vendas",
      valor: totalVendas.toLocaleString("pt-BR"),
      variacao: 8.1,
      icone: ShoppingCart,
    },
    {
      titulo: "Itens em estoque",
      valor: totalEstoque.toLocaleString("pt-BR"),
      variacao: -3.2,
      icone: Package,
    },
    {
      titulo: "Margem média",
      valor: margem.toFixed(1) + "%",
      variacao: 1.8,
      icone: TrendingUp,
    },
  ];

  if (carregando) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Visão geral</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Maio 2026</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricas.map((m) => (
          <CartaoMetrica key={m.titulo} {...m} />
        ))}
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Vendas recentes</h3>
          <Emblema variante="info">Maio 2026</Emblema>
        </div>
        <div className="flex flex-col">
          {recentes.length === 0 ? (
            <p className="text-sm text-zinc-400 py-4 text-center">Nenhuma venda registrada.</p>
          ) : (
            recentes.map((v) => (
              <div
                key={v.id}
                className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{v.cliente}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    R$ {v.valor}
                  </span>
                  <Emblema variante={varianteStatus[v.status]}>{rotuloStatus[v.status]}</Emblema>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
