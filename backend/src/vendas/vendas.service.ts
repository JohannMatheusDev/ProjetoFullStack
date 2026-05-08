import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarVendaDto } from './dto/criar-venda.dto';
import { AtualizarVendaDto } from './dto/atualizar-venda.dto';

@Injectable()
export class VendasService {
  constructor(private prisma: PrismaService) {}

  async criar(dto: CriarVendaDto) {
    return this.prisma.venda.create({ data: dto });
  }

  async listar() {
    return this.prisma.venda.findMany({
      orderBy: { criadoEm: 'desc' },
      include: { usuario: { select: { nome: true } } },
    });
  }

  async buscarPorId(id: string) {
    const venda = await this.prisma.venda.findUnique({
      where: { id },
      include: { usuario: { select: { nome: true } } },
    });
    if (!venda) throw new NotFoundException('Venda não encontrada');
    return venda;
  }

  async atualizar(id: string, dto: AtualizarVendaDto) {
    await this.buscarPorId(id);
    return this.prisma.venda.update({ where: { id }, data: dto });
  }

  async remover(id: string) {
    await this.buscarPorId(id);
    await this.prisma.venda.delete({ where: { id } });
    return { ok: true };
  }
}
