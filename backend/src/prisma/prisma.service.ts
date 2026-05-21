import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    let tentativas = 0;
    while (tentativas < 5) {
      try {
        await this.$connect();
        this.logger.log('Banco de dados conectado.');
        return;
      } catch {
        tentativas++;
        this.logger.warn(`Tentativa ${tentativas}/5 — banco acordando, aguardando 3s...`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    this.logger.error('Não foi possível conectar ao banco após 5 tentativas.');
  }
}
