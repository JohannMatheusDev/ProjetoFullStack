"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package, PackageOpen, AlertTriangle, BarChart3, Plus, Pencil, Trash2 } from "lucide-react";
import { CartaoMetrica } from "@/app/components/compostos/CartaoMetrica";
import { CampoRotulado } from "@/app/components/compostos/CampoRotulado";
import { Emblema } from "@/app/components/ui/Emblema";
import { Botao } from "@/app/components/ui/Botao";
import { Modal } from "@/app/components/ui/Modal";
import { Spinner } from "@/app/components/ui/Spinner";
import { useToast } from "@/app/contexts/ToastContext";
import type { Produto, StatusProduto, VarianteEmblema } from "@/app/types";


const varianteStatus: Record<StatusProduto, VarianteEmblema> = {
  normal: "sucesso",
  baixo: "aviso",
  critico: "erro",
};

const rotuloStatus: Record<StatusProduto, string> = {
  normal: "Normal",
  baixo: "Baixo",
  critico: "Crítico",
};

const esquema = z.object({
  nome: z.string().min(2, "Mínimo 2 caracteres"),
  categoria: z.string().min(2, "Mínimo 2 caracteres"),
  quantidade: z.number({ error: "Deve ser número" }).int("Deve ser inteiro").min(0, "Mínimo 0"),
  preco: z.string().min(1, "Obrigatório").regex(/^\d+([.,]\d{1,2})?$/, "Formato inválido"),
});

type FormProduto = z.infer<typeof esquema>;

type ModoModal = "criar" | "editar" | null;

export default function Estoque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modoModal, setModoModal] = useState<ModoModal>(null);
  const [produtoAtivo, setProdutoAtivo] = useState<Produto | null>(null);
  const { exibir } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormProduto>({ resolver: zodResolver(esquema) });

  const metricas = useMemo(() => [
    { titulo: "Total em estoque", valor: produtos.reduce((a, p) => a + p.quantidade, 0).toLocaleString("pt-BR"), variacao: -3.2, icone: Package },
    { titulo: "Entradas no mês", valor: "842", variacao: 5.4, icone: PackageOpen },
    { titulo: "Itens críticos", valor: String(produtos.filter((p) => p.status === "critico").length), variacao: -8.1, icone: AlertTriangle },
    { titulo: "Giro médio", valor: "4.2x", variacao: 2.1, icone: BarChart3 },
  ], [produtos]);

  const recarregar = async () => {
    const res = await fetch("/api/estoque");
    const dados = (await res.json()) as Produto[];
    setProdutos(dados);
  };

  useEffect(() => {
    fetch("/api/estoque")
      .then((r) => r.json() as Promise<Produto[]>)
      .then((dados) => {
        setProdutos(dados);
        setCarregando(false);
      });
  }, []);

  const abrirCriar = () => {
    reset({ nome: "", categoria: "", quantidade: 0, preco: "" });
    setProdutoAtivo(null);
    setModoModal("criar");
  };

  const abrirEditar = (produto: Produto) => {
    reset({
      nome: produto.nome,
      categoria: produto.categoria,
      quantidade: produto.quantidade,
      preco: produto.preco,
    });
    setProdutoAtivo(produto);
    setModoModal("editar");
  };

  const fecharModal = () => {
    setModoModal(null);
    setProdutoAtivo(null);
    reset();
  };

  const aoEnviar = async (dados: FormProduto) => {
    if (modoModal === "criar") {
      const res = await fetch("/api/estoque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!res.ok) {
        exibir("Erro ao adicionar produto.", "erro");
        return;
      }
      exibir("Produto adicionado!", "sucesso");
    } else if (modoModal === "editar" && produtoAtivo) {
      const res = await fetch("/api/estoque", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dados, id: produtoAtivo.id }),
      });
      if (!res.ok) {
        exibir("Erro ao atualizar produto.", "erro");
        return;
      }
      exibir("Produto atualizado!", "sucesso");
    }
    await recarregar();
    fecharModal();
  };

  const remover = async (produto: Produto) => {
    const res = await fetch("/api/estoque", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: produto.id }),
    });
    if (!res.ok) {
      exibir("Erro ao remover produto.", "erro");
      return;
    }
    await recarregar();
    exibir(`"${produto.nome}" removido.`, "aviso");
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Estoque</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Março 2026</p>
          </div>
          <Botao tamanho="sm" onClick={abrirCriar}>
            <Plus size={14} />
            Novo produto
          </Botao>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricas.map((m) => (
            <CartaoMetrica key={m.titulo} {...m} />
          ))}
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Produtos</h3>
          {carregando ? (
            <div className="flex justify-center py-8 text-zinc-400">
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-col">
              {produtos.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{item.nome}</p>
                    <p className="text-xs text-zinc-500">{item.categoria}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 hidden sm:block">
                      R$ {item.preco}
                    </span>
                    <span className="text-sm text-zinc-500 hidden md:block">{item.quantidade} un.</span>
                    <Emblema variante={varianteStatus[item.status]}>{rotuloStatus[item.status]}</Emblema>
                    <Botao variante="fantasma" tamanho="sm" onClick={() => abrirEditar(item)}>
                      <Pencil size={13} />
                    </Botao>
                    <Botao variante="perigo" tamanho="sm" onClick={() => remover(item)}>
                      <Trash2 size={13} />
                    </Botao>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        aberto={modoModal !== null}
        fechar={fecharModal}
        titulo={modoModal === "criar" ? "Novo produto" : "Editar produto"}
      >
        <form onSubmit={handleSubmit(aoEnviar)} className="flex flex-col gap-4">
          <CampoRotulado
            id="nome"
            rotulo="Nome"
            placeholder="Notebook Pro X1"
            erro={errors.nome?.message}
            {...register("nome")}
          />
          <CampoRotulado
            id="categoria"
            rotulo="Categoria"
            placeholder="Eletrônicos"
            erro={errors.categoria?.message}
            {...register("categoria")}
          />
          <div className="grid grid-cols-2 gap-3">
            <CampoRotulado
              id="quantidade"
              rotulo="Quantidade"
              type="number"
              placeholder="0"
              erro={errors.quantidade?.message}
              {...register("quantidade", { valueAsNumber: true })}
            />
            <CampoRotulado
              id="preco"
              rotulo="Preço (R$)"
              placeholder="4200"
              erro={errors.preco?.message}
              {...register("preco")}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Botao type="button" variante="secundario" larguraTotal onClick={fecharModal}>
              Cancelar
            </Botao>
            <Botao type="submit" larguraTotal carregando={isSubmitting}>
              {modoModal === "criar" ? "Adicionar" : "Salvar"}
            </Botao>
          </div>
        </form>
      </Modal>
    </>
  );
}
