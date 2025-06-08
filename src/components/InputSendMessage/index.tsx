import { Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface InputSendMessage {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
}

export default function InputSendMessage({message, setMessage, handleSendMessage}: InputSendMessage) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Input value={message} onChange={e => setMessage(e.target.value)} className='h-12 ' placeholder="Envie sua mensagem" />

      <Button onClick={handleSendMessage} type="button" variant="default" className="cursor-pointer h-12 bg-gray-600">
        <Send className="w-4 h-4 mr-2" />
        Enviar
      </Button>
    </div>
  );
}
