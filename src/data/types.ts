export type BookingStatus =
  | 'requested'
  | 'matched'
  | 'accepted'
  | 'preparing'
  | 'travelling'
  | 'arrived'
  | 'in_progress'
  | 'cleaning'
  | 'completed'
  | 'cancelled'
  | 'replacement_required'

export interface Address {
  street: string
  number: string
  city: string
  floor?: string
  apartment?: string
  entrance?: string
  parking?: string
  notes?: string
  locationType: 'home' | 'office' | 'hotel' | 'other'
}

export interface User {
  id: string
  name: string
  phone: string
  email: string
  role: 'customer' | 'barber' | 'admin'
  savedAddresses: Address[]
}

export interface CutProfile {
  id: string
  customerId: string
  name: string
  sideLength: string
  fadeHeight: string
  topLength: string
  neckline: string
  beardLength: string
  product: string
  barberNotes: string
  customerNotes: string
  photos: { front?: string; right?: string; left?: string; back?: string }
  createdAt: string
  barberId?: string
}

export interface CustomerProfile {
  userId: string
  cutProfiles: CutProfile[]
  favouriteBarberIds: string[]
  bookingHistory: string[]
}

export interface BarberPortfolioItem {
  id: string
  imageUrl: string
  style: string
  tags: string[]
}

export interface Review {
  id: string
  customerId: string
  customerName: string
  barberId: string
  bookingId: string
  resultRating: number
  punctualityRating: number
  cleanlinessRating: number
  communicationRating: number
  overallRating: number
  comment: string
  date: string
  relevantStyle?: string
}

export interface BarberProfile {
  id: string
  userId: string
  name: string
  nameEn: string
  bio: string
  photoUrl: string
  verified: boolean
  yearsExperience: number
  completedBookings: number
  specialties: string[]
  languages: string[]
  serviceAreas: string[]
  equipment: string[]
  rating: number
  relevantRating: number
  cleanlinessRating: number
  arrivalReliability: number
  cancellationRate: number
  portfolio: BarberPortfolioItem[]
  reviews: Review[]
  neighbourhood: string
  currentLat: number
  currentLng: number
  available: boolean
  nextAvailable: string
  basePrice: number
  status: 'available' | 'busy' | 'travelling' | 'offline'
  arrivalMinutes: number
}

export interface Service {
  id: string
  nameHe: string
  description: string
  included: string[]
  scheduledPrice: number
  immediatePrice: number
  durationMinutes: number
  imageUrl: string
  available: boolean
}

export interface HaircutBrief {
  option: 'repeat' | 'upload' | 'catalog' | 'barber_choice'
  imageUrl?: string
  hairType?: string
  currentLength?: string
  style?: string
  fadeHeight?: string
  sideLength?: string
  topLength?: string
  beard?: string
  sensitivities?: string
  notes?: string
}

export interface GroupBookingParticipant {
  id: string
  name: string
  phone: string
  service: string
  joined: boolean
}

export interface Booking {
  id: string
  customerId: string
  barberId: string
  serviceId: string
  address: Address
  scheduledTime: string
  status: BookingStatus
  haircutBrief: HaircutBrief
  servicePrice: number
  arrivalFee: number
  urgencyFee: number
  groupDiscount: number
  finalPrice: number
  estimatedArrivalMinutes: number
  estimatedArrivalTime: string
  estimatedDuration: number
  groupParticipants?: GroupBookingParticipant[]
  isImmediate: boolean
  createdAt: string
  completedAt?: string
  cutProfileSaved?: boolean
  customerRating?: {
    result: number
    punctuality: number
    cleanliness: number
    communication: number
    tip: number
    comment: string
  }
  barberNotes?: {
    sideLength: string
    fadeHeight: string
    topLength: string
    neckline: string
    beardLength: string
    product: string
    notes: string
  }
}

export interface BarberJobOffer {
  id: string
  bookingId: string
  service: string
  customerFirstName: string
  neighbourhood: string
  distanceKm: number
  travelMinutes: number
  serviceDurationMinutes: number
  netPayout: number
  haircutBrief: HaircutBrief
  expiresAt: number
}

export interface BarberEarnings {
  today: number
  thisWeek: number
  thisMonth: number
  pending: number
  tips: number
  platformFees: number
  workingHours: number
  travelHours: number
  revenuePerHour: number
  completedPayouts: { date: string; amount: number; bookings: number }[]
}

export interface AdminAlert {
  id: string
  type: 'delay' | 'no_supply' | 'cancellation' | 'complaint' | 'replacement_needed'
  message: string
  bookingId?: string
  neighbourhood?: string
  severity: 'low' | 'medium' | 'high'
  createdAt: string
}

export interface BusinessEnquiry {
  id: string
  name: string
  company: string
  participants: number
  date: string
  city: string
  phone: string
  note: string
  submittedAt: string
}

export interface PaymentSimulation {
  method: 'card' | 'apple_pay' | 'google_pay' | 'bit'
  status: 'idle' | 'processing' | 'success' | 'failed'
  last4?: string
}

export interface BarberVerification {
  identityStatus: 'pending' | 'verified' | 'rejected'
  portfolioReview: 'pending' | 'approved' | 'rejected'
  interviewStatus: 'pending' | 'scheduled' | 'passed' | 'failed'
  testHaircutStatus: 'pending' | 'scheduled' | 'passed' | 'failed'
  equipmentStatus: 'pending' | 'verified'
  approvalStatus: 'pending' | 'approved' | 'rejected'
}

export interface PricingConfig {
  services: { [serviceId: string]: { scheduled: number; immediate: number } }
  urgencyFee: number
  arrivalFee: number
  maxDistanceKm: number
  groupDiscounts: { [people: number]: number }
  peakMultiplier: number
  minBarberPayout: number
  platformCommission: number
}
