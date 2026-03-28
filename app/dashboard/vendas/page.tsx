"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShoppingCart, Users, TrendingUp, Star, Plus } from "lucide-react";
import { CartaoMetrica } from "@/app/components/compostos/CartaoMetrica";
import { CampoRotulado } from "@/app/components/compostos/CampoRotulado";
import { Emblema } from "@/app/components/ui/Emblema";
import { Botao } from "@/app/components/ui/Botao";
import { Modal } from "@/app/components/ui/Modal";
import { Spinner } from "@/app/components/ui/Spinner";
import { useToast } from "@/app/contexts/ToastContext";
import type { Venda, StatusVenda, VarianteEmblema } from "@/app/types";


const varianteStatus: Record<StatusVenda, VarianteEmblema> = {
  concluido: "sucesso",
  pendente: "aviso",
  cancelado: "erro",
};

const rotuloStatus: Record<StatusVenda, string> = {
  concluido: "Concluído",
  pendente: "Pendente",
  cancelado: "Cancelado",
};

const esquema = z.object({
  cliente: z.string().min(2, "Mínimo 2 caracteres"),
  produto: z.string().min(2, "Mínimo 2 caracteres"),
  valor: z.string().min(1, "Obrigatório").regex(/^\d+([.,]\d{1,2})?$/, "Formato inválido"),
});

type FormVenda = z.infer<typeof esquema>;

export default function Vendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const { exibir } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormVenda>({ resolver: zodResolver(esquema) });

  const metricas = useMemo(() => {
    const concluidas = vendas.filter((v) => v.status === "concluido");
    const parsear = (val: string) =>
      parseFloat(val.replace("R$", "").trim().replace(/\./g, "").replace(",", ".")) || 0;
    const ticketMedio =
      concluidas.length > 0
        ? Math.round(concluidas.reduce((a, v) => a + parsear(v.valor), 0) / concluidas.length)
        : 0;
    const clientesUnicos = new Set(vendas.map((v) => v.cliente)).size;
    return [
      { titulo: "Vendas no mês", valor: vendas.length.toLocaleString("pt-BR"), variacao: 8.1, icone: ShoppingCart },
      { titulo: "Clientes ativos", valor: String(clientesUnicos), variacao: 15.3, icone: Users },
      { titulo: "Ticket médio", valor: `R$ ${ticketMedio.toLocaleString("pt-BR")}`, variacao: -2.4, icone: TrendingUp },
      { titulo: "NPS", valor: "74", variacao: 5.0, icone: Star },
    ];
  }, [vendas]);

  const recarregar = async () => {
    const res = await fetch("/api/vendas");
    const dados = (await res.json()) as Venda[];
    setVendas(dados);
  };

  useEffect(() => {
    fetch("/api/vendas")
      .then((r) => r.json() as Promise<Venda[]>)
      .then((dados) => {
        setVendas(dados);
        setCarregando(false);
      });
  }, []);

  const aoEnviar = async (dados: FormVenda) => {
    const res = await fetch("/api/vendas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (!res.ok) {
      exibir("Erro ao registrar venda.", "erro");
      return;
    }

    await recarregar();
    exibir("Venda registrada com sucesso!", "sucesso");
    reset();
    setModalAberto(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Vendas</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Março 2026</p>
          </div>
          <Botao tamanho="sm" onClick={() => setModalAberto(true)}>
            <Plus size={14} />
            Nova venda
          </Botao>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricas.map((m) => (
            <CartaoMetrica key={m.titulo} {...m} />
          ))}
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Pedidos recentes</h3>
          {carregando ? (
            <div className="flex justify-center py-8 text-zinc-400">
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-col">
              {vendas.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{v.cliente}</p>
                    <p className="text-xs text-zinc-500">{v.id}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white hidden sm:block">{v.valor}</span>
                    <Emblema variante={varianteStatus[v.status]}>{rotuloStatus[v.status]}</Emblema>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        aberto={modalAberto}
        fechar={() => {
          setModalAberto(false);
          reset();
        }}
        titulo="Nova venda"
      >
        <form onSubmit={handleSubmit(aoEnviar)} className="flex flex-col gap-4">
          <CampoRotulado
            id="cliente"
            rotulo="Cliente"
            placeholder="Bernardo Barbosa"
            erro={errors.cliente?.message}
            {...register("cliente")}
          />
          <CampoRotulado
            id="produto"
            rotulo="Produto"
            placeholder="Notebook Pro X1"
            erro={errors.produto?.message}
            {...register("produto")}
          />
          <CampoRotulado
            id="valor"
            rotulo="Valor (R$)"
            placeholder="3200"
            erro={errors.valor?.message}
            {...register("valor")}
          />
          <div className="flex gap-3 pt-1">
            <Botao
              type="button"
              variante="secundario"
              larguraTotal
              onClick={() => {
                setModalAberto(false);
                reset();
              }}
            >
              Cancelar
            </Botao>
            <Botao type="submit" larguraTotal carregando={isSubmitting}>
              Registrar
            </Botao>
          </div>
        </form>
      </Modal>
    </>
  );
}
