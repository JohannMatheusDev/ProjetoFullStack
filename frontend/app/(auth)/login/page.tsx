"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CampoRotulado } from "@/app/components/compostos/CampoRotulado";
import { Botao } from "@/app/components/ui/Botao";
import { Divisor } from "@/app/components/ui/Divisor";
import { useToast } from "@/app/contexts/ToastContext";
import { autenticar, salvarSessao } from "@/app/lib/authMock";

const esquema = z.object({
  email: z.string().min(1, "Obrigatório").email("E-mail inválido"),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormLogin = z.infer<typeof esquema>;

export default function Login() {
  const router = useRouter();
  const { exibir } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormLogin>({ resolver: zodResolver(esquema) });

  const aoEnviar = async (dados: FormLogin) => {
    await new Promise((r) => setTimeout(r, 600));
    const resultado = autenticar(dados.email, dados.senha);
    if (!resultado.ok) {
      exibir("E-mail ou senha incorretos.", "erro");
      return;
    }
    salvarSessao(resultado.nome!);
    exibir(`Bem-vindo, ${resultado.nome}!`, "sucesso");
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center gap-3">
        <Image src="/Logo.png" alt="ERP Du Jojo" width={36} height={36} />
        <div className="text-center">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">Entrar na plataforma</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Acesse sua conta</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(aoEnviar)} className="flex flex-col gap-4">
        <CampoRotulado
          id="email"
          rotulo="E-mail"
          type="email"
          placeholder="du@erpdu.com"
          erro={errors.email?.message}
          {...register("email")}
        />
        <CampoRotulado
          id="senha"
          rotulo="Senha"
          type="password"
          placeholder="••••••••"
          erro={errors.senha?.message}
          {...register("senha")}
        />
        <Botao type="submit" larguraTotal carregando={isSubmitting}>
          Entrar
        </Botao>
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
