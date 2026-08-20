import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AiAssistant from "./components/AiAssistant"
import DemoModeNav from "./components/DemoModeNav"

const HomePage = lazy(() => import("./pages/HomePage"))
const BookServicePage = lazy(() => import("./pages/BookServicePage"))
const BookLocationPage = lazy(() => import("./pages/BookLocationPage"))
const BookStylePage = lazy(() => import("./pages/BookStylePage"))
const BookMatchesPage = lazy(() => import("./pages/BookMatchesPage"))
const BookSummaryPage = lazy(() => import("./pages/BookSummaryPage"))
const LiveBookingPage = lazy(() => import("./pages/LiveBookingPage"))
const BookingCompletePage = lazy(() => import("./pages/BookingCompletePage"))
const BarberProfilePage = lazy(() => import("./pages/BarberProfilePage"))
const CustomerApp = lazy(() => import("./pages/CustomerApp"))
const BarberDashboard = lazy(() => import("./pages/BarberDashboard"))
const BarberOnboarding = lazy(() => import("./pages/BarberOnboarding"))
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"))
const DemoPage = lazy(() => import("./pages/DemoPage"))

function LoadingScreen() {
  return (
    <div
      className="flex min-h-dvh items-center justify-center bg-background px-6"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="mb-5 h-3 w-24 animate-pulse rounded-full bg-border" />
        <div className="mb-2 h-7 w-3/4 animate-pulse rounded-lg bg-border" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-border" />
        <span className="sr-only">טוען את CUTNOW...</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />

          <Route path="/book/service" element={<BookServicePage />} />
          <Route path="/book/location" element={<BookLocationPage />} />
          <Route path="/book/style" element={<BookStylePage />} />
          <Route path="/book/matches" element={<BookMatchesPage />} />
          <Route path="/book/summary" element={<BookSummaryPage />} />

          <Route path="/barbers/:id" element={<BarberProfilePage />} />

          <Route path="/booking/:id" element={<LiveBookingPage />} />
          <Route path="/booking/:id/complete" element={<BookingCompletePage />} />

          <Route path="/app/*" element={<CustomerApp />} />

          <Route path="/barber/onboarding" element={<BarberOnboarding />} />
          <Route path="/barber/*" element={<BarberDashboard />} />

          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/demo" replace />} />
        </Routes>
        <DemoModeNav />
        <AiAssistant />
      </Suspense>
    </BrowserRouter>
  )
}
