import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { CriarUsuarioDto } from '../usuarios/dto/criar-usuario.dto';
import { LocalGuarda } from './guardas/local.guarda';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @UseGuards(LocalGuarda)
  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiBody({ type: LoginDto })
  login(@Req() req: Request & { user: { id: string; nome: string; email: string } }) {
    return this.authService.gerarToken(req.user);
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('cadastro')
  @ApiOperation({ summary: 'Criar conta e retornar token' })
  cadastrar(@Body() dto: CriarUsuarioDto) {
    return this.authService.cadastrar(dto);
  }
}
