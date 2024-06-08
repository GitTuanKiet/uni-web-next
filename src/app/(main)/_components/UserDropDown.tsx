"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  Button, LoadingButton, Avatar, AvatarImage, ExclamationTriangleIcon,
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components";
import { logout } from "@/lib/auth/actions";
import { Info_App, Paths } from "@/lib/constants";
import { toast } from "@/hooks/use_toast";

export const UserDropdown = ({
  email,
  avatar,
  className,
}: {
  email: string;
  avatar?: string | null;
  className?: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <Avatar className="block h-8 w-8 rounded-full leading-none">
            <AvatarImage
              src={avatar ?? "https://source.boringavatars.com/marble/60/" + email}
              alt="Avatar"
            />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-muted-foreground">{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer text-muted-foreground" asChild>
            <Link href={Paths.Dashboard}>Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-muted-foreground" asChild>
            <Link href={Paths.Billing}>Billing</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-muted-foreground" asChild>
            <Link href={Paths.Settings}>Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="p-0">
          <SignoutConfirmation />
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SignoutConfirmation = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          icon: <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />,
          title: error.message,
        });
      }
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className="px-2 py-1.5 text-sm text-muted-foreground outline-none"
        asChild
      >
        <button>Sign out</button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xs">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Sign out from {Info_App.title}?</AlertDialogTitle>
          <AlertDialogDescription>You will be redirected to the home page.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <LoadingButton loading={isLoading} onClick={handleSignout}>
            Continue
          </LoadingButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
