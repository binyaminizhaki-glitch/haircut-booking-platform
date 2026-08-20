// Demo state store using localStorage + BroadcastChannel for cross-tab sync
import type { Booking, BookingStatus } from './types'
import { mockBookings } from './mockData'

const BOOKINGS_KEY = 'cutnow_bookings'
const ROLE_KEY = 'cutnow_role'
const CHANNEL = 'cutnow_sync'

let bc: BroadcastChannel | null = null
try { bc = new BroadcastChannel(CHANNEL) } catch { /* safari private */ }
const localListeners = new Set<() => void>()

export type DemoRole = 'customer' | 'barber' | 'admin' | null

function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY)
    return raw ? JSON.parse(raw) : mockBookings
  } catch {
    return mockBookings
  }
}

function saveBookings(bookings: Booking[]) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
  localListeners.forEach(listener => listener())
  bc?.postMessage({ type: 'bookings_updated' })
}

export const store = {
  getRole(): DemoRole {
    return (localStorage.getItem(ROLE_KEY) as DemoRole) || null
  },
  setRole(role: DemoRole) {
    if (role) localStorage.setItem(ROLE_KEY, role)
    else localStorage.removeItem(ROLE_KEY)
  },
  getBookings(): Booking[] {
    return loadBookings()
  },
  getBooking(id: string): Booking | undefined {
    return loadBookings().find(b => b.id === id)
  },
  createBooking(booking: Booking): Booking {
    const bookings = loadBookings()
    bookings.unshift(booking)
    saveBookings(bookings)
    return booking
  },
  updateBookingStatus(id: string, status: BookingStatus) {
    const bookings = loadBookings()
    const idx = bookings.findIndex(b => b.id === id)
    if (idx >= 0) {
      bookings[idx] = { ...bookings[idx], status }
      saveBookings(bookings)
    }
  },
  updateBooking(id: string, patch: Partial<Booking>) {
    const bookings = loadBookings()
    const idx = bookings.findIndex(b => b.id === id)
    if (idx >= 0) {
      bookings[idx] = { ...bookings[idx], ...patch }
      saveBookings(bookings)
    }
  },
  onSync(callback: () => void): () => void {
    const handler = () => callback()
    localListeners.add(callback)
    bc?.addEventListener('message', handler)
    window.addEventListener('storage', handler)
    return () => {
      localListeners.delete(callback)
      bc?.removeEventListener('message', handler)
      window.removeEventListener('storage', handler)
    }
  },
  generateId(): string {
    return 'bk_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  },
}
