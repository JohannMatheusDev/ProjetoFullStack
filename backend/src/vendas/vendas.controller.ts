import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { VendasService } from './vendas.service';
import { CriarVendaDto } from './dto/criar-venda.dto';
import { AtualizarVendaDto } from './dto/atualizar-venda.dto';
import { JwtGuarda } from '../auth/guardas/jwt.guarda';

@ApiTags('Vendas')
@ApiBearerAuth()
@UseGuards(JwtGuarda)
@Controller('vendas')
export class VendasController {
  constructor(private readonly service: VendasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nova venda' })
  criar(
    @Body() dto: CriarVendaDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.service.criar(dto, req.user.id);
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
