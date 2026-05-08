import { NextResponse } from "next/server";
import type { Venda } from "@/app/types";

const dados: Venda[] = [
  { id: "#1284", cliente: "Bernardo Barbosa", valor: "R$ 3.200", status: "concluido" },
  { id: "#1283", cliente: "Moaca Manga", valor: "R$ 800", status: "concluido" },
  { id: "#1282", cliente: "Du Sochodolak", valor: "R$ 560", status: "concluido" },
  { id: "#1281", cliente: "Jojo Pedroso", valor: "R$ 1.900", status: "pendente" },
  { id: "#1280", cliente: "Barbosa & Filhos", valor: "R$ 8.400", status: "cancelado" },
];

export async function GET() {
  return NextResponse.json(dados);
}

export async function POST(req: Request) {
  const corpo = (await req.json()) as { cliente: string; produto: string; valor: string };
  const nova: Venda = {
    id: `#${Math.floor(1285 + dados.length)}`,
    cliente: corpo.cliente,
    valor: `R$ ${corpo.valor}`,
    status: "pendente",
  };
  dados.unshift(nova);
  return NextResponse.json(nova, { status: 201 });
}
