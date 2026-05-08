import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AtualizarProdutoDto {
  @ApiPropertyOptional({ example: 'Monitor UltraWide' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ example: 'Eletrônicos' })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  quantidade?: number;

  @ApiPropertyOptional({ example: 1800.0 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  preco?: number;
}
