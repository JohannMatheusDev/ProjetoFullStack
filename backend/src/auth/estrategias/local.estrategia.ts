import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalEstrategia extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'senha' });
  }

  async validate(email: string, senha: string) {
    const usuario = await this.authService.validarUsuario(email, senha);
    if (!usuario) throw new UnauthorizedException('Credenciais inválidas');
    return usuario;
  }
}
