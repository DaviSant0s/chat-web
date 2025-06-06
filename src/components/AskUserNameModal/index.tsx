import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AskUserName {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setAskUserName: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AskUserNameModal({
  setUsername,
  username,
  setAskUserName,
}: AskUserName) {
  const saveUsernameLocalStorage = () => {

    if (username.trim() === '') {
      alert('Por favor, insira um nome de usuário.');
      return;
    }

    localStorage.setItem('usernameChat', username);
    setAskUserName(false);
    
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nome</DialogTitle>
      </DialogHeader>

      <div className="flex flex-row items-center text-right gap-3">
        <Input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="col-span-3"
          id="name"
          placeholder="Digite seu nome de usuário"
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={saveUsernameLocalStorage}
              type="button"
              className="cursor-pointer"
            >
              Salvar
            </Button>
          </DialogClose>
        </DialogFooter>
      </div>
    </DialogContent>
  );
}
