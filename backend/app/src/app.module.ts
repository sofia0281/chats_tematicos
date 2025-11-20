// backend/app/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module'; // Asegúrate de importar esto

@Module({
  imports: [ChatModule], // <--- Aquí cargamos todo el módulo del chat
  controllers: [AppController],
  providers: [AppService], // <--- AQUÍ YA NO DEBE ESTAR ChatGateway
})
export class AppModule {}