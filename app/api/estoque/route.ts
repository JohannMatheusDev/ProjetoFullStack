import { NextRequest, NextResponse } from "next/server";
import type { Produto, StatusProduto } from "@/app/types";

let catalogo: Produto[] = [
  { id: "1", nome: "Notebook Pro X1", categoria: "Eletrônicos", quantidade: 48, preco: "4200", status: "normal" },
  { id: "2", nome: "Monitor UltraWide", categoria: "Eletrônicos", quantidade: 12, preco: "1800", status: "baixo" },
  { id: "3", nome: "Teclado Mecânico", categoria: "Periféricos", quantidade: 203, preco: "380", status: "normal" },
  { id: "4", nome: "Cabo HDMI 2m", categoria: "Acessórios", quantidade: 3, preco: "45", status: "critico" },
  { id: "5", nome: "Headset Gamer", categoria: "Periféricos", quantidade: 67, preco: "520", status: "normal" },
];

function calcularStatus(quantidade: number): StatusProduto {
  if (quantidade <= 5) return "critico";
  if (quantidade <= 20) return "baixo";
  return "normal";
}

export async function GET() {
  return NextResponse.json(catalogo);
}

export async function POST(req: NextRequest) {
  const corpo = (await req.json()) as Omit<Produto, "id" | "status">;
  const novo: Produto = {
    id: Date.now().toString(),
    ...corpo,
    status: calcularStatus(corpo.quantidade),
  };
  catalogo.push(novo);
  return NextResponse.json(novo, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const corpo = (await req.json()) as Omit<Produto, "status">;
  catalogo = catalogo.map((p) =>
    p.id === corpo.id
      ? { ...corpo, status: calcularStatus(corpo.quantidade) }
      : p
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = (await req.json()) as { id: string };
  catalogo = catalogo.filter((p) => p.id !== id);
  return NextResponse.json({ ok: true });
}
