import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Dialog, DialogTitle, DialogTrigger, DialogHeader, DialogContent, DialogClose, DialogFooter } from "@/components/ui/dialog";

import { useDebouncedCallback } from 'use-debounce';

import { buildScryfallQuery, extractImageUris } from '@/lib/utils';
import { useState } from 'react';
import { QUERYKEYS } from '@/lib/types';

export function Search({ deckId }) {
  const [ name, setName ] = useState<string>("");
  const [ query, setQuery ] = useState<string>("");

  const { isPending, isSuccess, isError, data, refetch } = useQuery({
    queryKey: [QUERYKEYS.scryfall, query],
    queryFn: async () => {
      const res = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}+lang=ja`);
      if (!res.ok) {
        throw new Error("Network Error");
      }

      const data = await res.json();
      if (data.object === "error") {
        throw new Error(`${data.details}`);
      }

      return data
    }
  });

  const debouncedRefetch = useDebouncedCallback(
    () => {
      setQuery(buildScryfallQuery({ name }));
      refetch();
    },
    300
  );

  return (
    <>
      <div className="flex gap-2 items-end">
        <div className="grid items-center gap-1.5">
          <Label htmlFor="name">Search</Label>
          <Input id="name" type="search" placeholder="稲妻" className="w-48" value={name} onChange={(e) => { setName(e.target.value); debouncedRefetch()} } />
        </div>

        <div className="grid items-center gap-1.5">
          <Label htmlFor="board">For</Label>
          <Select defaultValue="mainboard">
            <SelectTrigger>
              <SelectValue placeholder="Board" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mainboard">メインボード</SelectItem>
              <SelectItem value="sideboard">サイドボード</SelectItem>
              <SelectItem value="considering">検討中</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog>
          <DialogTrigger>
            <Button className="ph-bold ph-sliders-horizontal" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>検索オプション</DialogTitle>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">閉じる</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {isPending && <Skeleton className="w-full h-36" />}
      {isError && <div className="h-36 w-full flex justify-center items-center" >
        <p className="text-xl">Not Found</p>
      </div>}
      {(isSuccess) && <div className="flex flex-row h-36 gap-4 overflow-x-scroll">
        {data.data.map((card) => <img src={extractImageUris(card)}/>)}
      </div>}
    </>
  )
}
