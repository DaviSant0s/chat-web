import { Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function InputSendMessage() {
  return (
    <form className="flex items-center gap-2 mb-2">
      <Input className='h-12 ' placeholder="Envie sua mensagem" />

      <Button type="submit" variant="default" className="cursor-pointer h-12 bg-gray-600">
        <Send className="w-4 h-4 mr-2" />
        Enviar
      </Button>
    </form>
  );
}
