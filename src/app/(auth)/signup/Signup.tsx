"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { Info_App, Paths } from "@/lib/constants";
import { signup } from "@/lib/auth/actions";
import {
  Button, Input, Label,
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  PasswordInput, SubmitButton 
} from "@/components";
import LogoIcon from "@/app/logo";

export function Signup() {
  const [state, formAction] = useFormState(signup, null);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="justify-center items-center">
        <CardTitle><LogoIcon className="h-20 w-32"/></CardTitle>
        <CardDescription>Sign up for {Info_App.title} to get started</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <div className="my-2 flex items-center">
          <div className="flex-grow border-t border-muted" />
          <div className="mx-2 text-muted-foreground">or</div>
          <div className="flex-grow border-t border-muted" />
        </div>  */}

        <form action={formAction} className="space-y-4">
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
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <PasswordInput
              name="confirmPassword"
              required
              autoComplete="current-password"
              placeholder="********"
            />
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
          <div>
            <Link href={Paths.Login}>
              <span className="p-0 text-xs font-medium underline-offset-4 hover:underline">
                Already signed up? Login instead.
              </span>
            </Link>
          </div>

          <SubmitButton className="w-full"> Sign Up</SubmitButton>
          <Button variant="outline" className="w-full" asChild>
            <Link href={Paths.Home}>Cancel</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
