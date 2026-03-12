"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ItemNavegacao } from "@/app/types";
import { useNavegacao } from "@/app/contexts/NavegacaoContext";

type Props = {
  item: ItemNavegacao;
};

export function ItemNav({ item }: Props) {
  const caminho = usePathname();
  const { fechar } = useNavegacao();
  const ativo =
    caminho === item.href ||
    (item.href !== "/dashboard" && caminho.startsWith(item.href));
  const Icone = item.icone;

  return (
    <Link
      href={item.href}
      onClick={fechar}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${ativo ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"}`}
    >
      <Icone size={16} />
      {item.rotulo}
    </Link>
  );
}
