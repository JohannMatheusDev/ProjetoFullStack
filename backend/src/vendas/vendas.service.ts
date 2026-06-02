import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { StatusVenda } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificacoesGateway } from '../notificacoes/notificacoes.gateway';
import { CriarVendaDto } from './dto/criar-venda.dto';
import { AtualizarVendaDto } from './dto/atualizar-venda.dto';

@Injectable()
export class VendasService {
  constructor(
    private prisma: PrismaService,
    private notificacoes: NotificacoesGateway,
  ) {}

  async criar(dto: CriarVendaDto, usuarioId: string) {
    return this.prisma.$transaction(async (tx) => {
      let valorFinal = dto.valor;

      if (dto.produtoId) {
        const produto = await tx.produto.findUnique({ where: { id: dto.produtoId } });
        if (!produto) throw new NotFoundException('Produto não encontrado');

        const qtd = dto.quantidade ?? 1;
        valorFinal = Number(produto.preco) * qtd;

        const atualizado = await tx.produto.updateMany({
          where: { id: dto.produtoId, quantidade: { gte: qtd } },
          data: { quantidade: { decrement: qtd } },
        });

        if (atualizado.count === 0) {
          throw new BadRequestException(
            `Estoque insuficiente. Disponível: ${produto.quantidade} un.`,
          );
        }
      }

      const venda = await tx.venda.create({
        data: { ...dto, valor: valorFinal, quantidade: dto.quantidade ?? 1, usuarioId },
      });

      this.notificacoes.emitir('venda:criada', { id: venda.id, cliente: venda.cliente, valor: venda.valor });
      return venda;
    });
  }

  async listar() {
    return this.prisma.venda.findMany({
      orderBy: { criadoEm: 'desc' },
      include: {
        usuario: { select: { nome: true } },
        produto: { select: { nome: true } },
      },
    });
  }

  async buscarPorId(id: string) {
    const venda = await this.prisma.venda.findUnique({
      where: { id },
      include: {
        usuario: { select: { nome: true } },
        produto: { select: { nome: true } },
      },
    });
    if (!venda) throw new NotFoundException('Venda não encontrada');
    return venda;
  }

  async atualizar(id: string, dto: AtualizarVendaDto) {
    const venda = await this.prisma.venda.findUnique({ where: { id } });
    if (!venda) throw new NotFoundException('Venda não encontrada');

    return this.prisma.$transaction(async (tx) => {
      if (
        dto.status === StatusVenda.CANCELADO &&
        venda.status === StatusVenda.PENDENTE &&
        venda.produtoId
      ) {
        await tx.produto.update({
          where: { id: venda.produtoId },
          data: { quantidade: { increment: venda.quantidade } },
        });
      }

      const atualizada = await tx.venda.update({ where: { id }, data: dto });
      this.notificacoes.emitir('venda:atualizada', { id: atualizada.id, status: atualizada.status });
      return atualizada;
    });
  }

  async remover(id: string) {
    const venda = await this.prisma.venda.findUnique({ where: { id } });
    if (!venda) throw new NotFoundException('Venda não encontrada');

    return this.prisma.$transaction(async (tx) => {
      if (venda.status === StatusVenda.PENDENTE && venda.produtoId) {
        await tx.produto.update({
          where: { id: venda.produtoId },
          data: { quantidade: { increment: venda.quantidade } },
        });
      }
      await tx.venda.delete({ where: { id } });
      return { ok: true };
    });
  }
}
