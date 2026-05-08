import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CriarUsuarioDto {
  @ApiProperty({ example: 'Bernardo Barbosa' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'bernardo@erpdu.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6)
  senha: string;
}
