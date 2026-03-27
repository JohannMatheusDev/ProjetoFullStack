"use client";

import { useEffect, useState } from "react";
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { CartaoMetrica } from "@/app/components/compostos/CartaoMetrica";
import { Emblema } from "@/app/components/ui/Emblema";
import { Spinner } from "@/app/components/ui/Spinner";
import type { Lancamento, TipoLancamento } from "@/app/types";

const metricas = [
  { titulo: "Receita bruta", valor: "R$ 128.430", variacao: 12.4, icone: DollarSign },
  { titulo: "Entradas", valor: "R$ 96.200", variacao: 9.2, icone: ArrowUpRight },
  { titulo: "Saídas", valor: "R$ 34.100", variacao: -4.5, icone: ArrowDownRight },
  { titulo: "Saldo líquido", valor: "R$ 62.100", variacao: 18.1, icone: CreditCard },
];

const corTipo: Record<TipoLancamento, string> = {
  entrada: "text-green-600 dark:text-green-400",
  saida: "text-red-500",
};

export default function Financas() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("/api/financas")
      .then((r) => r.json())
      .then((d: Lancamento[]) => {
        setLancamentos(d);
        setCarregando(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Finanças</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Março 2026</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricas.map((m) => (
          <CartaoMetrica key={m.titulo} {...m} />
        ))}
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Lançamentos</h3>
        {carregando ? (
          <div className="flex justify-center py-8 text-zinc-400">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col">
            {lancamentos.map((l) => (
              <div
                key={l.descricao}
                className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{l.descricao}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-sm font-medium ${corTipo[l.tipo]}`}>
                    {l.tipo === "entrada" ? "+" : "-"}{l.valor}
                  </span>
                  <Emblema variante={l.tipo === "entrada" ? "sucesso" : "erro"}>
                    {l.tipo === "entrada" ? "Entrada" : "Saída"}
                  </Emblema>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
