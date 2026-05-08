import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VendasService } from './vendas.service';
import { CriarVendaDto } from './dto/criar-venda.dto';
import { AtualizarVendaDto } from './dto/atualizar-venda.dto';

@ApiTags('Vendas')
@Controller('vendas')
export class VendasController {
  constructor(private readonly service: VendasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nova venda' })
  criar(@Body() dto: CriarVendaDto) {
    return this.service.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as vendas' })
  listar() {
    return this.service.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar venda por ID' })
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar venda' })
  atualizar(@Param('id') id: string, @Body() dto: AtualizarVendaDto) {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover venda' })
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
