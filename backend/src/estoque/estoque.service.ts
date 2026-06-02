import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificacoesGateway } from '../notificacoes/notificacoes.gateway';
import { CriarProdutoDto } from './dto/criar-produto.dto';
import { AtualizarProdutoDto } from './dto/atualizar-produto.dto';

type StatusProduto = 'normal' | 'baixo' | 'critico';

function calcularStatus(quantidade: number): StatusProduto {
  if (quantidade <= 5) return 'critico';
  if (quantidade <= 20) return 'baixo';
  return 'normal';
}

@Injectable()
export class EstoqueService {
  constructor(
    private prisma: PrismaService,
    private notificacoes: NotificacoesGateway,
  ) {}

  async criar(dto: CriarProdutoDto) {
    const produto = await this.prisma.produto.create({ data: dto });
    return { ...produto, status: calcularStatus(produto.quantidade) };
  }

  async listar() {
    const produtos = await this.prisma.produto.findMany({ orderBy: { nome: 'asc' } });
    return produtos.map((p) => ({ ...p, status: calcularStatus(p.quantidade) }));
  }

  async buscarPorId(id: string) {
    const produto = await this.prisma.produto.findUnique({ where: { id } });
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return { ...produto, status: calcularStatus(produto.quantidade) };
  }

  async atualizar(id: string, dto: AtualizarProdutoDto) {
    await this.buscarPorId(id);
    const produto = await this.prisma.produto.update({ where: { id }, data: dto });
    const status = calcularStatus(produto.quantidade);
    if (status === 'critico') {
      this.notificacoes.emitir('estoque:critico', { id: produto.id, nome: produto.nome, quantidade: produto.quantidade });
    }
    return { ...produto, status };
  }

  async remover(id: string) {
    await this.buscarPorId(id);
    await this.prisma.produto.delete({ where: { id } });
    return { ok: true };
  }
}
