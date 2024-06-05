import Link from "next/link";
import { RocketIcon } from "@lib/components/icons";
import { Button } from "@lib/components/ui/button";
import { ThemeToggle } from "@lib/components/layout/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@lib/components/ui/dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { UserDropdown } from "@/app/(main)/_components/user-dropdown";
import { validateRequest } from "@lib/auth/validate-request";
import { routes, Info_App } from "@lib/constants";

export const Header = async () => {
  const { user } = await validateRequest();

  return (
    <header className="p-0 lg:py-2 sticky top-0 z-10 border-b bg-background/80">
      <div className="container flex items-center gap-2 p-0 lg:px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="focus:outline-none focus:ring-1 md:hidden"
              size="icon"
              variant="outline"
            >
              <HamburgerMenuIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <div className="py-1">
              {routes.map(({ name, href }) => (
                <DropdownMenuItem key={name} asChild>
                  <Link className="flex items-center justify-center text-xl font-medium" href={href}>{name}</Link>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link className="flex items-center justify-center text-xl font-medium" href="/">
          <RocketIcon className="mr-2 h-5 w-5" /> {Info_App.title}
        </Link>
        <nav className="ml-10 hidden gap-4 sm:gap-6 md:flex">
          {routes.map(({ name, href }) => (
            <Link
              key={name}
              className="text-sm font-medium text-muted-foreground/70 transition-colors hover:text-muted-foreground"
              href={href}
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex justify-center space-x-1">
          {user ? <UserDropdown email={user.email} avatar={user.avatar} className="ml-auto" /> :
            <Button asChild variant={"secondary"}>
              <Link href="/login">Login</Link>
            </Button>}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
