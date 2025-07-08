import { io, Socket } from 'socket.io-client';
import { checkServer } from './checkServer';

const connectSocket = (url: string): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    const socket = io(`${url}/`, { reconnection: false });

    socket.on('connect', () => resolve(socket));

    socket.on('connect_error', (error) => reject(error));
  });
};

const waitForServer = async (url: string) => {

  const tempoTotal = 1000; // 5 segundos
  const intervalo = 500; // tenta a cada 0.5 segundos
  const tentativas = tempoTotal / intervalo;

  for (let i = 0; i < tentativas; i++) {
    try {
      await checkServer(url);
      return;

    } catch {
      await new Promise(res => setTimeout(res, intervalo));
    }
  }

  throw new Error(`Servidor ${url} não respondeu`);

}

export const socketConnect = async (): Promise<Socket> => {

  try {
  
    const url = 'https://main-server-chat.onrender.com';
    // const url = 'http://localhost:3000';

    await waitForServer(url);

    console.log('Conectando ao servidor principal');
    return await connectSocket(url);

  } catch {

    try {
    
      const url = 'https://backup-server-chat.onrender.com';
      //const url = 'http://localhost:3001';

      // await new Promise(res => setTimeout(res, 2000)); 

      await waitForServer(url);

      console.log('Conectando ao servidor de backup');
      return await connectSocket(url);

    } catch {

      throw new Error('[connectSocket] Nenhum servidor disponível no momento');

    }
  }

};
