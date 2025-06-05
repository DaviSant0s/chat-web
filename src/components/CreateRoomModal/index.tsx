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


export default function CreateRoomModal() {

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nova Sala</DialogTitle>
        <DialogDescription>Crie uma nova sala no chat</DialogDescription>
      </DialogHeader>

      <form className="space-y-6">
        <div className="grid grid-cols-4 items-center text-right gap-3">
          <Label className="flex justify-end" htmlFor="name">
            Nome da Sala
          </Label>
          <Input className="col-span-3" id="name"/>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="cursor-pointer">
              Cancelar
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button type="submit" className="cursor-pointer">
              Salvar
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
