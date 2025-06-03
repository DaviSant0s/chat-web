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
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const createProductDialogSchema = z.object({
  name: z.string(),
  price: z.coerce.number(),
});

type CreateProductDialogSchema = z.infer<typeof createProductDialogSchema>;

export default function CreateProductDialog() {

  const { register, handleSubmit } = useForm<CreateProductDialogSchema>({
    resolver: zodResolver(createProductDialogSchema)
  });


  function handleCreateProduct(data: CreateProductDialogSchema) {
    console.log(data)
  }


  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo produto</DialogTitle>
        <DialogDescription>Criar um novo produto no sistema</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreateProduct)} className="space-y-6">
        <div className="grid grid-cols-4 items-center text-right gap-3">
          <Label className="flex justify-end" htmlFor="name">
            Produto
          </Label>
          <Input className="col-span-3" id="name" {...register('name')}/>
        </div>

        <div className="grid grid-cols-4 items-center text-right gap-3">
          <Label className="flex justify-end" htmlFor="price">
            Preço
          </Label>
          <Input className="col-span-3" id="price" {...register('price')}/>
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
