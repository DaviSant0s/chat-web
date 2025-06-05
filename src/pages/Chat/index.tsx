import CardGroup from '@/components/CardGroup';
import CreateRoomModal from '@/components/CreateRoomModal';
import InputSendMessage from '@/components/InputSendMessage';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface Message {
  room: string;
  text: string;
  createdAt: string; // vindo como string do back-end (JSON)
  username: string;
}

interface SelectRoomData {
  username: string;
  room: string;
}

interface CreateRoom {
  username: string;
  room: string;
}

const socket = io('http://localhost:3000');

export default function Chat() {
  const [room, setRoom] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [joined, setJoined] = useState<boolean>(false);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  const [createRoom, setCreateRoom] = useState<CreateRoom>({
    username: 'Davi',
    room: '',
  });

  const [createRoomModal, setCreateRoomModal] = useState<boolean>(false);

  function handleJoinRoom(): void {
    if (username !== '' && room !== '') {
      socket.emit(
        'select_room',
        { username, room },
        (roomMessages: Message[]) => {
          setMessages(roomMessages);
          setJoined(true);
        }
      );
    }
  }

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('message', {
        room,
        message,
        username,
      });
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    const fetchRooms = () => {
      socket.emit('get_rooms', (rooms: string[]) => {
        setAvailableRooms(rooms);
      });
    };

    fetchRooms(); // Carrega inicialmente

    // 🔔 Escuta atualizações de salas
    socket.on('rooms_updated', fetchRooms);

    return () => {
      socket.off('rooms_updated', fetchRooms);
    };
  }, []);

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
            <h1 className="font-extrabold text-slate-900 text-2xl">Grupos</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setCreateRoomModal(true)}
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                >
                  <Plus />
                </Button>
              </DialogTrigger>

              {createRoomModal && <CreateRoomModal />}
            </Dialog>
          </div>

          {availableRooms && availableRooms.map((room, index) => (
            <div key={index}>
              <CardGroup name={room}/>
            </div>
          ))}

        </div>
        <div className="w-full h-full flex flex-col">
          <div className="h-16 flex items-center shrink-0 pl-2  border-b-2  bg-white">
            <h1 className="font-extrabold text-slate-900 text-2xl">NodeJS</h1>
          </div>

          <div className="flex flex-col h-full bg-gray-100">
            <div className="w-full h-full flex-col p-2">
              <div className="w-full">
                <div className="flex justify-start mb-2">
                  <div
                    className={clsx(
                      'max-w-2xs',
                      'bg-white ',
                      'text-black',
                      'p-2',
                      'rounded-lg',
                      'rounded-bl-none',
                      'shadow',
                      'break-words'
                    )}
                  >
                    Oii tudo bem??
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-end mb-2">
                  <div
                    className={clsx(
                      'max-w-xs',
                      'bg-green-500',
                      'text-white',
                      'p-2',
                      'rounded-lg',
                      'rounded-br-none',
                      'shadow',
                      'break-words'
                    )}
                  >
                    Tudo sim! E você?
                  </div>
                </div>
              </div>
            </div>
            <div className="max-h-fit pl-2 pr-2">
              <InputSendMessage />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
