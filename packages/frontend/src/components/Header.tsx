import * as z from "zod";

import type { AppType } from "@grimore/backend";
import { hc } from "hono/client";

import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Schema } from "@grimore/shared";

const formSchema = z.object({
  name: z.string().nonempty(),
  format: Schema.Format,
  status: Schema.Status,
});

export function Header() {
  const navigate = useNavigate();

  const form = useForm({
    validators: {
      onChange: formSchema,
    },
    defaultValues: {
      name: "",
      format: Schema.Format.parse("standard"),
      status: Schema.Status.parse("public"),
    },
    onSubmit: async ({ value }) => {
      mutate({ name: value.name, format: value.format, status: value.status });
    }
  });

  const { mutate } = useMutation({
    mutationFn: async ({ name, format, status }: z.infer<typeof formSchema>) => {
      const client = hc<AppType>("/");
      const res = await client.api.deck.$post({
        json: {
          name,
          format,
          status,
        }
      });

      if (!res.ok) {
        throw new Error("API Error");
      }

      const { id } = await res.json();
      return id;
    },
    onSuccess: (id) => {
      console.log(id)
      navigate({
        to: "/deck/$deckId",
        params: { deckId: id }
      })
    }
  });

  return (
    <>
      <div className="p-2 flex justify-between">
        <NavigationMenu viewport={false}>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/" className="text-2xl font-bold">Grimore</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>

        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <SignedIn>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/deck" className="text-base">Decks</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>新規作成</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>新規作成</DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}>
                      <div className="grid gap-4">
                        <div className="grid gap-3">
                          <form.Field
                            name="name"
                            validators={{
                              onChange: z.string().nonempty(),
                            }}
                            children={(field) => {
                              return (
                                <>
                                  <Label htmlFor="name">名前</Label>
                                  <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    placeholder="赤単"
                                    onChange={(e) => field.handleChange(e.target.value)}
                                  />
                                </>
                              )
                            }}
                          />
                        </div>

                        <div className="grid items-center gap-1.5">
                          <form.Field
                            name="format"
                            validators={{
                              onChange: Schema.Format
                            }}
                            children={(field) => {
                              return (
                                <>
                                  <Label htmlFor="format">フォーマット</Label>
                                  <Select
                                    name={field.name}
                                    value={field.state.value}
                                    onValueChange={(value) => field.handleChange(Schema.Format.parse(value))}
                                  >
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
                                </>
                              )
                            }}
                          />
                        </div>

                        <div className="grid items-center gap-1.5">
                          <form.Field
                            name="status"
                            children={(field) => {
                              return (
                                <>

                                  <Label htmlFor="status">公開状況</Label>
                                  <Select
                                    name={field.name}
                                    value={field.state.value}
                                    onValueChange={(value) => field.handleChange(Schema.Status.parse(value))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue id="status" placeholder="公開" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="public">公開</SelectItem>
                                      <SelectItem value="limited">限定公開</SelectItem>
                                      <SelectItem value="private">非公開</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </>
                              )
                            }}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">閉じる</Button>
                        </DialogClose>

                        <form.Subscribe
                          selector={(state) => [state.canSubmit, state.isSubmitting]}
                          children={([canSubmit, isSubmitting]) => (
                            <Button type="submit" disabled={!canSubmit}>作成</Button>
                          )}
                        />
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </NavigationMenuItem>
            </SignedIn>

            <NavigationMenuItem>
              <SignedOut>
                <SignInButton>
                  <Button className="ph-bold ph-sign-in" />
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Separator />
    </>
  )
}
