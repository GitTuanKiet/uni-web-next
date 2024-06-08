import { cookies } from "next/headers";
import { generateId } from "lucia";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { discord, lucia } from "@/lib/auth";
import { db } from "@drizzle/db";
import { Paths } from "@/lib/constants";
import { users, accounts, profiles, customers } from "@drizzle/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("discord_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
      headers: { Location: Paths.Login },
    });
  }

  try {
    const tokens = await discord.validateAuthorizationCode(code);

    const discordUserRes = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const discordUser = (await discordUserRes.json()) as DiscordUser;

    if (!discordUser.email || !discordUser.verified) {
      return new Response(
        JSON.stringify({
          error: "Your Discord account must have a verified email address.",
        }),
        { status: 400, headers: { Location: Paths.Login } },
      );
    }

    const existingAccount = await db.query.accounts.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.providerId, "discord"), eq(table.providerAccountId, discordUser.id)),
    });

    const existingProfile = await db.query.profiles.findFirst({
      where: (table, { eq }) => eq(table.email, discordUser.email!),
    });

    const avatar = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.webp`
      : null;

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
          userId,
          providerId: "discord",
          providerAccountId: discordUser.id,
        });
        let promise_customer, promise_profile, promise_user;
        if (existingProfile) {
          promise_customer = Promise.resolve();
          promise_profile = tx
            .update(profiles)
            .set({
              name: discordUser.username,
              email: discordUser.email,
              image: avatar,
            })
            .where(eq(profiles.userId, userId));

          promise_user = tx
            .update(users)
            .set({
              email: discordUser.email!,
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
            name: discordUser.username,
            email: discordUser.email,
            image: avatar,
          });
          promise_user = tx.insert(users).values({
            id: userId,
            email: discordUser.email!,
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
    // Update the user's profile if the user's Discord profile has changed
    //=======================================================================================================
    if (
      existingProfile?.image !== avatar ||
      existingProfile.name !== discordUser.username ||
      existingProfile.email !== discordUser.email
    ) {
      await db.transaction(async (tx) => {
        const promise_update_profile = tx
          .update(profiles)
          .set({
            name: discordUser.username,
            email: discordUser.email!,
            image: avatar,
          })
          .where(eq(profiles.userId, existingAccount.userId));
        const promise_update_user = tx
          .update(users)
          .set({
            email: discordUser.email!,
            emailVerified: true,
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
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(JSON.stringify({ message: "Invalid code" }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ message: "internal server error" }), {
      status: 500,
    });
  }
}

interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  banner: string | null;
  global_name: string | null;
  banner_color: string | null;
  mfa_enabled: boolean;
  locale: string;
  email: string | null;
  verified: boolean;
}
