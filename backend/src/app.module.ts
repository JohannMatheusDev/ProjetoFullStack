import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VendasModule } from './vendas/vendas.module';
import { EstoqueModule } from './estoque/estoque.module';
import { FinancasModule } from './financas/financas.module';

@Module({
  imports: [PrismaModule, UsuariosModule, VendasModule, EstoqueModule, FinancasModule],
})
export class AppModule {}
