"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, TrendingUp, Package, ShoppingCart } from "lucide-react";
import { ItemNav } from "@/app/components/compostos/ItemNav";
import { Divisor } from "@/app/components/ui/Divisor";
import type { ItemNavegacao } from "@/app/types";

const itens: ItemNavegacao[] = [
  { rotulo: "Dashboard", href: "/dashboard", icone: LayoutDashboard },
  { rotulo: "Finanças", href: "/dashboard/financas", icone: TrendingUp },
  { rotulo: "Estoque", href: "/dashboard/estoque", icone: Package },
  { rotulo: "Vendas", href: "/dashboard/vendas", icone: ShoppingCart },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-56 flex-col bg-zinc-950 px-3 py-4 shrink-0">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-6">
        <Image src="/Logo.png" alt="ERP Du Jojo" width={26} height={26} />
        <span className="text-sm font-semibold text-white">ERP Du Jojo</span>
      </Link>
      <nav className="flex flex-col gap-0.5">
        {itens.map((item) => (
          <ItemNav key={item.href} item={item} />
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-3">
        <Divisor />
        <div className="px-2 flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-white font-semibold shrink-0">
            D
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">Du</p>
            <p className="text-[10px] text-zinc-500">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
