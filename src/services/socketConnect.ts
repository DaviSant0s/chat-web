import { io } from 'socket.io-client';

// export const socketConnect = () => io('https://chat-websocket-api-qixk.onrender.com/');
export const socketConnect = () => io('http://localhost:3000');