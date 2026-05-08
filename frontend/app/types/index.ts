import type { LucideIcon } from "lucide-react";

export type ItemNavegacao = {
  rotulo: string;
  href: string;
  icone: LucideIcon;
};

export type VarianteBotao = "primario" | "secundario" | "fantasma" | "perigo";
export type TamanhoBotao = "sm" | "md" | "lg";
export type VarianteEmblema = "padrao" | "sucesso" | "aviso" | "erro" | "info";
export type VarianteToast = "sucesso" | "erro" | "aviso" | "info";

export type StatusVenda = "concluido" | "pendente" | "cancelado";
export type StatusProduto = "normal" | "baixo" | "critico";
export type TipoLancamento = "entrada" | "saida";

export type Venda = {
  id: string;
  cliente: string;
  valor: string;
  status: StatusVenda;
};

export type Produto = {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  preco: string;
  status: StatusProduto;
};

export type Lancamento = {
  id: string;
  descricao: string;
  tipo: TipoLancamento;
  valor: string;
};
