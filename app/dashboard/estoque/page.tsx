import { Package, PackageOpen, AlertTriangle, BarChart3 } from "lucide-react";
import { CartaoMetrica } from "@/app/components/compostos/CartaoMetrica";
import { Emblema } from "@/app/components/ui/Emblema";
import type { VarianteEmblema } from "@/app/types";

const metricas = [
  { titulo: "Total em estoque", valor: "3.721", variacao: -3.2, icone: Package },
  { titulo: "Entradas no mês", valor: "842", variacao: 5.4, icone: PackageOpen },
  { titulo: "Itens críticos", valor: "14", variacao: -8.1, icone: AlertTriangle },
  { titulo: "Giro médio", valor: "4.2x", variacao: 2.1, icone: BarChart3 },
];

type StatusItem = "normal" | "baixo" | "critico";

const itens: { nome: string; categoria: string; quantidade: number; status: StatusItem }[] = [
  { nome: "Notebook Pro X1", categoria: "Eletrônicos", quantidade: 48, status: "normal" },
  { nome: "Monitor UltraWide", categoria: "Eletrônicos", quantidade: 12, status: "baixo" },
  { nome: "Teclado Mecânico", categoria: "Periféricos", quantidade: 203, status: "normal" },
  { nome: "Cabo HDMI 2m", categoria: "Acessórios", quantidade: 3, status: "critico" },
  { nome: "Headset Gamer", categoria: "Periféricos", quantidade: 67, status: "normal" },
];

const varianteStatus: Record<StatusItem, VarianteEmblema> = {
  normal: "sucesso",
  baixo: "aviso",
  critico: "erro",
};

const rotuloStatus: Record<StatusItem, string> = {
  normal: "Normal",
  baixo: "Baixo",
  critico: "Crítico",
};

export default function Estoque() {
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
        <div className="flex flex-col">
          {itens.map((item) => (
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
      </div>
    </div>
  );
}
