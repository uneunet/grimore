import { Link } from "@tanstack/react-router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <>
      <div className="p-2 flex justify-between">
        <NavigationMenu viewport={false}>
          <NavigationMenuItem>
            <NavigationMenuLink>
              <Link to="/" className="text-2xl font-bold">Grimore</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>

        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink>
                <Link to="/" className="text-base">Decks</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink>
                <Link to="/" className="text-base">Profile</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Separator />
    </>
  )
}
