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
import { registrarUsuario, salvarSessao } from "@/app/lib/authMock";

const esquema = z
  .object({
    nome: z.string().min(2, "Mínimo 2 caracteres"),
    email: z.string().min(1, "Obrigatório").email("E-mail inválido"),
    senha: z.string().min(6, "Mínimo 6 caracteres"),
    confirmarSenha: z.string().min(1, "Obrigatório"),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "Senhas não coincidem",
    path: ["confirmarSenha"],
  });

type FormCadastro = z.infer<typeof esquema>;

export default function Cadastro() {
  const router = useRouter();
  const { exibir } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormCadastro>({ resolver: zodResolver(esquema) });

  const aoEnviar = async (dados: FormCadastro) => {
    await new Promise((r) => setTimeout(r, 600));
    const resultado = registrarUsuario({ nome: dados.nome, email: dados.email, senha: dados.senha });
    if (!resultado.ok) {
      exibir(resultado.erro ?? "Erro ao criar conta.", "erro");
      return;
    }
    salvarSessao(dados.nome);
    exibir("Conta criada com sucesso!", "sucesso");
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center gap-3">
        <Image src="/Logo.png" alt="ERP Du Jojo" width={36} height={36} />
        <div className="text-center">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">Criar conta</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Comece a usar o ERP Du Jojo</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(aoEnviar)} className="flex flex-col gap-4">
        <CampoRotulado
          id="nome"
          rotulo="Nome"
          type="text"
          placeholder="Bernardo Barbosa"
          erro={errors.nome?.message}
          {...register("nome")}
        />
        <CampoRotulado
          id="email"
          rotulo="E-mail"
          type="email"
          placeholder="bernardo@erpdu.com"
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
        <CampoRotulado
          id="confirmarSenha"
          rotulo="Confirmar senha"
          type="password"
          placeholder="••••••••"
          erro={errors.confirmarSenha?.message}
          {...register("confirmarSenha")}
        />
        <Botao type="submit" larguraTotal carregando={isSubmitting}>
          Criar conta
        </Botao>
      </form>
      <div className="my-6">
        <Divisor />
      </div>
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-zinc-900 dark:text-white hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
