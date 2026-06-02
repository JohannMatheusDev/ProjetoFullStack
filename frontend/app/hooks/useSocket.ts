"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useToast } from "@/app/contexts/ToastContext";

const socket = io("http://localhost:3001", { autoConnect: false });

export function useSocket() {
  const { exibir } = useToast();

  useEffect(() => {
    socket.connect();

    socket.on("venda:criada", (dados: { cliente: string; valor: number }) => {
      exibir(`Nova venda: ${dados.cliente} — R$ ${Number(dados.valor).toFixed(2)}`, "sucesso");
    });

    socket.on("venda:atualizada", (dados: { status: string }) => {
      const traduzido = { CONCLUIDO: "Concluído", PENDENTE: "Pendente", CANCELADO: "Cancelado" }[dados.status] ?? dados.status;
      exibir(`Venda atualizada → ${traduzido}`, "info");
    });

    socket.on("estoque:critico", (dados: { nome: string; quantidade: number }) => {
      exibir(`Estoque crítico: ${dados.nome} (${dados.quantidade} un.)`, "erro");
    });

    return () => {
      socket.off("venda:criada");
      socket.off("venda:atualizada");
      socket.off("estoque:critico");
      socket.disconnect();
    };
  }, [exibir]);
}
