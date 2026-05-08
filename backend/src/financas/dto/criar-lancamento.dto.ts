import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoLancamento } from '@prisma/client';

export class CriarLancamentoDto {
  @ApiProperty({ example: 'Receita de vendas — Maio' })
  @IsString()
  descricao: string;

  @ApiProperty({ enum: TipoLancamento, example: TipoLancamento.ENTRADA })
  @IsEnum(TipoLancamento)
  tipo: TipoLancamento;

  @ApiProperty({ example: 96200.0 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  valor: number;
}
