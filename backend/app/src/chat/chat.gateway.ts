import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

// @WebSocketGateway()
// export class ChatGateway {
//   @SubscribeMessage('message')
//   handleMessage(client: any, payload: any): string {
//     return 'Hello world!';
//   }
// }
import {
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Permite que el Frontend se conecte desde cualquier puerto
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Unirse a una sala
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { room: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room, username } = data;
    client.join(room);
    console.log(`${username} entró a la sala ${room}`);

    // Notificar a la sala
    client.to(room).emit('message', {
      user: 'Sistema',
      text: `${username} se ha unido al chat.`,
      timestamp: new Date(),
    });
  }

  // Enviar mensaje
  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { room: string; user: string; text: string },
  ) {
    // Reenviar a todos en la sala
    this.server.to(data.room).emit('message', {
      user: data.user,
      text: data.text,
      timestamp: new Date(),
    });
  }
}