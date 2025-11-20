// backend/app/src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // Guardar un mensaje nuevo
  async createMessage(data: { user: string; text: string; room: string }) {
    return this.prisma.message.create({
      data: {
        user: data.user,
        text: data.text,
        room: data.room,
      },
    });
  }

  // Obtener mensajes de una sala (historial)
  async getMessagesByRoom(room: string) {
    return this.prisma.message.findMany({
      where: { room },
      orderBy: { createdAt: 'asc' }, // Los más viejos primero
    });
  }
}