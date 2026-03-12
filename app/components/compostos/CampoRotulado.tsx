import { InputHTMLAttributes } from "react";
import { Campo } from "@/app/components/ui/Campo";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  rotulo: string;
  erro?: string;
  id: string;
};

export function CampoRotulado({ rotulo, erro, id, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {rotulo}
      </label>
      <Campo id={id} erro={!!erro} {...props} />
      {erro && <span className="text-xs text-red-500">{erro}</span>}
    </div>
  );
}
