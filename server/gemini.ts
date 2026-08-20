import type { IncomingMessage, ServerResponse } from "node:http"

type ChatRole = "user" | "assistant"

type ChatMessage = {
  role: ChatRole
  content: string
}

type ChatPayload = {
  messages?: unknown
  page?: unknown
}

type GeminiConfig = {
  apiKey?: string
  model?: string
}

type RequestWithBody = IncomingMessage & { body?: unknown }

const MAX_BODY_BYTES = 20_000
const MAX_MESSAGE_LENGTH = 1_200
const MAX_MESSAGES = 10
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 24

const requestsByIp = new Map<string, number[]>()

const SYSTEM_PROMPT = `אתה CUTNOW AI, העוזר הרשמי של פלטפורמת CUTNOW להזמנת ספר מקצועי שמגיע ללקוח.

אופי התשובות:
- ענה בעברית טבעית, חמה וישירה. אם המשתמש פונה בשפה אחרת, ענה באותה שפה.
- היה קצר ומעשי: בדרך כלל 2–5 משפטים. השתמש בנקודות רק כשזה באמת עוזר.
- לפני השליחה, בדוק בשקט שהעברית תקינה, שאין שגיאות כתיב ושהתשובה אינה חוזרת על עצמה.
- אתה מומחה למוצר CUTNOW, לא עוזר כללי. שאל שאלת הבהרה אחת רק כשבלעדיה אי אפשר לעזור.
- אל תמציא זמינות בזמן אמת, סטטוס הזמנה, זהות ספר, זמן הגעה או מחיר שלא מופיעים בידע למטה.
- לעולם אל תבקש פרטי אשראי, סיסמה, קוד אימות או מידע רפואי. אל תבקש כתובת מלאה בצ'אט; הפנה למסך ההזמנה.
- אין לך גישה לחשבון המשתמש או לנתוני הזמנה חיים. אם נשאלת על הזמנה ספציפית, הסבר היכן לבדוק באתר.
- בנושאי תספורת אפשר לתת המלצה כללית, אבל ציין שהספר יתאים את הבחירה בפועל לסוג השיער ולמבנה הפנים.

ידע מוצר מאומת:
- CUTNOW מחברת לקוחות לספרים מקצועיים שמגיעים לבית, למשרד, למלון או לאירוע ברחבי הארץ, לפי זמינות באזור.
- אפשר להזמין להגעה בהקדם או לבחור יום ושעה מראש.
- אפשר לבחור ספר ספציפי או לקבל שלוש התאמות לפי סגנון, סוג שיער, מיקום וזמינות.
- הספר מגיע עם ציוד, מוצרי טיפוח, משטח איסוף וערכת ניקוי. הלקוח מכין מקום ישיבה נוח ושקע חשמל קרוב.
- הכלים מחוטאים בין לקוחות, והספר מנקה את אזור העבודה בסיום.
- המחיר שמוצג לפני האישור כולל הגעה, ציוד וניקוי. תוספות מחויבות רק לאחר אישור מראש.
- התשלום נעשה באתר ומושלם לאחר סיום השירות. מדיניות הביטול המדויקת מוצגת במסך ההזמנה; ביטול מאוחר עשוי להיות כרוך בתשלום.
- אפשר לשמור פרופיל קאט עם סגנון, אורכים והעדפות ולשחזר אותו עם אותו ספר או ספר מאומת אחר.
- שירותי הקטלוג הנוכחי: תספורת מספריים 149 ₪ בהזמנה מראש או 179 ₪ במיידי; פייד 129/159 ₪; תספורת וזקן 189/219 ₪; סידור זקן 89/109 ₪; תספורת לילד עד גיל 12 במחיר 119/139 ₪; אב ובן 218/258 ₪; Group Cut לשלושה ומעלה באותה כתובת 109/129 ₪ למשתתף. המחיר הקובע תמיד הוא זה שמוצג במסך האישור.
- מסלול הזמנה: בחירת שירות, מיקום, סגנון והעדפות, בחירת התאמה, סיכום ואישור.
- לאחר הזמנה פעילה אפשר לעקוב במסך ההזמנה. אם הספר מאחר, אי אפשר ליצור קשר או יש בעיה, משתמשים בכפתור "דיווח על בעיה" במסך המעקב.
- ספרים שרוצים להצטרף משתמשים במסך "הצטרפות כספר" ועוברים אימות זהות ופרטים מקצועיים.

כאשר מתאים, כוון בעדינות לפעולה הבאה באתר, בלי לטעון שביצעת אותה בעצמך.`

