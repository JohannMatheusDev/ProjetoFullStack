import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsPositive, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CriarVendaDto {
  @ApiProperty({ example: 'Bernardo Barbosa' })
  @IsString()
  cliente: string;

  @ApiProperty({ example: 3200.0 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  valor: number;

  @ApiPropertyOptional({ example: 'uuid-do-produto' })
  @IsOptional()
  @IsUUID()
  produtoId?: string;

  @ApiPropertyOptional({ example: 2, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantidade?: number;
}
