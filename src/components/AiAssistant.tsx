import {
  ArrowUp,
  MessageCircle,
  RotateCcw,
  Scissors,
  Sparkles,
  X,
} from "lucide-react"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  localOnly?: boolean
}

const STORAGE_KEY = "cutnow_ai_chat"

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "היי, אני העוזר של CUTNOW. אפשר לשאול אותי על תספורות, מחירים, הזמנה או מה קורה כשהספר בדרך.",
  localOnly: true,
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function promptsForPage(pathname: string) {
  if (pathname.startsWith("/booking/")) {
    return ["הספר מאחר — מה עושים?", "איך יוצרים קשר?", "מה קורה אם מבטלים?"]
  }

  if (pathname.startsWith("/book/")) {
    return ["איזה שירות מתאים לי?", "מה כולל המחיר?", "איך בוחרים ספר?"]
  }

  if (pathname === "/barber/onboarding") {
    return ["איך מצטרפים כספר?", "איזה אימות צריך?", "איך התהליך עובד?"]
  }

  if (pathname.startsWith("/app")) {
    return ["איך מזמינים שוב?", "מה זה קאט שמור?", "איפה רואים הזמנות?"]
  }

  return ["איך CUTNOW עובד?", "אפשר להזמין מראש?", "מה צריך להכין בבית?"]
}

