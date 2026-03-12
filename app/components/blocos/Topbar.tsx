"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useNavegacao } from "@/app/contexts/NavegacaoContext";

const rotulos: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/financas": "Finanças",
  "/dashboard/estoque": "Estoque",
  "/dashboard/vendas": "Vendas",
};

export function Topbar() {
  const caminho = usePathname();
  const { alternar } = useNavegacao();
  const titulo = rotulos[caminho] ?? "ERP Du Jojo";

  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:px-6 dark:border-zinc-800 dark:bg-zinc-950 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={alternar}
          className="lg:hidden p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
        >
          <Menu size={18} />
        </button>
        <h1 className="text-sm font-semibold text-zinc-900 dark:text-white">{titulo}</h1>
      </div>
      <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">
        DJ
      </div>
    </header>
  );
}
