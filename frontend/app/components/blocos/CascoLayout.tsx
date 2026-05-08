"use client";

import { useNavegacao } from "@/app/contexts/NavegacaoContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function CascoLayout({ children }: { children: React.ReactNode }) {
  const { aberta, fechar } = useNavegacao();

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {aberta && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={fechar}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${aberta ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
