import { NextRequest, NextResponse } from "next/server";
import type { Lancamento } from "@/app/types";

let registros: Lancamento[] = [
  { id: "1", descricao: "Receita de vendas — Março", tipo: "entrada", valor: "96200" },
  { id: "2", descricao: "Pagamento fornecedores", tipo: "saida", valor: "18000" },
  { id: "3", descricao: "Salários", tipo: "saida", valor: "12000" },
  { id: "4", descricao: "Receita serviços", tipo: "entrada", valor: "32230" },
  { id: "5", descricao: "Manutenção", tipo: "saida", valor: "4100" },
];

export async function GET() {
  return NextResponse.json(registros);
}

export async function POST(req: NextRequest) {
  const corpo = (await req.json()) as Omit<Lancamento, "id">;
  const novo: Lancamento = { id: Date.now().toString(), ...corpo };
  registros.push(novo);
  return NextResponse.json(novo, { status: 201 });
}
