import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface CreateRoomModal {
  handleCreateRoom: () => void;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  room: string;
}


export default function CreateRoomModal({ handleCreateRoom, setRoom, room }: CreateRoomModal) {

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nova Sala</DialogTitle>
        <DialogDescription>Crie uma nova sala no chat</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-4 items-center text-right gap-3">
          <Label className="flex justify-end" htmlFor="name">
            Nome da Sala
          </Label>
          <Input onChange={(e) => setRoom(e.target.value)} value={room} className="col-span-3" id="name"/>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="cursor-pointer">
              Cancelar
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button onClick={handleCreateRoom} type="button" className="cursor-pointer">
              Salvar
            </Button>
          </DialogClose>
        </DialogFooter>
      </div>
    </DialogContent>
  );
}
