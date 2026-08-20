import { LayoutGrid } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export default function DemoModeNav() {
  const { pathname } = useLocation()
  const isDemoExperience =
    pathname.startsWith("/app") ||
    pathname.startsWith("/barber") ||
    pathname.startsWith("/admin")

  if (!isDemoExperience || pathname === "/barber/onboarding") return null

  const hasBottomNav = pathname.startsWith("/app") || pathname.startsWith("/barber")

  return (
    <Link
      to="/demo"
      className={`fixed left-3 z-40 inline-flex min-h-10 items-center gap-2 rounded-full bg-brand px-3.5 py-2 text-xs font-bold text-white shadow-md transition-transform duration-150 hover:-translate-y-0.5 ${
        hasBottomNav ? "bottom-[calc(5.25rem+env(safe-area-inset-bottom))]" : "bottom-[calc(1rem+env(safe-area-inset-bottom))]"
      }`}
      aria-label="חזרה לבחירת תצוגת דמו"
    >
      <LayoutGrid className="size-4" aria-hidden="true" />
      החלף תצוגה
    </Link>
  )
}
