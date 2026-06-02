import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: 'http://localhost:3000', credentials: true } })
export class NotificacoesGateway {
  @WebSocketServer()
  server: Server;

  emitir(evento: string, dados: unknown) {
    this.server.emit(evento, dados);
  }
}
