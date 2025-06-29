/// <reference lib="webworker" />

import { socketConnect } from '@/services/socketConnect';
import type { Socket } from 'socket.io-client';

interface Message {
  room: string;
  text: string;
  createdAt: string;
  username: string;
}

let currentRoom = '';
let currentUser = '';

let socket: Socket | undefined;

const start = async () => {

  if (socket) {
    socket.disconnect();
  }  

  try {

    socket = await socketConnect();
    listeners();
    
  } catch (error) {
    console.error('[Worker] Erro ao conectar socket:', error);
  }

};

start();

const listeners = () => {

  if (!socket) {
    console.warn('[Worker] socket indefinido, não é possível setar listeners');
    return;
  }

  // limpa os listenners antes de criar novos
  socket.off('message');
  socket.off('message_history');

  // ouvintes
  socket.on('message', (message: Message) => {
    if (message.room === currentRoom) {
      self.postMessage({ type: 'new_message', payload: message });
    }
  });

  socket.on('message_history', (messages: Message[]) => {
    self.postMessage({ type: 'message_history', payload: messages });
  });
};

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === 'select_room') {
    const { username, room } = payload;
    currentRoom = room;
    currentUser = username;

    socket?.emit('select_room', { username, room }, (data: Message[]) =>
      console.log(data)
    );
  }

  if (type === 'change_server') {
    console.log('[Worker] Trocando para socket de backup');

    await start();

    // limpa o ouvinte antes de criar um novo
    socket?.off('connect');

    socket?.on('connect', () => {
      if (currentRoom && currentUser) {
        socket?.emit(
          'select_room',
          { username: currentUser, room: currentRoom },
          (data: Message[]) => console.log(data)
        );
      }
    });
  }
};
