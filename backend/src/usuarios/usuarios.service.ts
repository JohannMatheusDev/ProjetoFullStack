import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async criar(dto: CriarUsuarioDto) {
    const existente = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existente) throw new ConflictException('E-mail já cadastrado');

    const hash = await bcrypt.hash(dto.senha, 10);
    return this.prisma.usuario.create({
      data: { ...dto, senha: hash },
      select: { id: true, nome: true, email: true, criadoEm: true },
    });
  }

  async listar() {
    return this.prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, criadoEm: true },
    });
  }

  async buscarPorId(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: { id: true, nome: true, email: true, criadoEm: true },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return usuario;
  }

  async remover(id: string) {
    await this.buscarPorId(id);
    await this.prisma.usuario.delete({ where: { id } });
    return { ok: true };
  }
}
