
'use client';
import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';

export default function Home() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');

  // Importamos funciones del store
  const { connect, isConnected, messages, sendMessage, currentUser, currentRoom } = useChatStore();

  const handleLogin = () => {
    if (username && room) connect(username, room);
  };

  const handleSend = () => {
    if (message) {
      sendMessage(message);
      setMessage('');
    }
  };

  if (!isConnected) {
    // Pantalla de Login Básica
    return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white gap-4">
        <h1 className="text-2xl font-bold">Entrar al Chat</h1>
        <input 
          placeholder="Nombre de usuario" 
          className="p-2 rounded text-black"
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          placeholder="Sala (ej: General)" 
          className="p-2 rounded text-black"
          value={room} 
          onChange={(e) => setRoom(e.target.value)}
        />
        <button 
          onClick={handleLogin}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          Unirse
        </button>
      </div>
    );
  }

  

  // Pantalla de Chat Básica
  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white p-4">
      <div className="mb-4 border-b pb-2">
        <h2 className="text-xl">Sala: <span className="font-bold text-green-400">{currentRoom}</span></h2>
        <p className="text-sm text-gray-400">Usuario: {currentUser}</p>
      </div>

      {/* Área de Mensajes */}
      <div className="flex-1 overflow-y-auto bg-gray-900 p-4 rounded mb-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 rounded max-w-xs ${msg.user === currentUser ? 'bg-blue-600 ml-auto' : 'bg-gray-700'}`}>
            <p className="text-xs text-gray-300 font-bold">{msg.user}</p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input 
          className="flex-1 p-2 rounded text-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe un mensaje..."
        />
        <button 
          onClick={handleSend}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
