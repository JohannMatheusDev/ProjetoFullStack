import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EstoqueService } from './estoque.service';
import { CriarProdutoDto } from './dto/criar-produto.dto';
import { AtualizarProdutoDto } from './dto/atualizar-produto.dto';

@ApiTags('Estoque')
@Controller('estoque')
export class EstoqueController {
  constructor(private readonly service: EstoqueService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar produto ao estoque' })
  criar(@Body() dto: CriarProdutoDto) {
    return this.service.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  listar() {
    return this.service.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  atualizar(@Param('id') id: string, @Body() dto: AtualizarProdutoDto) {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover produto do estoque' })
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
