import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusVenda } from '@prisma/client';

export class CriarVendaDto {
  @ApiProperty({ example: 'Bernardo Barbosa' })
  @IsString()
  cliente: string;

  @ApiProperty({ example: 3200.0 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  valor: number;

  @ApiPropertyOptional({ enum: StatusVenda, default: StatusVenda.PENDENTE })
  @IsOptional()
  @IsEnum(StatusVenda)
  status?: StatusVenda;

  @ApiProperty({ example: 'uuid-do-usuario' })
  @IsUUID()
  usuarioId: string;
}
