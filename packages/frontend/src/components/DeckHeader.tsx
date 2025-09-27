import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Dialog, DialogTitle, DialogTrigger, DialogHeader, DialogContent, DialogClose, DialogFooter } from "@/components/ui/dialog";

export function DeckHeader({ deckId }) {
  return (
    <div className="flex flex-row justify-between">
      <div className="m-1.5">
        <h1 className="text-3xl font-bold">ライブラリアウト</h1>
        <div className="mx-1 flex flex-row gap-2">
          <Badge>モダン</Badge>
          <Badge variant="secondary">公開</Badge>
        </div>
      </div>
      
      <Dialog>
        <DialogTrigger>
          <Button className="ph-bold ph-gear" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>デッキ設定</DialogTitle>
          </DialogHeader>

          <div className="grid items-center gap-1.5">
            <Label htmlFor="name">デッキ名</Label>
            <Input id="name" type="text" className="w-48"/>
          </div>

          <div className="grid items-center gap-1.5">
            <Label htmlFor="format">フォーマット</Label>
            <Select defaultValue="standard">
              <SelectTrigger>
                <SelectValue id="format" placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">スタンダード</SelectItem>
                <SelectItem value="pioneer">パイオニア</SelectItem>
                <SelectItem value="modern">モダン</SelectItem>
                <SelectItem value="legacy">レガシー</SelectItem>
                <SelectItem value="vintage">ヴィンテージ</SelectItem>
                <SelectItem value="pauper">パウパー</SelectItem>
                <SelectItem value="commander">統率者</SelectItem>
                <SelectItem value="oathbreaker">オースブレイカー</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid items-center gap-1.5">
            <Label htmlFor="publicity">公開状況</Label>
            <Select defaultValue="public">
              <SelectTrigger>
                <SelectValue id="publicity" placeholder="公開" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">公開</SelectItem>
                <SelectItem value="limited">限定公開</SelectItem>
                <SelectItem value="private">非公開</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">閉じる</Button>
            </DialogClose>
            <Button>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
