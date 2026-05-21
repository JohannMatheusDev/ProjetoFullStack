import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { StatusVenda } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CriarVendaDto } from './dto/criar-venda.dto';
import { AtualizarVendaDto } from './dto/atualizar-venda.dto';

@Injectable()
export class VendasService {
  constructor(private prisma: PrismaService) {}

  async criar(dto: CriarVendaDto, usuarioId: string) {
    return this.prisma.$transaction(async (tx) => {
      let valorFinal = dto.valor;

      if (dto.produtoId) {
        const produto = await tx.produto.findUnique({ where: { id: dto.produtoId } });
        if (!produto) throw new NotFoundException('Produto não encontrado');

        const qtd = dto.quantidade ?? 1;
        if (produto.quantidade < qtd) {
          throw new BadRequestException(
            `Estoque insuficiente. Disponível: ${produto.quantidade} un.`,
          );
        }

        valorFinal = Number(produto.preco) * qtd;

        await tx.produto.update({
          where: { id: dto.produtoId },
          data: { quantidade: { decrement: qtd } },
        });
      }

      return tx.venda.create({
        data: { ...dto, valor: valorFinal, quantidade: dto.quantidade ?? 1, usuarioId },
      });
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

      return tx.venda.update({ where: { id }, data: dto });
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
