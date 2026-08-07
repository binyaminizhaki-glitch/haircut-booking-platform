import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BookServicePage from './pages/BookServicePage'
import BookLocationPage from './pages/BookLocationPage'
import BookStylePage from './pages/BookStylePage'
import BookMatchesPage from './pages/BookMatchesPage'
import BookSummaryPage from './pages/BookSummaryPage'
import LiveBookingPage from './pages/LiveBookingPage'
import BookingCompletePage from './pages/BookingCompletePage'
import BarberProfilePage from './pages/BarberProfilePage'
import CustomerApp from './pages/CustomerApp'
import BarberDashboard from './pages/BarberDashboard'
import BarberOnboarding from './pages/BarberOnboarding'
import AdminDashboard from './pages/AdminDashboard'
import DemoPage from './pages/DemoPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />

        {/* Booking flow */}
        <Route path="/book/service" element={<BookServicePage />} />
        <Route path="/book/location" element={<BookLocationPage />} />
        <Route path="/book/style" element={<BookStylePage />} />
        <Route path="/book/matches" element={<BookMatchesPage />} />
        <Route path="/book/summary" element={<BookSummaryPage />} />

        {/* Barber profiles */}
        <Route path="/barbers/:id" element={<BarberProfilePage />} />

        {/* Live booking */}
        <Route path="/booking/:id" element={<LiveBookingPage />} />
        <Route path="/booking/:id/complete" element={<BookingCompletePage />} />

        {/* Customer app */}
        <Route path="/app/*" element={<CustomerApp />} />

        {/* Barber */}
        <Route path="/barber/onboarding" element={<BarberOnboarding />} />
        <Route path="/barber/*" element={<BarberDashboard />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
