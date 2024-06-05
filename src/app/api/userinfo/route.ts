import { validateRequest } from "@lib/auth/validate-request";

export async function GET(): Promise<Response> {
  const { user } = await validateRequest();
  if (!user) {
    return new Response(null, { status: 401 });
  }
  
  return new Response(JSON.stringify(user), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}