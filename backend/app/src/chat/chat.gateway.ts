// backend/app/src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { room: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room, username } = data;
    client.join(room);
    console.log(`📥 ${username} solicitó unirse a ${room}`);

    // 1. RECUPERAR HISTORIAL
    const rawHistory = await this.chatService.getMessagesByRoom(room);
    
    // LOG PARA VER SI HAY DATOS EN LA DB
    console.log(`💾 Mensajes encontrados en DB para ${room}:`, rawHistory.length);

    // 2. TRANSFORMACIÓN DE DATOS (CRUCIAL)
    // Convertimos 'createdAt' de Prisma a 'timestamp' para el Frontend
    const history = rawHistory.map(msg => ({
      user: msg.user,
      text: msg.text,
      timestamp: msg.createdAt.toISOString(), // Convertimos Date a String
    }));

    // 3. Enviar al cliente
    client.emit('history', history); 

    // 4. Notificar entrada
    client.to(room).emit('message', {
      user: 'Sistema',
      text: `${username} entró a la sala.`,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { room: string; user: string; text: string },
  ) {
    console.log(`📝 Intentando guardar mensaje de ${data.user}`);

    // 1. GUARDAR EN BD
    const savedMsg = await this.chatService.createMessage({
      room: data.room,
      user: data.user,
      text: data.text,
    });

    console.log('✅ Mensaje guardado ID:', savedMsg.id);

    // 2. Enviar a todos (Transformado)
    this.server.to(data.room).emit('message', {
      user: savedMsg.user,
      text: savedMsg.text,
      timestamp: savedMsg.createdAt.toISOString(),
    });
  }
}