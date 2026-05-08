type UsuarioMock = {
  nome: string;
  email: string;
  senha: string;
};

const CHAVE = "erp_usuarios";
const CHAVE_SESSAO = "erp_sessao";

function listarUsuarios(): UsuarioMock[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CHAVE);
  if (!raw) return [];
  return JSON.parse(raw) as UsuarioMock[];
}

export function registrarUsuario(usuario: UsuarioMock): { ok: boolean; erro?: string } {
  const usuarios = listarUsuarios();
  if (usuarios.some((u) => u.email === usuario.email)) {
    return { ok: false, erro: "E-mail já cadastrado." };
  }
  usuarios.push(usuario);
  localStorage.setItem(CHAVE, JSON.stringify(usuarios));
  return { ok: true };
}

export function autenticar(email: string, senha: string): { ok: boolean; nome?: string } {
  const usuario = listarUsuarios().find((u) => u.email === email && u.senha === senha);
  if (!usuario) return { ok: false };
  return { ok: true, nome: usuario.nome };
}

export function salvarSessao(nome: string): void {
  localStorage.setItem(CHAVE_SESSAO, nome);
}

export function buscarSessao(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CHAVE_SESSAO);
}

export function encerrarSessao(): void {
  localStorage.removeItem(CHAVE_SESSAO);
}
