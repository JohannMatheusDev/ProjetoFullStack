"use client";

import { useEffect, useState } from "react";
import { Package, PackageOpen, AlertTriangle, BarChart3 } from "lucide-react";
import { CartaoMetrica } from "@/app/components/compostos/CartaoMetrica";
import { Emblema } from "@/app/components/ui/Emblema";
import { Spinner } from "@/app/components/ui/Spinner";
import type { Produto, StatusProduto, VarianteEmblema } from "@/app/types";

const metricas = [
  { titulo: "Total em estoque", valor: "3.721", variacao: -3.2, icone: Package },
  { titulo: "Entradas no mês", valor: "842", variacao: 5.4, icone: PackageOpen },
  { titulo: "Itens críticos", valor: "14", variacao: -8.1, icone: AlertTriangle },
  { titulo: "Giro médio", valor: "4.2x", variacao: 2.1, icone: BarChart3 },
];

const varianteStatus: Record<StatusProduto, VarianteEmblema> = {
  normal: "sucesso",
  baixo: "aviso",
  critico: "erro",
};

const rotuloStatus: Record<StatusProduto, string> = {
  normal: "Normal",
  baixo: "Baixo",
  critico: "Crítico",
};

export default function Estoque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("/api/estoque")
      .then((r) => r.json())
      .then((d: Produto[]) => {
        setProdutos(d);
        setCarregando(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Estoque</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Março 2026</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricas.map((m) => (
          <CartaoMetrica key={m.titulo} {...m} />
        ))}
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Produtos</h3>
        {carregando ? (
          <div className="flex justify-center py-8 text-zinc-400">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col">
            {produtos.map((item) => (
              <div
                key={item.nome}
                className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{item.nome}</p>
                  <p className="text-xs text-zinc-500">{item.categoria}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 hidden sm:block">{item.quantidade} un.</span>
                  <Emblema variante={varianteStatus[item.status]}>{rotuloStatus[item.status]}</Emblema>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
