import type { IncomingMessage, ServerResponse } from "node:http"
import { handleGeminiChat } from "../server/gemini"

export default async function chatHandler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
) {
  return handleGeminiChat(req, res, {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL,
  })
}
