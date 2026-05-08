import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusVenda } from '@prisma/client';

export class AtualizarVendaDto {
  @ApiPropertyOptional({ example: 'Moaca Manga' })
  @IsOptional()
  @IsString()
  cliente?: string;

  @ApiPropertyOptional({ example: 1500.0 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  valor?: number;

  @ApiPropertyOptional({ enum: StatusVenda })
  @IsOptional()
  @IsEnum(StatusVenda)
  status?: StatusVenda;
}
