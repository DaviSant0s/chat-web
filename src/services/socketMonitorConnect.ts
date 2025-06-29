import { io } from 'socket.io-client';

export const socketMonitorConnect = () => io('http://localhost:3002');