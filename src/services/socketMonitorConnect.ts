import { io } from 'socket.io-client';

export const socketMonitorConnect = () => io('https://server-monitor-hwy9.onrender.com');