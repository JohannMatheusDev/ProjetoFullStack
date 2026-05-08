import { Module } from '@nestjs/common';
import { FinancasController } from './financas.controller';
import { FinancasService } from './financas.service';

@Module({
  controllers: [FinancasController],
  providers: [FinancasService],
})
export class FinancasModule {}
