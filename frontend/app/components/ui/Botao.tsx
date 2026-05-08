import { ButtonHTMLAttributes } from "react";
import type { VarianteBotao, TamanhoBotao } from "@/app/types";
import { Spinner } from "./Spinner";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: VarianteBotao;
  tamanho?: TamanhoBotao;
  carregando?: boolean;
  larguraTotal?: boolean;
};

const estilos: Record<VarianteBotao, string> = {
  primario: "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200",
  secundario: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700",
  fantasma: "bg-transparent text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
  perigo: "bg-red-500 text-white hover:bg-red-600",
};

const tamanhos: Record<TamanhoBotao, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Botao({
  variante = "primario",
  tamanho = "md",
  carregando = false,
  larguraTotal = false,
  children,
  disabled,
  className = "",
  ...props
}: Props) {
  return (
    <button
      disabled={disabled || carregando}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${estilos[variante]} ${tamanhos[tamanho]} ${larguraTotal ? "w-full" : ""} ${className}`}
      {...props}
    >
      {carregando && <Spinner tamanho="sm" />}
      {children}
    </button>
  );
}
