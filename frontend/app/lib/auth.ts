import { salvarToken, removerToken } from "./api";

const CHAVE_USUARIO = "erp_usuario";

type UsuarioSessao = {
  id: string;
  nome: string;
  email: string;
};

type RespostaAuth = {
  token: string;
  usuario: UsuarioSessao;
};

export async function login(
  email: string,
  senha: string,
): Promise<{ ok: boolean; erro?: string; nome?: string }> {
  try {
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (!res.ok) {
      const corpo = await res.json().catch(() => ({}));
      return { ok: false, erro: (corpo as { message?: string }).message ?? "Credenciais inválidas" };
    }

    const dados = (await res.json()) as RespostaAuth;
    salvarToken(dados.token);
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados.usuario));
    return { ok: true, nome: dados.usuario.nome };
  } catch {
    return { ok: false, erro: "Erro ao conectar com o servidor" };
  }
}

export async function cadastrar(
  nome: string,
  email: string,
  senha: string,
): Promise<{ ok: boolean; erro?: string; nomeUsuario?: string }> {
  try {
    const res = await fetch("http://localhost:3001/auth/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (!res.ok) {
      const corpo = await res.json().catch(() => ({}));
      return { ok: false, erro: (corpo as { message?: string }).message ?? "Erro ao criar conta" };
    }

    const dados = (await res.json()) as RespostaAuth;
    salvarToken(dados.token);
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados.usuario));
    return { ok: true, nomeUsuario: dados.usuario.nome };
  } catch {
    return { ok: false, erro: "Erro ao conectar com o servidor" };
  }
}

export function buscarSessao(): UsuarioSessao | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CHAVE_USUARIO);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UsuarioSessao;
  } catch {
    return null;
  }
}

export function encerrarSessao(): void {
  removerToken();
}
