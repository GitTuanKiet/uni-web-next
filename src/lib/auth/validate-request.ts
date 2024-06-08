import { cache } from "react";
import { cookies } from "next/headers";
import type { Session, User } from "lucia";
import { lucia } from "@/lib/auth";

export const uncachedValidateRequest = async (): Promise<
  { user: User | null; session: Session | null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return { user: null, session: null };
  }
  const { user, session } = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    } else if (session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {
    // ignore
    console.log("Error setting session cookie", session);
  }
  return { user, session };
};

export const validateRequest = cache(uncachedValidateRequest);