export default function AiAssistant() {
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      const parsed = stored ? (JSON.parse(stored) as ChatMessage[]) : []
      return Array.isArray(parsed) && parsed.length ? parsed : [WELCOME_MESSAGE]
    } catch {
      return [WELCOME_MESSAGE]
    }
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const suggestions = useMemo(() => promptsForPage(pathname), [pathname])
  const hidden =
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/barber/") && pathname !== "/barber/onboarding")
  const aboveBottomNav = pathname.startsWith("/app")

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)))
  }, [messages])

  useEffect(() => {
    if (!isOpen) return

    inputRef.current?.focus()
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [isOpen, messages, isLoading])

  if (hidden) return null

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE])
    setInput("")
    inputRef.current?.focus()
  }

  const sendMessage = async (content: string) => {
    const cleanContent = content.trim().slice(0, 1_200)
    if (!cleanContent || isLoading) return

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: cleanContent,
    }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname,
          messages: nextMessages
            .filter((message) => !message.localOnly)
            .slice(-10)
            .map(({ role, content: messageContent }) => ({
              role,
              content: messageContent,
            })),
        }),
      })

      const data = (await response.json().catch(() => ({}))) as {
        reply?: string
        error?: string
      }

      if (!response.ok || !data.reply) {
        throw new Error(data.error || "לא הצלחנו לקבל תשובה כרגע.")
      }

      setMessages((current) => [
        ...current,
        { id: createId(), role: "assistant", content: data.reply! },
      ])
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "משהו השתבש. אפשר לנסות שוב בעוד רגע.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage(input)
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="סגירת העוזר"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[58] bg-[#211B1C]/35 backdrop-blur-[2px] md:hidden"
        />
      )}

      <section
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-label="העוזר החכם של CUTNOW"
        className={`fixed z-[60] overflow-hidden border border-[#D8D1C5] bg-[#FFFDF8] shadow-[0_28px_90px_rgba(33,27,28,0.28)] transition-all duration-300 ease-out md:bottom-24 md:right-6 md:h-[min(680px,calc(100dvh-7.5rem))] md:w-[390px] md:rounded-[24px] ${
          isOpen
            ? "inset-x-0 bottom-0 h-[min(720px,92dvh)] translate-y-0 rounded-t-[26px] opacity-100 md:inset-x-auto"
            : "pointer-events-none inset-x-3 bottom-4 h-[min(720px,92dvh)] translate-y-8 rounded-[26px] opacity-0 md:inset-x-auto md:translate-y-4"
        }`}
      >
        <div className="relative flex h-full flex-col">
          <header className="relative overflow-hidden bg-[#211B1C] px-5 pb-4 pt-5 text-[#FFFDF8]">
            <div
              className="pointer-events-none absolute -left-8 -top-12 size-36 rounded-full border border-[#C8F36A]/15"
              aria-hidden="true"
            />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative grid size-11 shrink-0 place-items-center rounded-[14px] bg-[#7A283D] shadow-inner">
                  <Scissors className="size-5 -rotate-45" aria-hidden="true" />
                  <span className="absolute -left-0.5 -top-0.5 size-3 rounded-full border-2 border-[#211B1C] bg-[#C8F36A]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[17px] font-black">CUTNOW AI</h2>
                    <span className="rounded-full bg-[#C8F36A]/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#C8F36A]">
                      עוזר אישי
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#D8D1C5]">
                    כאן לשאלות על הקאט וההזמנה
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={resetChat}
                  className="grid size-9 place-items-center rounded-full text-[#D8D1C5] transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="התחלת שיחה חדשה"
                  title="שיחה חדשה"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="grid size-9 place-items-center rounded-full text-[#D8D1C5] transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="סגירת העוזר"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </header>

          <div
            className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_20%_0%,rgba(200,243,106,0.12),transparent_30%),linear-gradient(#F3EEE5,#F7F2EA)] px-4 py-5"
            aria-live="polite"
          >
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[86%] whitespace-pre-wrap text-pretty px-4 py-3 text-[14px] leading-6 shadow-sm ${
                      message.role === "user"
                        ? "rounded-[18px_18px_6px_18px] bg-[#7A283D] text-white"
                        : "rounded-[18px_18px_18px_6px] border border-[#D8D1C5] bg-[#FFFDF8] text-[#181715]"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-end">
                  <div className="flex items-center gap-1 rounded-[18px_18px_18px_6px] border border-[#D8D1C5] bg-[#FFFDF8] px-4 py-3 shadow-sm">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="size-1.5 animate-bounce rounded-full bg-[#7A283D]"
                        style={{ animationDelay: `${dot * 120}ms` }}
                      />
                    ))}
                    <span className="sr-only">העוזר מקליד תשובה</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>

          <div className="border-t border-[#D8D1C5] bg-[#FFFDF8] px-4 pb-[calc(0.85rem+env(safe-area-inset-bottom))] pt-3">
            {messages.length <= 2 && (
              <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-0.5">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                    disabled={isLoading}
                    className="shrink-0 rounded-full border border-[#D8D1C5] bg-[#F3EEE5] px-3 py-1.5 text-[12px] font-semibold text-[#6D6860] transition-colors hover:border-[#7A283D] hover:text-[#7A283D] disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label htmlFor="cutnow-ai-input" className="sr-only">
                כתיבת שאלה לעוזר CUTNOW
              </label>
              <input
                ref={inputRef}
                id="cutnow-ai-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={1_200}
                disabled={isLoading}
                autoComplete="off"
                placeholder="מה תרצה לדעת?"
                className="h-12 min-w-0 flex-1 rounded-[14px] border border-[#D8D1C5] bg-[#F3EEE5] px-4 text-[14px] text-[#181715] placeholder:text-[#8C857B] focus:border-[#7A283D] focus:outline-none focus:ring-2 focus:ring-[#7A283D]/15 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-[#7A283D] text-white transition-all hover:-translate-y-0.5 hover:bg-[#5E1D2D] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#BDB4A7]"
                aria-label="שליחת השאלה"
              >
                <ArrowUp className="size-5" aria-hidden="true" />
              </button>
            </form>
            <p className="mt-2 text-center text-[10px] text-[#8C857B]">
              תשובות AI עשויות לטעות · המחיר הקובע מופיע באישור ההזמנה
            </p>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`group fixed right-4 z-[55] flex h-14 items-center gap-3 rounded-full bg-[#211B1C] p-2 text-[#FFFDF8] shadow-[0_14px_38px_rgba(33,27,28,0.28)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#2D2527] sm:pl-4 sm:pr-2.5 md:right-6 ${
          aboveBottomNav
            ? "bottom-[calc(5.4rem+env(safe-area-inset-bottom))]"
            : "bottom-[calc(1rem+env(safe-area-inset-bottom))]"
        } ${isOpen ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"}`}
        aria-expanded={isOpen}
        aria-label="פתיחת העוזר החכם של CUTNOW"
      >
        <span className="relative grid size-10 place-items-center rounded-full bg-[#7A283D]">
          <MessageCircle className="size-5" aria-hidden="true" />
          <Sparkles className="absolute -left-1 -top-1 size-4 text-[#C8F36A] transition-transform group-hover:rotate-12 group-hover:scale-110" />
        </span>
        <span className="hidden text-right leading-tight sm:block">
          <span className="block text-[12px] font-black">צריך עזרה?</span>
          <span className="block text-[10px] text-[#D8D1C5]">שאלו את CUTNOW AI</span>
        </span>
      </button>
    </>
  )
}
