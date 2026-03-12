import { TrendingUp, Package, ShoppingCart, DollarSign } from "lucide-react";
import { CartaoMetrica } from "@/app/components/compostos/CartaoMetrica";
import { Emblema } from "@/app/components/ui/Emblema";

const metricas = [
  { titulo: "Receita total", valor: "R$ 128.430", variacao: 12.4, icone: DollarSign },
  { titulo: "Vendas", valor: "1.284", variacao: 8.1, icone: ShoppingCart },
  { titulo: "Itens em estoque", valor: "3.721", variacao: -3.2, icone: Package },
  { titulo: "Margem média", valor: "34,2%", variacao: 1.8, icone: TrendingUp },
];

const atividade = [
  { desc: "Venda #1284 — Bernardo Barbosa", valor: "R$ 3.200", status: "sucesso" as const },
  { desc: "Venda #1283 — Moaca Manga", valor: "R$ 800", status: "sucesso" as const },
  { desc: "Reposição — Barbosa & Filhos", valor: "R$ 12.000", status: "aviso" as const },
  { desc: "Venda #1282 — Du Sochodolak", valor: "R$ 560", status: "sucesso" as const },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Visão geral</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Março 2026</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricas.map((m) => (
          <CartaoMetrica key={m.titulo} {...m} />
        ))}
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Atividade recente</h3>
          <Emblema variante="info">Março 2026</Emblema>
        </div>
        <div className="flex flex-col">
          {atividade.map((linha) => (
            <div
              key={linha.desc}
              className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
            >
              <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{linha.desc}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-medium text-zinc-900 dark:text-white">{linha.valor}</span>
                <Emblema variante={linha.status}>
                  {linha.status === "sucesso" ? "Concluído" : "Pendente"}
                </Emblema>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