function sendJson(res: ServerResponse, status: number, payload: Record<string, unknown>) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.setHeader("Cache-Control", "no-store")
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.end(JSON.stringify(payload))
}

function clientIp(req: IncomingMessage) {
  const forwarded = req.headers["x-forwarded-for"]
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded
  return value?.split(",")[0]?.trim() || req.socket.remoteAddress || "local"
}

function isRateLimited(req: IncomingMessage) {
  const ip = clientIp(req)
  const now = Date.now()
  const recent = (requestsByIp.get(ip) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  )

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestsByIp.set(ip, recent)
    return true
  }

  recent.push(now)
  requestsByIp.set(ip, recent)
  return false
}

async function readBody(req: RequestWithBody): Promise<unknown> {
  if (req.body !== undefined) return req.body

  return new Promise((resolve, reject) => {
    let raw = ""

    req.setEncoding("utf8")
    req.on("data", (chunk: string) => {
      raw += chunk
      if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
        reject(new Error("PAYLOAD_TOO_LARGE"))
        req.destroy()
      }
    })
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"))
      } catch {
        reject(new Error("INVALID_JSON"))
      }
    })
    req.on("error", reject)
  })
}

function sanitizePayload(payload: unknown) {
  if (!payload || typeof payload !== "object") return null

  const { messages, page } = payload as ChatPayload
  if (!Array.isArray(messages)) return null

  const sanitizedMessages = messages
    .slice(-MAX_MESSAGES)
    .filter(
      (message): message is ChatMessage =>
        Boolean(message) &&
        typeof message === "object" &&
        ((message as ChatMessage).role === "user" ||
          (message as ChatMessage).role === "assistant") &&
        typeof (message as ChatMessage).content === "string",
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((message) => message.content.length > 0)

  if (!sanitizedMessages.length || sanitizedMessages.at(-1)?.role !== "user") {
    return null
  }

  const safePage =
    typeof page === "string" && /^\/[a-z0-9/_-]*$/i.test(page)
      ? page.slice(0, 100)
      : "/"

  return { messages: sanitizedMessages, page: safePage }
}

function extractReply(data: unknown) {
  if (!data || typeof data !== "object") return ""

  const candidates = (data as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }).candidates

  return (
    candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim() || ""
  )
}

export async function handleGeminiChat(
  req: RequestWithBody,
  res: ServerResponse,
  config: GeminiConfig,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return sendJson(res, 405, { error: "השירות זמין בבקשת POST בלבד." })
  }

  if (!config.apiKey) {
    return sendJson(res, 503, {
      error: "העוזר עדיין לא הוגדר. נסו שוב בעוד כמה דקות.",
    })
  }

  if (isRateLimited(req)) {
    return sendJson(res, 429, {
      error: "שלחתם הרבה שאלות ברצף. חכו כמה דקות ונסו שוב.",
    })
  }

  try {
    const payload = sanitizePayload(await readBody(req))
    if (!payload) {
      return sendJson(res, 400, { error: "לא הצלחנו לקרוא את ההודעה." })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25_000)
    const model = config.model || "gemini-3.5-flash-lite"

    let response: Response
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": config.apiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\nהמשתמש נמצא כרגע במסלול באתר: ${payload.page}`,
                },
              ],
            },
            contents: payload.messages.map((message) => ({
              role: message.role === "assistant" ? "model" : "user",
              parts: [{ text: message.content }],
            })),
            generationConfig: {
              temperature: 0.35,
              topP: 0.9,
              maxOutputTokens: 500,
            },
          }),
          signal: controller.signal,
        },
      )
    } finally {
      clearTimeout(timeout)
    }

    const data = (await response.json().catch(() => null)) as unknown
    if (!response.ok) {
      const retryable = response.status === 429 || response.status >= 500
      return sendJson(res, retryable ? 503 : 502, {
        error: retryable
          ? "העוזר עמוס כרגע. נסו שוב בעוד רגע."
          : "לא הצלחנו לקבל תשובה כרגע.",
      })
    }

    const reply = extractReply(data)
    if (!reply) {
      return sendJson(res, 502, { error: "לא התקבלה תשובה. נסו לנסח מחדש." })
    }

    return sendJson(res, 200, { reply })
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError"
    return sendJson(res, isTimeout ? 504 : 500, {
      error: isTimeout
        ? "התשובה לוקחת יותר מדי זמן. נסו שוב."
        : "משהו השתבש בדרך. נסו שוב בעוד רגע.",
    })
  }
}
