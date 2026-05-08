import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarLancamentoDto } from './dto/criar-lancamento.dto';
import { TipoLancamento } from '@prisma/client';

@Injectable()
export class FinancasService {
  constructor(private prisma: PrismaService) {}

  async criar(dto: CriarLancamentoDto) {
    return this.prisma.lancamento.create({ data: dto });
  }

  async listar() {
    return this.prisma.lancamento.findMany({ orderBy: { criadoEm: 'desc' } });
  }

  async buscarPorId(id: string) {
    const lancamento = await this.prisma.lancamento.findUnique({ where: { id } });
    if (!lancamento) throw new NotFoundException('Lançamento não encontrado');
    return lancamento;
  }

  async remover(id: string) {
    await this.buscarPorId(id);
    await this.prisma.lancamento.delete({ where: { id } });
    return { ok: true };
  }

  async resumo() {
    const lancamentos = await this.prisma.lancamento.findMany();
    const entradas = lancamentos
      .filter((l) => l.tipo === TipoLancamento.ENTRADA)
      .reduce((acc, l) => acc + Number(l.valor), 0);
    const saidas = lancamentos
      .filter((l) => l.tipo === TipoLancamento.SAIDA)
      .reduce((acc, l) => acc + Number(l.valor), 0);
    return { entradas, saidas, saldo: entradas - saidas };
  }
}
