// backend/app/src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [ChatGateway, ChatService, PrismaService], // Aquí sí deben estar los tres
})
export class ChatModule {}