import { ShoppingCart, Users, TrendingUp, Star } from "lucide-react";
import { CartaoMetrica } from "@/app/components/compostos/CartaoMetrica";
import { Emblema } from "@/app/components/ui/Emblema";
import type { VarianteEmblema } from "@/app/types";

const metricas = [
  { titulo: "Vendas no mês", valor: "1.284", variacao: 8.1, icone: ShoppingCart },
  { titulo: "Clientes ativos", valor: "342", variacao: 15.3, icone: Users },
  { titulo: "Ticket médio", valor: "R$ 412", variacao: -2.4, icone: TrendingUp },
  { titulo: "NPS", valor: "74", variacao: 5.0, icone: Star },
];

type StatusVenda = "concluido" | "pendente" | "cancelado";

const vendas: { id: string; cliente: string; valor: string; status: StatusVenda }[] = [
  { id: "#1284", cliente: "Bernardo Barbosa", valor: "R$ 3.200", status: "concluido" },
  { id: "#1283", cliente: "Moaca Manga", valor: "R$ 800", status: "concluido" },
  { id: "#1282", cliente: "Du Sochodolak", valor: "R$ 560", status: "concluido" },
  { id: "#1281", cliente: "Jojo Pedroso", valor: "R$ 1.900", status: "pendente" },
  { id: "#1280", cliente: "Barbosa & Filhos", valor: "R$ 8.400", status: "cancelado" },
];

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

export default function Vendas() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Vendas</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Março 2026</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricas.map((m) => (
          <CartaoMetrica key={m.titulo} {...m} />
        ))}
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Pedidos recentes</h3>
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
      </div>
    </div>
  );
}
