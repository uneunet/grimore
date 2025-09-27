import { Link } from "@tanstack/react-router";
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

export function Header() {
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
                  <Link to="/" className="text-base">Decks</Link>
                </NavigationMenuLink>
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
