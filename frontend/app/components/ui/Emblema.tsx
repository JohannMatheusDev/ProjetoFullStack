import type { VarianteEmblema } from "@/app/types";

type Props = {
  variante?: VarianteEmblema;
  children: React.ReactNode;
};

const estilos: Record<VarianteEmblema, string> = {
  padrao: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  sucesso: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  aviso: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  erro: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export function Emblema({ variante = "padrao", children }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${estilos[variante]}`}>
      {children}
    </span>
  );
}
