"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

type Props = {
  aberto: boolean;
  fechar: () => void;
  titulo: string;
  children: ReactNode;
};

export function Modal({ aberto, fechar, titulo, children }: Props) {
  useEffect(() => {
    if (!aberto) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={fechar} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">{titulo}</h2>
          <button
            onClick={fechar}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
