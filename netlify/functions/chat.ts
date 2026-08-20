import type { IncomingMessage, ServerResponse } from "node:http"
import { handleGeminiChat } from "../../server/gemini"

export default async function chat(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const requestHeaders = Object.fromEntries(request.headers.entries())
  const forwardedFor = request.headers.get("x-forwarded-for") || undefined
  const nodeRequest = {
    method: request.method,
    headers: requestHeaders,
    body,
    socket: { remoteAddress: forwardedFor?.split(",")[0]?.trim() },
  } as unknown as IncomingMessage & { body?: unknown }

  let statusCode = 200
  let responseBody = ""
  const responseHeaders = new Headers()
  const nodeResponse = {
    get statusCode() {
      return statusCode
    },
    set statusCode(value: number) {
      statusCode = value
    },
    setHeader(name: string, value: number | string | readonly string[]) {
      responseHeaders.set(name, Array.isArray(value) ? value.join(", ") : String(value))
      return this
    },
    end(chunk?: unknown) {
      responseBody = chunk === undefined ? "" : String(chunk)
      return this
    },
  } as unknown as ServerResponse

  await handleGeminiChat(nodeRequest, nodeResponse, {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL,
  })

  return new Response(responseBody, {
    status: statusCode,
    headers: responseHeaders,
  })
}
