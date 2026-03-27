import { NextResponse } from "next/server";
import type { Lancamento } from "@/app/types";

const dados: Lancamento[] = [
  { descricao: "Receita de vendas — Março", tipo: "entrada", valor: "R$ 96.200" },
  { descricao: "Pagamento fornecedores", tipo: "saida", valor: "R$ 18.000" },
  { descricao: "Salários", tipo: "saida", valor: "R$ 12.000" },
  { descricao: "Receita serviços", tipo: "entrada", valor: "R$ 32.230" },
  { descricao: "Manutenção", tipo: "saida", valor: "R$ 4.100" },
];

export async function GET() {
  return NextResponse.json(dados);
}
