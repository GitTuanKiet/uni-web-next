"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { 
  Label, Input, Button, Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  DiscordLogoIcon,
  GoogleLogoIcon,
  PasswordInput,
  SubmitButton
} from "@/components";
import LogoIcon from "@/app/logo";
import { Paths } from "@/lib/constants";
import { login } from "@/lib/auth/actions";

export function Login() {
  const [state, formAction] = useFormState(login, null);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="justify-center items-center">
        <CardTitle><LogoIcon className="h-32 w-40"/></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`${Paths.Login}/google`}>
              <GoogleLogoIcon className="mr-2 h-5 w-5" />
              Log in with Google
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`${Paths.Login}/discord`}>
              <DiscordLogoIcon className="mr-2 h-5 w-5" />
              Log in with Discord
            </Link>
          </Button>
        </div>
        <div className="my-2 flex items-center">
          <div className="flex-grow border-t border-muted" />
          <div className="mx-2 text-muted-foreground">or</div>
          <div className="flex-grow border-t border-muted" />
        </div>
        <form action={formAction} className="grid gap-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              required
              placeholder="email@example.com"
              autoComplete="email"
              name="email"
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <PasswordInput
              name="password"
              required
              autoComplete="current-password"
              placeholder="********"
            />
          </div>

          <div className="flex flex-wrap justify-between">
            <Button variant={"link"} size={"sm"} className="p-0" asChild>
              <Link href={Paths.Signup}>Not signed up? Sign up now.</Link>
            </Button>
            <Button variant={"link"} size={"sm"} className="p-0" asChild>
              <Link href={Paths.ResetPassword}>Forgot password?</Link>
            </Button>
          </div>

          {state?.fieldError ? (
            <ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {Object.values(state.fieldError).map((err) => (
                <li className="ml-4" key={err}>
                  {err}
                </li>
              ))}
            </ul>
          ) : state?.formError ? (
            <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {state?.formError}
            </p>
          ) : null}
          <SubmitButton className="w-full">Log In</SubmitButton>
          <Button variant="outline" className="w-full" asChild>
            <Link href={'/'}>Cancel</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
