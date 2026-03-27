"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Toast } from "@/app/components/ui/Toast";
import type { VarianteToast } from "@/app/types";

type ToastItem = {
  id: string;
  mensagem: string;
  variante: VarianteToast;
};

type ContextoToast = {
  exibir: (mensagem: string, variante?: VarianteToast) => void;
};

const ToastContext = createContext<ContextoToast>({ exibir: () => {} });

export function ProvedorToast({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const fechar = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const exibir = useCallback(
    (mensagem: string, variante: VarianteToast = "info") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, mensagem, variante }]);
      setTimeout(() => fechar(id), 4000);
    },
    [fechar]
  );

  return (
    <ToastContext.Provider value={{ exibir }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast mensagem={t.mensagem} variante={t.variante} aoFechar={() => fechar(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
