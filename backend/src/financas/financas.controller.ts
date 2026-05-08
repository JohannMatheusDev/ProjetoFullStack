import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FinancasService } from './financas.service';
import { CriarLancamentoDto } from './dto/criar-lancamento.dto';

@ApiTags('Finanças')
@Controller('financas')
export class FinancasController {
  constructor(private readonly service: FinancasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar lançamento financeiro' })
  criar(@Body() dto: CriarLancamentoDto) {
    return this.service.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os lançamentos' })
  listar() {
    return this.service.listar();
  }

  @Get('resumo')
  @ApiOperation({ summary: 'Resumo financeiro (entradas, saídas, saldo)' })
  resumo() {
    return this.service.resumo();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar lançamento por ID' })
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover lançamento' })
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
