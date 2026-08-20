import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Calendar, TrendingUp, User, Check, X, Clock, MapPin, AlertCircle } from 'lucide-react'
import { mockBarbers, mockBarberEarnings, HAIRCUT_PHOTOS } from '../data/mockData'
import { store } from '../data/store'

const barber = mockBarbers[0] // Demo: logged in as עידו לוי

function BarberNav() {
  const loc = useLocation()
  const tabs = [
    { to: '/barber', icon: LayoutDashboard, label: 'בית' },
    { to: '/barber/jobs', icon: Briefcase, label: 'עבודות' },
    { to: '/barber/calendar', icon: Calendar, label: 'לוח' },
    { to: '/barber/earnings', icon: TrendingUp, label: 'הכנסות' },
    { to: '/barber/profile', icon: User, label: 'פרופיל' },
  ]
  return (
    <nav className="fixed bottom-0 right-0 left-0 z-50 bg-[#211B1C] border-t border-[#2D2527] flex">
      {tabs.map(({ to, icon: Icon, label }) => {
        const active = loc.pathname === to
        return (
          <Link key={to} to={to} className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 ${active ? 'text-[#C8F36A]' : 'text-[#6D6860]'}`}>
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function BarberHome() {
  const [available, setAvailable] = useState(true)
  const bookings = store.getBookings()
  const todayJobs = bookings.filter(b => ['accepted', 'travelling', 'arrived', 'in_progress'].includes(b.status) && b.barberId === barber.id)

  // Demo job offer
  const jobOffer = {
    service: 'פייד + תספורת',
    customerName: 'אחמד',
    neighbourhood: 'רחביה',
    distanceKm: 1.8,
    travelMinutes: 9,
    durationMinutes: 40,
    netPayout: 147,
    countdown: 45,
  }
  const [offerVisible, setOfferVisible] = useState(true)
  const [countdown, setCountdown] = useState(jobOffer.countdown)

  useEffect(() => {
    if (!offerVisible || !available) return
    if (countdown <= 0) {
      setOfferVisible(false)
      return
    }

    const timer = window.setTimeout(() => setCountdown(value => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [available, countdown, offerVisible])

  return (
    <div className="min-h-screen bg-[#211B1C] pb-24">
      <div className="px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[13px] text-[#6D6860]">שלום,</div>
            <h1 className="text-[24px] font-black text-[#F3EEE5]">{barber.name}</h1>
          </div>
          <div className="text-left">
            <div className="text-[11px] text-[#6D6860] mb-1">היום</div>
            <div className="text-[22px] font-black text-[#C8F36A]">{mockBarberEarnings.today} ₪</div>
          </div>
        </div>

        {/* Availability toggle */}
        <button
          onClick={() => setAvailable(!available)}
          className={`w-full py-4 rounded-[16px] border-2 flex items-center justify-between px-5 mb-5 transition-all ${
            available ? 'border-[#C8F36A] bg-[#C8F36A]/10' : 'border-[#3A3032] bg-[#2D2527]'
          }`}
        >
          <div>
            <div className={`text-[18px] font-black ${available ? 'text-[#C8F36A]' : 'text-[#6D6860]'}`}>
              {available ? 'אני זמין עכשיו' : 'לא זמין'}
            </div>
            <div className="text-[12px] text-[#6D6860]">{available ? 'רחביה · עד 5 ק"מ' : 'לחץ להפוך לזמין'}</div>
          </div>
          <div className={`w-12 h-6 rounded-full transition-all ${available ? 'bg-[#C8F36A]' : 'bg-[#3A3032]'} relative`}>
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#211B1C] transition-all ${available ? 'left-[26px]' : 'left-0.5'}`} />
          </div>
        </button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: 'הזמנות היום', value: '4' },
            { label: 'נסיעה כוללת', value: '38 דק' },
            { label: 'לאדם לשעה', value: `${mockBarberEarnings.revenuePerHour} ₪` },
          ].map(s => (
            <div key={s.label} className="bg-[#2D2527] rounded-[12px] p-3 text-center">
              <div className="text-[20px] font-black text-[#F3EEE5]">{s.value}</div>
              <div className="text-[10px] text-[#6D6860]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Job offer */}
        {offerVisible && available && (
          <div className="bg-[#2D2527] border border-[#3A3032] rounded-[18px] p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-bold text-[#C8F36A] bg-[#C8F36A]/10 px-2 py-0.5 rounded-[5px]">בקשת עבודה</span>
              <div className="text-[13px] text-[#D97855] font-bold">{countdown} שניות</div>
            </div>
            <h3 className="text-[18px] font-black text-[#F3EEE5] mb-1">{jobOffer.service}</h3>
            <div className="flex items-center gap-3 text-[13px] text-[#8C857B] mb-1">
              <span>{jobOffer.customerName}</span>
              <span>{jobOffer.neighbourhood}</span>
              <span>{jobOffer.distanceKm} ק"מ · {jobOffer.travelMinutes} דקות</span>
            </div>
            <div className="flex items-center gap-3 text-[13px] text-[#8C857B] mb-4">
              <Clock size={13} /><span>{jobOffer.durationMinutes} דקות עבודה</span>
              <span className="text-[#C8F36A] font-bold text-[16px]">{jobOffer.netPayout} ₪ נטו</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setOfferVisible(false)} className="flex-1 h-[48px] bg-[#C8F36A] text-[#181715] font-bold rounded-[12px] text-[15px] flex items-center justify-center gap-2">
                <Check size={18} /> קבל
              </button>
              <button onClick={() => setOfferVisible(false)} className="h-[48px] w-[48px] border border-[#3A3032] rounded-[12px] flex items-center justify-center text-[#6D6860]">
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Today's jobs */}
        {todayJobs.length > 0 && (
          <div>
            <p className="text-[13px] text-[#6D6860] mb-2">עבודות פעילות</p>
            {todayJobs.map(job => (
              <div key={job.id} className="bg-[#2D2527] rounded-[14px] p-4 border border-[#3A3032]">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-[#F3EEE5]">{job.address.street} {job.address.number}</span>
                  <span className="text-[14px] font-bold text-[#C8F36A]">{job.finalPrice} ₪</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BarberJobsPage() {
  const [, setVersion] = useState(0)
  const bookings = store.getBookings().filter(b => b.barberId === barber.id && b.status !== 'completed' && b.status !== 'cancelled')
  const navigate = useNavigate()

  const STATUS_ACTIONS: Record<string, { label: string; next: string }[]> = {
    accepted: [{ label: 'יצאתי לדרך', next: 'travelling' }],
    travelling: [{ label: 'הגעתי', next: 'arrived' }],
    arrived: [{ label: 'התחלתי', next: 'in_progress' }],
    in_progress: [{ label: 'סיימתי', next: 'cleaning' }],
    cleaning: [{ label: 'ניקיתי', next: 'completed' }],
  }

  return (
    <div className="min-h-screen bg-[#211B1C] pb-24">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-[22px] font-black text-[#F3EEE5] mb-5">עבודות</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle size={36} className="text-[#6D6860] mx-auto mb-3" />
            <p className="text-[16px] text-[#8C857B]">אין עבודות פעילות</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map(job => {
              const actions = STATUS_ACTIONS[job.status] || []
              return (
                <div key={job.id} className="bg-[#2D2527] border border-[#3A3032] rounded-[18px] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] text-[#C8F36A] font-semibold bg-[#C8F36A]/10 px-2 py-0.5 rounded-[5px]">{job.status}</span>
                    <span className="text-[16px] font-black text-[#C8F36A]">{job.finalPrice} ₪</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} className="text-[#6D6860]" />
                    <span className="text-[14px] text-[#F3EEE5] font-semibold">{job.address.street} {job.address.number}, {job.address.city}</span>
                  </div>
                  {job.haircutBrief?.imageUrl && (
                    <div className="w-16 h-16 rounded-[8px] overflow-hidden mb-3 bg-[#3A3032]">
                      <img src={job.haircutBrief.imageUrl} alt="השראה" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {job.haircutBrief?.notes && (
                    <p className="text-[13px] text-[#8C857B] mb-3">{job.haircutBrief.notes}</p>
                  )}
                  {actions.map(a => (
                    <button
                      key={a.label}
                      onClick={() => {
                        store.updateBookingStatus(job.id, a.next as any)
                        setVersion(version => version + 1)
                      }}
                      className="w-full h-[48px] bg-[#C8F36A] text-[#181715] font-bold rounded-[12px] text-[15px]"
                    >
                      {a.label}
                    </button>
                  ))}
                  {job.status === 'completed' && (
                    <button onClick={() => navigate(`/booking/${job.id}/complete`)} className="w-full h-[48px] bg-[#7A283D] text-[#FFFDF8] font-bold rounded-[12px] text-[15px]">
                      תעד תספורת
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function BarberCalendarPage() {
  const days = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']
  const [available, setAvailable] = useState<Record<string, boolean>>({
    '0_08:00': true, '0_09:00': true, '0_10:00': true, '0_11:00': true,
    '1_14:00': true, '1_15:00': true, '1_16:00': true, '1_17:00': true, '1_18:00': true,
    '3_10:00': true, '3_11:00': true, '3_12:00': true,
    '4_09:00': true, '4_10:00': true, '4_11:00': true,
  })

  return (
    <div className="min-h-screen bg-[#211B1C] pb-24">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-[22px] font-black text-[#F3EEE5] mb-5">לוח זמינות</h1>
        <p className="text-[13px] text-[#6D6860] mb-4">לחץ על שעה לסמן כזמין / לא זמין</p>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Day headers */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="col-span-1" />
              {days.map(d => (
                <div key={d} className="text-center text-[12px] font-bold text-[#8C857B]">{d}</div>
              ))}
            </div>
            {hours.map(h => (
              <div key={h} className="grid grid-cols-8 gap-1 mb-1">
                <div className="text-[11px] text-[#6D6860] flex items-center">{h}</div>
                {days.map((_, di) => {
                  const key = `${di}_${h}`
                  const isAvail = available[key]
                  return (
                    <button
                      key={di}
                      onClick={() => setAvailable(p => ({ ...p, [key]: !p[key] }))}
                      className={`h-7 rounded-[5px] transition-all ${isAvail ? 'bg-[#C8F36A]' : 'bg-[#2D2527] border border-[#3A3032]'}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BarberEarningsPage() {
  const e = mockBarberEarnings
  return (
    <div className="min-h-screen bg-[#211B1C] pb-24">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-[22px] font-black text-[#F3EEE5] mb-5">הכנסות</h1>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'היום', value: `${e.today} ₪`, color: 'text-[#C8F36A]' },
            { label: 'השבוע', value: `${e.thisWeek} ₪`, color: 'text-[#F3EEE5]' },
            { label: 'החודש', value: `${e.thisMonth} ₪`, color: 'text-[#F3EEE5]' },
            { label: 'ממתין לתשלום', value: `${e.pending} ₪`, color: 'text-[#D97855]' },
          ].map(s => (
            <div key={s.label} className="bg-[#2D2527] rounded-[16px] p-4 border border-[#3A3032]">
              <div className={`text-[26px] font-black ${s.color}`}>{s.value}</div>
              <div className="text-[12px] text-[#6D6860]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: 'טיפים', value: `${e.tips} ₪` },
            { label: 'שעות עבודה', value: `${e.workingHours}` },
            { label: 'לשעה', value: `${e.revenuePerHour} ₪` },
          ].map(s => (
            <div key={s.label} className="bg-[#2D2527] rounded-[12px] p-3 border border-[#3A3032] text-center">
              <div className="text-[18px] font-black text-[#F3EEE5]">{s.value}</div>
              <div className="text-[11px] text-[#6D6860]">{s.label}</div>
            </div>
          ))}
        </div>

        <p className="text-[13px] font-semibold text-[#8C857B] mb-3">תשלומים אחרונים</p>
        <div className="flex flex-col gap-2">
          {e.completedPayouts.map((p, i) => (
            <div key={i} className="bg-[#2D2527] border border-[#3A3032] rounded-[14px] p-3 flex items-center justify-between">
              <div>
                <div className="text-[14px] font-semibold text-[#F3EEE5]">{p.date}</div>
                <div className="text-[12px] text-[#6D6860]">{p.bookings} הזמנות</div>
              </div>
              <span className="text-[18px] font-black text-[#C8F36A]">{p.amount} ₪</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BarberProfilePage() {
  return (
    <div className="min-h-screen bg-[#211B1C] pb-24">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-[22px] font-black text-[#F3EEE5] mb-5">הפרופיל שלי</h1>
        <div className="w-20 h-24 rounded-[14px] overflow-hidden bg-[#2D2527] mb-4">
          <img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-[20px] font-bold text-[#F3EEE5] mb-1">{barber.name}</h2>
        <p className="text-[14px] text-[#8C857B] mb-4">{barber.neighbourhood} · {barber.yearsExperience} שנות ניסיון</p>
        <p className="text-[14px] text-[#6D6860] leading-[1.7] mb-5">{barber.bio}</p>
        <div className="bg-[#2D2527] border border-[#3A3032] rounded-[18px] overflow-hidden">
          {['עריכת פרופיל', 'התמחויות', 'אזורי שירות', 'ציוד', 'מחירים', 'תיק עבודות'].map((item, i) => (
            <button key={item} className={`w-full text-right px-4 py-4 flex items-center justify-between hover:bg-[#3A3032] transition-colors ${i < 5 ? 'border-b border-[#3A3032]' : ''}`}>
              <span className="text-[15px] text-[#F3EEE5] font-medium">{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BarberDashboard() {
  return (
    <div className="min-h-screen bg-[#211B1C]">
      <Routes>
        <Route index element={<BarberHome />} />
        <Route path="jobs" element={<BarberJobsPage />} />
        <Route path="calendar" element={<BarberCalendarPage />} />
        <Route path="earnings" element={<BarberEarningsPage />} />
        <Route path="profile" element={<BarberProfilePage />} />
      </Routes>
      <BarberNav />
    </div>
  )
}
