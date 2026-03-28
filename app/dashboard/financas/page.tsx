"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Plus } from "lucide-react";
import { CartaoMetrica } from "@/app/components/compostos/CartaoMetrica";
import { CampoRotulado } from "@/app/components/compostos/CampoRotulado";
import { Emblema } from "@/app/components/ui/Emblema";
import { Botao } from "@/app/components/ui/Botao";
import { Modal } from "@/app/components/ui/Modal";
import { Spinner } from "@/app/components/ui/Spinner";
import { useToast } from "@/app/contexts/ToastContext";
import type { Lancamento, TipoLancamento } from "@/app/types";

const corTipo: Record<TipoLancamento, string> = {
  entrada: "text-green-600 dark:text-green-400",
  saida: "text-red-500",
};

const esquema = z.object({
  descricao: z.string().min(3, "Mínimo 3 caracteres"),
  tipo: z.enum(["entrada", "saida"]),
  valor: z.string().min(1, "Obrigatório").regex(/^\d+([.,]\d{1,2})?$/, "Formato inválido"),
});

type FormLancamento = z.infer<typeof esquema>;

function formatarMoeda(n: number): string {
  return "R$ " + n.toLocaleString("pt-BR");
}

export default function Financas() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const { exibir } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormLancamento>({
    resolver: zodResolver(esquema),
    defaultValues: { tipo: "entrada" },
  });

  const recarregar = async () => {
    const res = await fetch("/api/financas");
    const dados = (await res.json()) as Lancamento[];
    setLancamentos(dados);
  };

  useEffect(() => {
    fetch("/api/financas")
      .then((r) => r.json() as Promise<Lancamento[]>)
      .then((dados) => {
        setLancamentos(dados);
        setCarregando(false);
      });
  }, []);

  const { totalEntradas, totalSaidas, saldo } = useMemo(() => {
    const entradas = lancamentos
      .filter((l) => l.tipo === "entrada")
      .reduce((acc, l) => acc + parseFloat(l.valor.replace(",", ".")), 0);
    const saidas = lancamentos
      .filter((l) => l.tipo === "saida")
      .reduce((acc, l) => acc + parseFloat(l.valor.replace(",", ".")), 0);
    return { totalEntradas: entradas, totalSaidas: saidas, saldo: entradas - saidas };
  }, [lancamentos]);

  const metricas = [
    { titulo: "Receita bruta", valor: formatarMoeda(totalEntradas + totalSaidas), variacao: 12.4, icone: DollarSign },
    { titulo: "Entradas", valor: formatarMoeda(totalEntradas), variacao: 9.2, icone: ArrowUpRight },
    { titulo: "Saídas", valor: formatarMoeda(totalSaidas), variacao: -4.5, icone: ArrowDownRight },
    { titulo: "Saldo líquido", valor: formatarMoeda(saldo), variacao: 18.1, icone: CreditCard },
  ];

  const aoEnviar = async (dados: FormLancamento) => {
    const res = await fetch("/api/financas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!res.ok) {
      exibir("Erro ao registrar lançamento.", "erro");
      return;
    }
    await recarregar();
    exibir("Lançamento registrado!", "sucesso");
    reset({ descricao: "", tipo: "entrada", valor: "" });
    setModalAberto(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Finanças</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Março 2026</p>
          </div>
          <Botao tamanho="sm" onClick={() => setModalAberto(true)}>
            <Plus size={14} />
            Novo lançamento
          </Botao>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricas.map((m) => (
            <CartaoMetrica key={m.titulo} {...m} />
          ))}
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Lançamentos</h3>
          {carregando ? (
            <div className="flex justify-center py-8 text-zinc-400">
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-col">
              {lancamentos.map((l) => (
                <div
                  key={l.id}
                  className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                >
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{l.descricao}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-sm font-medium ${corTipo[l.tipo]}`}>
                      {l.tipo === "entrada" ? "+" : "-"}R$ {l.valor}
                    </span>
                    <Emblema variante={l.tipo === "entrada" ? "sucesso" : "erro"}>
                      {l.tipo === "entrada" ? "Entrada" : "Saída"}
                    </Emblema>
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
          reset({ descricao: "", tipo: "entrada", valor: "" });
        }}
        titulo="Novo lançamento"
      >
        <form onSubmit={handleSubmit(aoEnviar)} className="flex flex-col gap-4">
          <CampoRotulado
            id="descricao"
            rotulo="Descrição"
            placeholder="Receita de vendas"
            erro={errors.descricao?.message}
            {...register("descricao")}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tipo" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Tipo
            </label>
            <select
              id="tipo"
              {...register("tipo")}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
            {errors.tipo && <span className="text-xs text-red-500">{errors.tipo.message}</span>}
          </div>
          <CampoRotulado
            id="valor"
            rotulo="Valor (R$)"
            placeholder="5000"
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
                reset({ descricao: "", tipo: "entrada", valor: "" });
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
