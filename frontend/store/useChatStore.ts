// frontend/store/useChatStore.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface Message {
  user: string;
  text: string;
  timestamp?: string;
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
    // Si ya existe una conexión activa, no creamos otra
    const currentSocket = get().socket;
    if (currentSocket?.connected) return;

    // 1. CONFIGURACIÓN ROBUSTA PARA DOCKER
    const socket = io('http://localhost:3000', {
      transports: ['websocket'], // <--- ESTO ES CLAVE: Fuerza WebSocket directo sin polling
      autoConnect: true,
    });

    // 2. PREPARAMOS LOS LISTENERS ANTES DE HACER NADA
    
    socket.on('connect', () => {
      console.log('🟢 [FRONTEND] Socket Conectado ID:', socket.id);
      set({ isConnected: true, socket, currentUser: username, currentRoom: room });
      
      // Apenas conecta, nos unimos
      console.log(`📤 [FRONTEND] Solicitando unirse a sala: ${room}`);
      socket.emit('joinRoom', { room, username });
    });

    socket.on('history', (history: Message[]) => {
      // ESTE ES EL LOG QUE BUSCAMOS
      console.log('📜 [FRONTEND] ¡HISTORIAL RECIBIDO!', history); 
      set({ messages: history });
    });

    socket.on('message', (message: Message) => {
      console.log('📩 [FRONTEND] Nuevo mensaje:', message);
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on('disconnect', () => {
      console.log('🔴 [FRONTEND] Socket Desconectado');
      set({ isConnected: false });
    });

    socket.on('connect_error', (err) => {
        console.error('⚠️ [FRONTEND] Error de conexión:', err.message);
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
    if (socket) {
        socket.disconnect();
    }
    set({ socket: null, isConnected: false, messages: [] });
  },
}));