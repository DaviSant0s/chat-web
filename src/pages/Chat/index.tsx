import AskUserNameModal from '@/components/AskUserNameModal';
import CardGroup from '@/components/CardGroup';
import ChatBubble from '@/components/ChatBubble';
import CreateRoomModal from '@/components/CreateRoomModal';
import InputSendMessage from '@/components/InputSendMessage';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { socketConnect } from '@/services/socketConnect';
import clsx from 'clsx';
import { CircleX, Plus } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Worker from '@/workers/messageWorker?worker';
import { type Socket } from 'socket.io-client';
import { socketMonitorConnect } from '@/services/socketMonitorConnect';

// const socket = socketConnect();

// Socket que vai fazer o monitoramento
const socket_monitor = socketMonitorConnect();

interface Message {
  room: string;
  text: string;
  createdAt: string;
  username: string;
}

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);

  const socketRef = useRef<Socket | null>(null);

  const messageWorkerRef = useRef<Worker | null>(null);

  const [room, setRoom] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [joined, setJoined] = useState<boolean>(false);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  const [askUserName, setAskUserName] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [roomJoined, setRoomJoined] = useState<string>('');

  const workerRoomJoin = (roomName: string) => {
    if (messageWorkerRef.current && username) {
      messageWorkerRef.current.postMessage({
        type: 'select_room',
        payload: { username, room: roomName },
      });
    }
  };

  function handleCreateRoom(): void {
    if (socket) {
      socket.emit('select_room', { username, room });

      // Indica que o usuário logou na sala criada
      setRoomJoined(room);
      setJoined(true);

      // loga na mesma sala dentro da thead
      workerRoomJoin(room);
    }
  }

  const joinRoom = (roomName: string) => {
    if (socket) {
      setRoom(roomName);
      setRoomJoined(roomName);
      setJoined(true);

      // Chama o evento que emite 'select_room' para o servidor
      socket.emit('select_room', { username, room: roomName });

      // loga na mesma sala dentro da thead
      workerRoomJoin(roomName);
    }
  };

  const shutdown_server = () => {
    if (socket) {
      socket.emit('shutdown_server');
    }
  };

  const handleSendMessage = () => {
    if (socket) {
      if (message.trim() !== '' && joined) {
        socket.emit('message', {
          room,
          message,
          username,
        });
        setMessage('');
      }
    }
  };

  const logOutUser = () => {
    localStorage.clear();
    setUsername('');
    setAskUserName(true);
    setMessage('');
    setMessages([]);
    setRoomJoined('');
    setJoined(false);
  };

  useEffect(() => {
    const connect_server = async () => {
      try {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }

        const socket_connected = await socketConnect();

        socketRef.current = socket_connected;
        setSocket(socket_connected);
      } catch (error) {
        console.log('Erro ao conectar:', error);
      }
    };

    const change_server = async () => {
      console.log('Servidor principal caiu. Conectado ao servidor de backup.');
      try {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }

        const socket_connected = await socketConnect();

        socketRef.current = socket_connected;
        setSocket(socket_connected);

        // Notifica o worker para trocar de servidor
        messageWorkerRef.current?.postMessage({
          type: 'change_server',
          payload: {},
        });
      } catch (error) {
        console.log('Falha ao conectar no segundo servidor:', error);
      }
    };

    connect_server();

    //Escuta atualizações de salas
    socket_monitor.on('server_changed', change_server);

    return () => {
      socket_monitor.off('server_changed', change_server);

      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const usernameChat = localStorage.getItem('usernameChat');

    if (!usernameChat) {
      setAskUserName(() => true);
    } else {
      setUsername(usernameChat);
    }
  }, []);

  // Instancia o worker e ativa o ouvinte responsável por receber a nova mensagem
  useEffect(() => {
    messageWorkerRef.current = new Worker();

    messageWorkerRef.current.onmessage = (event) => {
      const { type, payload } = event.data;

      if (type === 'new_message') {
        setMessages((prevMessages) => [...prevMessages, payload]);
      }

      if (type === 'message_history') {
        setMessages(payload);
      }
    };

    return () => {
      // Termina o worker
      messageWorkerRef.current?.terminate();
      messageWorkerRef.current = null;
    };
  }, []);

  // Responsável por retornar todas as salas
  useEffect(() => {
    const fetchRooms = () => {
      if (!socket) return;

      socket.emit('get_rooms', (rooms: string[]) => {
        setAvailableRooms(rooms);
      });
    };

    if (socket) {
      fetchRooms(); // Carrega inicialmente

      // Escuta atualizações de salas
      socket.on('rooms_updated', fetchRooms);
    }

    return () => {
      if (socket) {
        socket.off('rooms_updated', fetchRooms);
      }
    };
  }, [socket]);

  return (
    <Layout>
      <div
        className={clsx(
          'h-full',
          'flex',
          'flex-row',
          'justify-baseline',
          'border-l-1',
          'border-r-1',
          'border-slate-300',
          'shadow-gray-400',
          'shadow-2xl'
        )}
      >
        <div className="w-2/3 bg-white border-r-1">
          <div className="h-16 flex items-center justify-between pl-2 pr-2 border-b-2">
            <h1 className="font-extrabold text-slate-900 text-2xl">Salas</h1>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                >
                  <Plus />
                </Button>
              </DialogTrigger>

              <CreateRoomModal
                handleCreateRoom={handleCreateRoom}
                setRoom={setRoom}
                room={room}
              />
            </Dialog>
          </div>

          {availableRooms &&
            availableRooms.map((room, index) => (
              <div key={index}>
                <CardGroup name={room} joinRoom={joinRoom} />
              </div>
            ))}
        </div>
        <div className="w-full h-full flex flex-col">
          <div className="h-16 flex items-center justify-between shrink-0 pl-2 pr-2  border-b-2  bg-white">
            <h1 className="font-extrabold text-slate-900 text-2xl">
              {roomJoined}
            </h1>

            <div className="flex gap-1">
              <Button
                onClick={shutdown_server}
                type="button"
                variant="outline"
                className="cursor-pointer"
              >
                Derrubar
                <CircleX />
              </Button>

              <Button
                onClick={logOutUser}
                type="button"
                variant="outline"
                className="cursor-pointer"
              >
                <LogOut color="red" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col h-full bg-gray-100">
            <div className="w-full h-full flex-col p-2">
              {messages.length !== 0 &&
                messages.map((msg, index) => (
                  <div key={index} className="w-full">
                    {msg.username === username && (
                      <ChatBubble side="right" msg={msg.text} />
                    )}

                    {msg.username !== username && (
                      <ChatBubble
                        side="left"
                        msg={msg.text}
                        username={msg.username}
                      />
                    )}
                  </div>
                ))}
            </div>
            <div className="max-h-fit pl-2 pr-2">
              <InputSendMessage
                message={message}
                setMessage={setMessage}
                handleSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </div>
        <Dialog open={askUserName}>
          <AskUserNameModal
            setAskUserName={setAskUserName}
            setUsername={setUsername}
            username={username}
          />
        </Dialog>
      </div>
    </Layout>
  );
}
