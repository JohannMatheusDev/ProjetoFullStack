import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CriarUsuarioDto } from '../usuarios/dto/criar-usuario.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validarUsuario(email: string, senha: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    const hashGuarda = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
    const valida = await bcrypt.compare(senha, usuario?.senha ?? hashGuarda);
    if (!usuario || !valida) return null;
    const { senha: _, ...resultado } = usuario;
    return resultado;
  }

  gerarToken(usuario: { id: string; email: string; nome: string }) {
    const payload = { sub: usuario.id, email: usuario.email, nome: usuario.nome };
    return {
      token: this.jwtService.sign(payload),
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    };
  }

  async cadastrar(dto: CriarUsuarioDto) {
    const existente = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existente) throw new ConflictException('E-mail já cadastrado');

    const hash = await bcrypt.hash(dto.senha, 10);
    const { id, nome, email } = await this.prisma.usuario.create({
      data: { ...dto, senha: hash },
      select: { id: true, nome: true, email: true, criadoEm: true },
    });

    return this.gerarToken({ id, nome, email });
  }
}
