import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

type Props = {
  titulo: string;
  valor: string;
  variacao?: number;
  icone: LucideIcon;
};

export function CartaoMetrica({ titulo, valor, variacao, icone: Icone }: Props) {
  const positivo = variacao !== undefined && variacao >= 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{titulo}</p>
          <p className="mt-1.5 text-2xl font-semibold text-zinc-900 dark:text-white">{valor}</p>
        </div>
        <div className="rounded-lg bg-zinc-100 p-2.5 dark:bg-zinc-800">
          <Icone size={18} className="text-zinc-600 dark:text-zinc-400" />
        </div>
      </div>
      {variacao !== undefined && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${positivo ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
          {positivo ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {positivo ? "+" : ""}{variacao}% este mês
        </div>
      )}
    </div>
  );
}
