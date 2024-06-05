import { validateRequest } from "@/lib/api-key/validate-request";
import type { NextRequest } from "next/server";
import { db } from "@drizzle/db";
import { apiKeys, usageLogs } from "@drizzle/db/schema";
import { proxies } from "@lib/constants";

function mapPathToProxy(path: string) {
  const pathParts = path.split("/").filter(Boolean);

  if (pathParts.length) {
    const proxy = proxies.find((proxy) => proxy.path === pathParts[0]);

    if (proxy) {
      return `${proxy.target}/${pathParts.slice(1).join("/")}`
    }
  }

  return null;
}

function stripContentEncoding(result: Response) {
  const responseHeaders = new Headers(result.headers)
  responseHeaders.delete("content-encoding")

  return new Response(result.body, {
    status: result.status,
    statusText: result.statusText,
    headers: responseHeaders,
  })
}

async function handler(request: NextRequest) {
  const { result } = await validateRequest();
  if (!result) {
    return new Response("Internal Server Error", { status: 500 });
  }
  if (typeof result === "string") {
    if (result === "No API key provided") {
      return new Response(result, { status: 400 });
    }
    return new Response(result, { status: 401 });
  }

  const headers = new Headers(request.headers);
  const req_clone = request.clone();

  const proxyUrl = mapPathToProxy(request.nextUrl.pathname);
  if (!proxyUrl) {
    return new Response("Not Found", { status: 404 })
  }
  const backendUrl = new URL(proxyUrl+request.nextUrl.search);
  const requestInit = {
    method: request.method,
    headers,
    body: request.body,
    duplex: "half",
  } as RequestInit;
  const response = await fetch(backendUrl, requestInit);
  console.log("🚀 ~ handler ~ response:", response)
  const res_clone = response.clone();

  await db.transaction(async (tx) => {
    await Promise.all([
      tx.insert(usageLogs).values({
        apiKey: result.secretKey,
        userId: result.userId,
        method: req_clone.method,
        path: request.nextUrl.pathname,
        query: request.nextUrl.search,
        body: await req_clone.text(),
        response: await res_clone.text(),
        status: res_clone.status.toString(),
      }),
      tx.update(apiKeys).set({
        lastUsedAt: new Date()
      })
    ])
  })

  return stripContentEncoding(response)
}

export const dynamic = "force-dynamic"

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }