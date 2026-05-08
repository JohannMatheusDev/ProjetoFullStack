import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo usuário' })
  criar(@Body() dto: CriarUsuarioDto) {
    return this.service.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  listar() {
    return this.service.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuário' })
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
