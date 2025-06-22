/// <reference lib="webworker" />

import { socketConnect } from '@/services/socketConnect';

let currentRoom = '';

const socket = socketConnect();

interface Message {
  room: string;
  text: string;
  createdAt: string;
  username: string;
}

self.onmessage = (event: MessageEvent) => {
  if (event.data.type === 'select_room') {

    const { username, room } = event.data.payload;
    currentRoom = room;

    socket.emit('select_room', { username, room }, (data: Message[]) => (
      console.log(data)
    ));
  }
};

socket.on('message', (message: Message) => {
  if (message.room === currentRoom) {
    self.postMessage(message);
  }
});
