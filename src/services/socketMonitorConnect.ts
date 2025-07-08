import { io } from 'socket.io-client';

const url = 'https://server-monitor-hwy9.onrender.com';
// const url = 'http://localhost:3002';

export const socketMonitorConnect = () => io(url);