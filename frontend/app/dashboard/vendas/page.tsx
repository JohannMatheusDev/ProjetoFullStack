"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShoppingCart, Users, TrendingUp, Star, Plus, CheckCircle, XCircle } from "lucide-react";
import { CartaoMetrica } from "@/app/components/compostos/CartaoMetrica";
import { CampoRotulado } from "@/app/components/compostos/CampoRotulado";
import { Emblema } from "@/app/components/ui/Emblema";
import { Botao } from "@/app/components/ui/Botao";
import { Modal } from "@/app/components/ui/Modal";
import { Spinner } from "@/app/components/ui/Spinner";
import { useToast } from "@/app/contexts/ToastContext";
import { vendas as vendasApi, estoque as estoqueApi } from "@/app/lib/api";
import type { Venda, Produto, StatusVenda, VarianteEmblema } from "@/app/types";

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
  produtoId: z.string().min(1, "Selecione um produto"),
  quantidade: z
    .number({ error: "Deve ser número" })
    .int("Deve ser inteiro")
    .min(1, "Mínimo 1"),
});

type FormVenda = z.infer<typeof esquema>;

function parsearPreco(val: string): number {
  return parseFloat(val.replace(/\./g, "").replace(",", ".")) || 0;
}

export default function Vendas() {
  const [listaVendas, setListaVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [processando, setProcessando] = useState<string | null>(null);
  const { exibir } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormVenda>({
    resolver: zodResolver(esquema),
    defaultValues: { quantidade: 1 },
  });

  const produtoSelecionadoId = watch("produtoId");
  const quantidadeSelecionada = watch("quantidade");

  const produtoSelecionado = useMemo(
    () => produtos.find((p) => p.id === produtoSelecionadoId) ?? null,
    [produtos, produtoSelecionadoId],
  );

  const valorTotal = useMemo(() => {
    if (!produtoSelecionado || !quantidadeSelecionada) return 0;
    return parsearPreco(produtoSelecionado.preco) * (quantidadeSelecionada || 0);
  }, [produtoSelecionado, quantidadeSelecionada]);

  const metricas = useMemo(() => {
    const concluidas = listaVendas.filter((v) => v.status === "concluido");
    const ticketMedio =
      concluidas.length > 0
        ? Math.round(
            concluidas.reduce((a, v) => a + parsearPreco(v.valor), 0) / concluidas.length,
          )
        : 0;
    const clientesUnicos = new Set(listaVendas.map((v) => v.cliente)).size;
    return [
      { titulo: "Vendas no mês", valor: listaVendas.length.toLocaleString("pt-BR"), variacao: 8.1, icone: ShoppingCart },
      { titulo: "Clientes ativos", valor: String(clientesUnicos), variacao: 15.3, icone: Users },
      { titulo: "Ticket médio", valor: `R$ ${ticketMedio.toLocaleString("pt-BR")}`, variacao: -2.4, icone: TrendingUp },
      { titulo: "NPS", valor: "74", variacao: 5.0, icone: Star },
    ];
  }, [listaVendas]);

  const recarregar = async () => {
    const dados = await vendasApi.listar();
    setListaVendas(dados);
  };

  useEffect(() => {
    Promise.all([vendasApi.listar(), estoqueApi.listar()])
      .then(([v, p]) => {
        setListaVendas(v);
        setProdutos(p);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  const aoEnviar = async (dados: FormVenda) => {
    if (!produtoSelecionado) return;
    const qtd = dados.quantidade;
    const estoque = produtoSelecionado.quantidade;

    if (qtd > estoque) {
      exibir(`Estoque insuficiente. Disponível: ${estoque} un.`, "erro");
      return;
    }

    try {
      await vendasApi.criar({
        cliente: dados.cliente,
        valor: valorTotal,
        produtoId: dados.produtoId,
        quantidade: dados.quantidade,
      });
      await recarregar();
      exibir("Venda registrada!", "sucesso");
      reset({ cliente: "", produtoId: "", quantidade: 1 });
      setModalAberto(false);
    } catch (e) {
      exibir(e instanceof Error ? e.message : "Erro ao registrar venda.", "erro");
    }
  };

  const confirmarPagamento = async (venda: Venda) => {
    setProcessando(venda.id);
    try {
      await vendasApi.atualizar(venda.id, { status: "concluido" });
      await recarregar();
      exibir("Pagamento confirmado!", "sucesso");
    } catch (e) {
      exibir(e instanceof Error ? e.message : "Erro ao confirmar.", "erro");
    } finally {
      setProcessando(null);
    }
  };

  const cancelarVenda = async (venda: Venda) => {
    setProcessando(venda.id);
    try {
      await vendasApi.atualizar(venda.id, { status: "cancelado" });
      await recarregar();
      exibir("Venda cancelada.", "aviso");
    } catch (e) {
      exibir(e instanceof Error ? e.message : "Erro ao cancelar.", "erro");
    } finally {
      setProcessando(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Vendas</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Maio 2026</p>
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
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Pedidos</h3>
          {carregando ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : listaVendas.length === 0 ? (
            <p className="text-sm text-zinc-400 py-4 text-center">Nenhuma venda registrada.</p>
          ) : (
            <div className="flex flex-col">
              {listaVendas.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{v.cliente}</p>
                    <p className="text-xs text-zinc-500">{v.id.slice(0, 8)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">
                      R$ {v.valor}
                    </span>
                    <Emblema variante={varianteStatus[v.status]}>{rotuloStatus[v.status]}</Emblema>
                    {v.status === "pendente" && (
                      <>
                        <Botao
                          tamanho="sm"
                          variante="fantasma"
                          carregando={processando === v.id}
                          onClick={() => confirmarPagamento(v)}
                        >
                          <CheckCircle size={13} />
                          Confirmar
                        </Botao>
                        <Botao
                          tamanho="sm"
                          variante="perigo"
                          carregando={processando === v.id}
                          onClick={() => cancelarVenda(v)}
                        >
                          <XCircle size={13} />
                          Cancelar
                        </Botao>
                      </>
                    )}
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
          reset({ cliente: "", produtoId: "", quantidade: 1 });
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="produtoId" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Produto
            </label>
            <select
              id="produtoId"
              {...register("produtoId")}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
            >
              <option value="">Selecione um produto</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id} disabled={p.quantidade === 0}>
                  {p.nome} — R$ {p.preco} ({p.quantidade} em estoque)
                </option>
              ))}
            </select>
            {errors.produtoId && (
              <span className="text-xs text-red-500">{errors.produtoId.message}</span>
            )}
          </div>

          <CampoRotulado
            id="quantidade"
            rotulo="Quantidade"
            type="number"
            placeholder="1"
            erro={errors.quantidade?.message}
            {...register("quantidade", { valueAsNumber: true })}
          />

          {produtoSelecionado && quantidadeSelecionada > 0 && (
            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Total</span>
              <span className="text-base font-semibold text-zinc-900 dark:text-white">
                R$ {valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Botao
              type="button"
              variante="secundario"
              larguraTotal
              onClick={() => {
                setModalAberto(false);
                reset({ cliente: "", produtoId: "", quantidade: 1 });
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
