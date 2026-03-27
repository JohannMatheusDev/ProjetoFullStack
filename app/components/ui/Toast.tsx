"use client";

import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import type { VarianteToast } from "@/app/types";

type Props = {
  id: string;
  mensagem: string;
  variante: VarianteToast;
  aoFechar: () => void;
};

const estilos: Record<VarianteToast, string> = {
  sucesso: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300",
  erro: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
  aviso: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300",
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
};

const icones: Record<VarianteToast, typeof CheckCircle> = {
  sucesso: CheckCircle,
  erro: XCircle,
  aviso: AlertTriangle,
  info: Info,
};

export function Toast({ mensagem, variante, aoFechar }: Omit<Props, "id">) {
  const Icone = icones[variante];
  return (
    <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg min-w-64 max-w-sm text-sm font-medium animate-in slide-in-from-right-4 ${estilos[variante]}`}>
      <Icone size={16} className="shrink-0" />
      <span className="flex-1">{mensagem}</span>
      <button onClick={aoFechar} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
        <X size={14} />
      </button>
    </div>
  );
}
