// frontend/store/useChatStore.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface Message {
  user: string;
  text: string;
  timestamp?: string; // Hacemos opcional el timestamp por si acaso
}

interface ChatState {
  socket: Socket | null;
  messages: Message[];
  isConnected: boolean;
  currentUser: string;
  currentRoom: string;
  
  connect: (username: string, room: string) => void;
  sendMessage: (text: string) => void;
  disconnect: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  messages: [],
  isConnected: false,
  currentUser: '',
  currentRoom: '',

  connect: (username: string, room: string) => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('🟢 Conectado al socket (Frontend)');
      set({ isConnected: true, socket, currentUser: username, currentRoom: room });
      
      // Unirse a la sala
      socket.emit('joinRoom', { room, username });
    });

    // Escuchar el historial cuando entramos a la sala
    socket.on('history', (history: Message[]) => {
      console.log('📜 ¡HISTORIAL RECIBIDO EN EL STORE!', history);
      set({ messages: history });
    });
    // ------------------------------------------------

    // Escuchar mensajes nuevos en tiempo real
    socket.on('message', (message: Message) => {
      console.log('📩 Nuevo mensaje en tiempo real:', message);
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on('disconnect', () => {
      console.log('🔴 Desconectado');
      set({ isConnected: false, socket: null, messages: [] });
    });
  },

  sendMessage: (text: string) => {
    const { socket, currentRoom, currentUser } = get();
    if (socket) {
      socket.emit('sendMessage', {
        room: currentRoom,
        user: currentUser,
        text,
      });
    }
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) socket.disconnect();
    set({ socket: null, isConnected: false, messages: [] });
  },
}));