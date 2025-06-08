import { Button } from "../ui/button";

interface CardGroup {
  name: string;
  joinRoom: (roomName: string) => void;
}

export default function CardGroup({ name, joinRoom }: CardGroup) {
  return (
    <div className="p-2 cursor-pointer">
      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-sm text-gray-500 truncate max-w-[160px]">
          Are we meeting today? Lets...
        </p>
        <Button onClick={() => joinRoom(name)} className="cursor-pointer" variant={"outline"}>Entrar</Button>
      </div>
    </div>
  );
}
