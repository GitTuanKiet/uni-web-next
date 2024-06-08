import { cookies } from "next/headers";
import { generateId } from "lucia";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { google, lucia } from "@/lib/auth";
import { db } from "@drizzle/db";
import { Paths } from "@/lib/constants";
import { users, accounts, profiles, customers } from "@drizzle/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookies().get("google_oauth_code_verifier")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
    return new Response(null, {
      status: 400,
      headers: { Location: Paths.Login },
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    // const googleUserRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    //   headers: {
    //     Authorization: `Bearer ${tokens.accessToken}`,
    //   },
    // });
    const googleUserRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const googleUser = (await googleUserRes.json()) as GoogleUser;

    if (!googleUser.email_verified) {
      return new Response(
        JSON.stringify({
          error: "Your Google account must have a verified email address.",
        }),
        { status: 400, headers: { Location: Paths.Login } },
      );
    }

    const existingAccount = await db.query.accounts.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.providerId, "google"), eq(table.providerAccountId, googleUser.sub)),
    });

    const existingProfile = await db.query.profiles.findFirst({
      where: (table, { eq }) => eq(table.email, googleUser.email),
    });

    const avatar = googleUser.picture ?? null;

    //=======================================================================================================
    // Create a new user if the user does not exist
    //=======================================================================================================
    if (!existingAccount) {
      let userId = generateId(21);
      const accountId = generateId(21);
      const profileId = generateId(21);
      const customerId = generateId(21);

      if (existingProfile) {
        userId = existingProfile.userId;
      }

      await db.transaction(async (tx) => {
        const promise_account = tx.insert(accounts).values({
          id: accountId,
          providerId: "google",
          providerAccountId: googleUser.sub,
          userId,
        });
        let promise_customer, promise_profile, promise_user;
        if (existingProfile) {
          promise_customer = Promise.resolve();
          promise_profile = tx
            .update(profiles)
            .set({
              name: googleUser.name,
              email: googleUser.email,
              image: avatar,
            })
            .where(eq(profiles.userId, userId));

          promise_user = tx
            .update(users)
            .set({
              email: googleUser.email,
              avatar,
            })
            .where(eq(users.id, userId));
        } else {
          promise_customer = tx.insert(customers).values({
            id: customerId,
            userId,
          });
          promise_profile = tx.insert(profiles).values({
            id: profileId,
            userId,
            name: googleUser.name,
            email: googleUser.email,
            image: avatar,
          });
          promise_user = tx.insert(users).values({
            id: userId,
            email: googleUser.email,
            emailVerified: true,
            avatar,
          });
        }
        await promise_user;
        await Promise.all([promise_account, promise_profile, promise_customer]);
      });

      //=======================================================================================================
      // Create a new session
      //=======================================================================================================
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return new Response(null, {
        status: 302,
        headers: { Location: Paths.Dashboard },
      });
    }

    //=======================================================================================================
    // Update the user's profile if the user's Google profile has changed
    //=======================================================================================================
    if (
      existingProfile?.image !== avatar ||
      existingProfile.name !== googleUser.name ||
      existingProfile.email !== googleUser.email
    ) {
      await db.transaction(async (tx) => {
        const promise_update_profile = tx
          .update(profiles)
          .set({
            name: googleUser.name,
            email: googleUser.email,
            image: avatar,
          })
          .where(eq(profiles.userId, existingAccount.userId));
        const promise_update_user = tx
          .update(users)
          .set({
            email: googleUser.email,
            avatar,
          })
          .where(eq(users.id, existingAccount.userId));
        await Promise.all([promise_update_profile, promise_update_user]);
      });
    }
    //=======================================================================================================
    // Create a new session
    //=======================================================================================================
    const session = await lucia.createSession(existingAccount.userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return new Response(null, {
      status: 302,
      headers: { Location: Paths.Dashboard },
    });
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
        headers: { Location: Paths.Login },
      });
    }
    throw error;
  }
}

interface GoogleUser {
  sub: string;
  name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}
