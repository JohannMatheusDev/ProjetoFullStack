"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ContextoNavegacao = {
  aberta: boolean;
  alternar: () => void;
  fechar: () => void;
};

const NavegacaoContext = createContext<ContextoNavegacao>({
  aberta: false,
  alternar: () => {},
  fechar: () => {},
});

export function ProvedorNavegacao({ children }: { children: ReactNode }) {
  const [aberta, setAberta] = useState(false);
  return (
    <NavegacaoContext.Provider
      value={{
        aberta,
        alternar: () => setAberta((v) => !v),
        fechar: () => setAberta(false),
      }}
    >
      {children}
    </NavegacaoContext.Provider>
  );
}

export const useNavegacao = () => useContext(NavegacaoContext);
