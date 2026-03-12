import Image from "next/image";
import Link from "next/link";
import { CampoRotulado } from "@/app/components/compostos/CampoRotulado";
import { Botao } from "@/app/components/ui/Botao";
import { Divisor } from "@/app/components/ui/Divisor";

export default function Login() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center gap-3">
        <Image src="/Logo.png" alt="ERP Du Jojo" width={36} height={36} />
        <div className="text-center">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">Entrar na plataforma</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Acesse sua conta</p>
        </div>
      </div>
      <form className="flex flex-col gap-4">
        <CampoRotulado id="email" rotulo="E-mail" type="email" placeholder="du@erpdu.com" />
        <CampoRotulado id="senha" rotulo="Senha" type="password" placeholder="••••••••" />
        <Botao type="submit" larguraTotal>Entrar</Botao>
      </form>
      <div className="my-6">
        <Divisor />
      </div>
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Sem conta?{" "}
        <Link href="/cadastro" className="font-medium text-zinc-900 dark:text-white hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
