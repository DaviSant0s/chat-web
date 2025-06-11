import AskUserNameModal from '@/components/AskUserNameModal';
import CardGroup from '@/components/CardGroup';
import ChatBubble from '@/components/ChatBubble';
import CreateRoomModal from '@/components/CreateRoomModal';
import InputSendMessage from '@/components/InputSendMessage';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface Message {
  room: string;
  text: string;
  createdAt: string; // vindo como string do back-end (JSON)
  username: string;
}

const socket = io('http://localhost:3000');

export default function Chat() {
  const [room, setRoom] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [joined, setJoined] = useState<boolean>(false);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  const [askUserName, setAskUserName] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [roomJoined, setRoomJoined] = useState<string>('');

  function handleJoinRoom(): void {
    socket.emit('select_room', { username, room });
  }

  const joinRoom = (roomName: string) => {
    setRoom(roomName);
    setRoomJoined(roomName);
    setJoined(true);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '' && joined) {
      socket.emit('message', {
        room,
        message,
        username,
      });
      setMessage('');
    }
  };

  const logOutUser = () => {
    localStorage.clear();
    setUsername('');
    setAskUserName(true);
    setJoined(false);
  };

  useEffect(() => {
    const usernameChat = localStorage.getItem('usernameChat');

    if (!usernameChat) {
      setAskUserName(() => true);
    } else {
      setUsername(usernameChat);
    }
  }, []);

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

  useEffect(() => {
    const fetchMessages = () => {
      socket.emit('get_messages', (messages: Message[]) => {
        const roomMessages = messages.filter(
          (message) => message.room === room
        );
        setMessages(roomMessages);
      });
    };

    fetchMessages();

    socket.on('messages_updated', fetchMessages);

    return () => {
      socket.off('messages_updated', fetchMessages);
    };
  }, [room]);

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
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                >
                  <Plus />
                </Button>
              </DialogTrigger>

              <CreateRoomModal
                handleJoinRoom={handleJoinRoom}
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
            <Button
              onClick={logOutUser}
              type="button"
              variant="outline"
              className="cursor-pointer"
            >
              <LogOut color="red" />
            </Button>
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
