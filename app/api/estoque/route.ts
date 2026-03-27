import { NextResponse } from "next/server";
import type { Produto } from "@/app/types";

const dados: Produto[] = [
  { nome: "Notebook Pro X1", categoria: "Eletrônicos", quantidade: 48, status: "normal" },
  { nome: "Monitor UltraWide", categoria: "Eletrônicos", quantidade: 12, status: "baixo" },
  { nome: "Teclado Mecânico", categoria: "Periféricos", quantidade: 203, status: "normal" },
  { nome: "Cabo HDMI 2m", categoria: "Acessórios", quantidade: 3, status: "critico" },
  { nome: "Headset Gamer", categoria: "Periféricos", quantidade: 67, status: "normal" },
];

export async function GET() {
  return NextResponse.json(dados);
}
