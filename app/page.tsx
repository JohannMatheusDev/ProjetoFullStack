import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center gap-8 px-6">
      <Image
        src="/LogoMarca.png"
        alt="ERP Du Jojo"
        width={220}
        height={80}
        priority
      />

      <div className="text-center max-w-md">
        <p className="text-[var(--foreground)] opacity-60 text-base">
          Gestão integrada de finanças, estoque e vendas em uma única plataforma.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-2.5 bg-[var(--foreground)] text-[var(--background)] rounded-lg font-medium text-sm hover:opacity-80 transition-opacity"
        >
          Entrar
        </Link>
        <Link
          href="/cadastro"
          className="px-6 py-2.5 border border-[var(--foreground)] text-[var(--foreground)] rounded-lg font-medium text-sm hover:opacity-60 transition-opacity"
        >
          Criar conta
        </Link>
      </div>
    </main>
  );
}
