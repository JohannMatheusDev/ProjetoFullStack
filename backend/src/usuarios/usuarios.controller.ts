import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { UsuariosService } from './usuarios.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { JwtGuarda } from '../auth/guardas/jwt.guarda';

@ApiTags('Usuários')
@ApiBearerAuth()
@UseGuards(JwtGuarda)
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
  remover(@Param('id') id: string, @Req() req: Request & { user: { id: string } }) {
    if (id === req.user.id) throw new ForbiddenException('Não é possível remover a própria conta');
    return this.service.remover(id);
  }
}
