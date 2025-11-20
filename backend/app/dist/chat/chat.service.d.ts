import { PrismaService } from '../prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    createMessage(data: {
        user: string;
        text: string;
        room: string;
    }): Promise<{
        user: string;
        text: string;
        room: string;
        createdAt: Date;
        id: number;
    }>;
    getMessagesByRoom(room: string): Promise<{
        user: string;
        text: string;
        room: string;
        createdAt: Date;
        id: number;
    }[]>;
}
