import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CriarProdutoDto {
  @ApiProperty({ example: 'Notebook Pro X1' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'Eletrônicos' })
  @IsString()
  categoria: string;

  @ApiProperty({ example: 48 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  quantidade: number;

  @ApiProperty({ example: 4200.0 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  preco: number;
}
