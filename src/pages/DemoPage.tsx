import type { LucideIcon } from "lucide-react"
import {
  ArrowLeft,
  BarChart3,
  Check,
  ChevronLeft,
  Clock3,
  Scissors,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import Logo from "../components/Logo"
import { BARBER_HERO } from "../data/mockData"
import { store, type DemoRole } from "../data/store"

type RoleOption = {
  role: Exclude<DemoRole, null>
  title: string
  subtitle: string
  description: string
  path: string
  icon: LucideIcon
  highlights: string[]
}

const roles: RoleOption[] = [
  {
    role: "customer",
    title: "חוויית הלקוח",
    subtitle: "בנימין · ירושלים",
    description: "הזמנה, התאמת ספר, מעקב בזמן אמת והקאט השמור.",
    path: "/app",
    icon: UserRound,
    highlights: ["הזמנה מיידית", "מעקב חי"],
  },
  {
    role: "barber",
    title: "אפליקציית הספר",
    subtitle: "עידו לוי · רחביה",
    description: "בקשות עבודה, ניהול זמינות, לוח זמנים והכנסות.",
    path: "/barber",
    icon: Scissors,
    highlights: ["עבודה חדשה", "ניהול יום"],
  },
  {
    role: "admin",
    title: "מרכז השליטה",
    subtitle: "תפעול CUTNOW",
    description: "תמונת מצב חיה של הזמנות, ספרים, תמחור והתראות.",
    path: "/admin",
    icon: BarChart3,
    highlights: ["נתונים חיים", "בקרת איכות"],
  },
]

export default function DemoPage() {
  const navigate = useNavigate()

  const enter = ({ role, path }: RoleOption) => {
    store.setRole(role)
    navigate(path)
  }

  return (
    <main className="min-h-dvh bg-background" dir="rtl">
      <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
        <section className="flex items-center px-5 py-8 sm:px-10 lg:px-16 lg:py-12">
          <div className="mx-auto w-full max-w-[670px]">
            <div className="mb-10 flex items-center justify-between gap-4">
              <Logo size="md" />
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-ink-secondary transition-colors duration-150 hover:bg-surface hover:text-ink"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                חזרה לאתר
              </button>
            </div>

            <div className="mb-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-success">
                <span className="size-2 rounded-full bg-lime" aria-hidden="true" />
                סביבת הדמו מוכנה
              </div>
              <h1 className="max-w-xl text-balance text-4xl font-black leading-tight text-ink sm:text-5xl">
                בחרו נקודת מבט והיכנסו למוצר
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-ink-secondary sm:text-lg">
                שלוש חוויות מחוברות שמציגות את המסע המלא — מהזמנת התספורת ועד לניהול הפעילות בזמן אמת.
              </p>
            </div>

            <div className="grid gap-3">
              {roles.map((option) => {
                const Icon = option.icon

                return (
                  <button
                    key={option.role}
                    type="button"
                    onClick={() => enter(option)}
                    className="group w-full rounded-2xl border border-border bg-surface p-4 text-right shadow-sm transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-brand focus-visible:border-brand sm:p-5"
                  >
                    <span className="flex items-center gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand sm:size-14">
                        <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-lg font-bold text-ink">{option.title}</span>
                          <span className="text-xs font-medium text-ink-muted">{option.subtitle}</span>
                        </span>
                        <span className="mt-1 block text-pretty text-sm leading-6 text-ink-secondary">
                          {option.description}
                        </span>
                        <span className="mt-2 flex flex-wrap gap-2">
                          {option.highlights.map((highlight) => (
                            <span key={highlight} className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted">
                              <Check className="size-3 text-success" aria-hidden="true" />
                              {highlight}
                            </span>
                          ))}
                        </span>
                      </span>

                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-brand transition-colors duration-150 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                        <ChevronLeft className="size-4" aria-hidden="true" />
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-success" aria-hidden="true" />
                מידע לדוגמה בלבד
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-4 text-success" aria-hidden="true" />
                כל הזרימות פעילות
              </span>
            </div>
          </div>
        </section>

        <aside className="relative hidden min-h-dvh overflow-hidden bg-dark lg:block" aria-label="תצוגה מקדימה של השירות">
          <img
            src={BARBER_HERO}
            alt="ספר CUTNOW מתכונן לשירות בבית הלקוח"
            className="absolute inset-0 size-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-dark/45" />

          <div className="relative z-10 flex min-h-dvh flex-col justify-between p-12 text-surface">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/25 bg-dark/55 px-3 py-1.5 text-xs font-semibold">
                CUTNOW LIVE DEMO
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-medium text-white/80">
                <span className="size-2 rounded-full bg-lime" />
                ירושלים · פעיל עכשיו
              </span>
            </div>

            <div className="max-w-lg">
              <p className="text-pretty text-3xl font-black leading-tight sm:text-4xl">
                ספר מקצועי שמגיע אליך. מחיר וזמן ידועים מראש.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/20 pt-6">
                {[
                  ["38 דק׳", "זמן הגעה"],
                  ["4.9", "דירוג ממוצע"],
                  ["179 ₪", "מחיר סופי"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <div className="tabular-nums text-2xl font-black text-lime">{value}</div>
                    <div className="mt-1 text-xs text-white/70">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
