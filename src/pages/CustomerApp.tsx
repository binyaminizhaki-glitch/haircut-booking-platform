import { useState } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, CalendarDays, Scissors, Heart, User, Star, Clock, Check, ArrowRight, Plus, Trash2, Edit2 } from 'lucide-react'
import { mockBarbers, mockCutProfile, HAIRCUT_PHOTOS } from '../data/mockData'
import { store } from '../data/store'
import Logo from '../components/Logo'

function BottomNav() {
  const location = useLocation()
  const tabs = [
    { to: '/app', label: 'בית', icon: Home },
    { to: '/app/bookings', label: 'הזמנות', icon: CalendarDays },
    { to: '/app/cut-profile', label: 'הקאט שלי', icon: Scissors },
    { to: '/app/favourites', label: 'מועדפים', icon: Heart },
    { to: '/app/profile', label: 'פרופיל', icon: User },
  ]
  return (
    <nav className="fixed bottom-0 right-0 left-0 z-50 bg-[#FFFDF8] border-t border-[#D8D1C5] flex">
      {tabs.map(({ to, label, icon: Icon }) => {
        const active = location.pathname === to
        return (
          <Link key={to} to={to} className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 ${active ? 'text-[#7A283D]' : 'text-[#8C857B]'}`}>
            <Icon size={20} className={active ? 'fill-[#7A283D] text-[#7A283D]' : ''} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function AppHome() {
  const navigate = useNavigate()
  const bookings = store.getBookings().filter(b => b.customerId === 'demo_customer')
  const activeBooking = bookings.find(b => ['requested','matched','accepted','preparing','travelling','arrived','in_progress','cleaning'].includes(b.status))
  const upcomingBooking = bookings.find(b => b.status === 'accepted' && !['requested','matched','travelling','arrived','in_progress','cleaning'].includes(b.status))
  const faveBarbers = mockBarbers.filter(b => ['b1', 'b2'].includes(b.id))
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'בוקר טוב' : hour < 17 ? 'צהריים טובים' : 'ערב טוב'

  return (
    <div className="min-h-screen bg-[#F3EEE5] pb-24">
      <div className="bg-[#FFFDF8] px-5 pt-8 pb-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-[14px] text-[#8C857B] mb-1">{greeting},</div>
          <h1 className="text-[26px] font-black text-[#181715]">בנימין</h1>
        </div>
        <Link to="/" aria-label="CUTNOW — מעבר לעמוד הבית" className="shrink-0">
          <Logo size="sm" />
        </Link>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'עכשיו', sub: '~38 דקות', urgent: true },
            { label: 'היום', sub: 'בחר שעה', urgent: false },
            { label: 'קבע מועד', sub: 'תאריך חופשי', urgent: false },
          ].map(q => (
            <button
              key={q.label}
              onClick={() => navigate('/book/service')}
              className={`flex flex-col items-center py-4 rounded-[14px] border-2 transition-all ${
                q.urgent ? 'border-[#7A283D] bg-[#7A283D] text-[#FFFDF8]' : 'border-[#D8D1C5] bg-[#FFFDF8] text-[#181715]'
              }`}
            >
              <span className={`text-[16px] font-bold`}>{q.label}</span>
              <span className={`text-[11px] mt-0.5 ${q.urgent ? 'text-[#F3EEE5]/70' : 'text-[#8C857B]'}`}>{q.sub}</span>
            </button>
          ))}
        </div>

        {/* Active booking */}
        {activeBooking && (
          <button
            onClick={() => navigate(`/booking/${activeBooking.id}`)}
            className="bg-[#211B1C] rounded-[18px] p-4 text-right w-full"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#C8F36A]" />
              <span className="text-[12px] text-[#C8F36A] font-semibold">הזמנה פעילה</span>
            </div>
            <div className="text-[18px] font-black text-[#F3EEE5]">
              {mockBarbers.find(b => b.id === activeBooking.barberId)?.name} בדרך
            </div>
            <div className="text-[14px] text-[#8C857B]">הגעה בעוד {activeBooking.estimatedArrivalMinutes} דקות</div>
          </button>
        )}

        {/* Repeat last */}
        <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[14px] font-bold text-[#181715]">חזור על הקאט האחרון</p>
            <span className="text-[12px] text-[#7A283D] font-semibold">Low Fade</span>
          </div>
          <div className="flex gap-2 mb-3">
            {Object.values(mockCutProfile.photos).filter(Boolean).slice(0, 3).map((img, i) => (
              <div key={i} className="w-16 h-16 rounded-[8px] overflow-hidden bg-[#D8D1C5]">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/book/service')} className="w-full h-[42px] bg-[#7A283D] text-[#FFFDF8] text-[14px] font-semibold rounded-[10px]">
            הזמן עכשיו
          </button>
        </div>

        {/* Favourite barbers */}
        <div>
          <p className="text-[14px] font-bold text-[#181715] mb-3">הספרים שלי</p>
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {faveBarbers.map(b => (
              <div key={b.id} className="shrink-0 w-[140px] bg-[#FFFDF8] border border-[#D8D1C5] rounded-[14px] overflow-hidden">
                <div className="h-[90px] overflow-hidden bg-[#D8D1C5]">
                  <img src={b.photoUrl} alt={b.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="p-2.5">
                  <div className="text-[13px] font-bold text-[#181715]">{b.name.split(' ')[0]}</div>
                  <div className="text-[11px] text-[#8C857B]">{b.nextAvailable}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8F36A]" />
                    <span className="text-[11px] text-[#6D6860]">זמין</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cut profile teaser */}
        <div className="bg-[#F3EEE5] border border-[#D8D1C5] rounded-[18px] p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[14px] font-bold text-[#181715]">הקאט שלי</p>
            <Link to="/app/cut-profile" className="text-[12px] text-[#7A283D] font-semibold">צפה ←</Link>
          </div>
          <div className="grid grid-cols-2 gap-y-1">
            {[['פייד', 'Low Fade'], ['צדדים', '0.5'], ['למעלה', '4 ס"מ'], ['זקן', '6 מ"מ']].map(([k, v]) => (
              <div key={k}><span className="text-[11px] text-[#8C857B]">{k}: </span><span className="text-[12px] font-semibold text-[#181715]">{v}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BookingsPage() {
  const [tab, setTab] = useState<'active' | 'upcoming' | 'completed' | 'cancelled'>('active')
  const navigate = useNavigate()
  const allBookings = store.getBookings().filter(b => b.customerId === 'demo_customer')
  const activeStatuses = ['requested','matched','accepted','preparing','travelling','arrived','in_progress','cleaning']
  const filtered = {
    active: allBookings.filter(b => activeStatuses.includes(b.status)),
    upcoming: allBookings.filter(b => b.status === 'accepted' && new Date(b.scheduledTime) > new Date()),
    completed: allBookings.filter(b => b.status === 'completed'),
    cancelled: allBookings.filter(b => b.status === 'cancelled'),
  }

  const STATUS_HE: Record<string, string> = {
    requested: 'ממתין', matched: 'הותאם', accepted: 'אושר', preparing: 'מתכונן',
    travelling: 'בדרך', arrived: 'הגיע', in_progress: 'בתהליך', cleaning: 'מנקה', completed: 'הושלם', cancelled: 'בוטל',
  }

  return (
    <div className="min-h-screen bg-[#F3EEE5] pb-24">
      <div className="bg-[#FFFDF8] border-b border-[#D8D1C5] px-4 pt-12 pb-0">
        <h1 className="text-[22px] font-black text-[#181715] mb-3">ההזמנות שלי</h1>
        <div className="flex border-b border-[#D8D1C5]">
          {(['active', 'upcoming', 'completed', 'cancelled'] as const).map(t => {
            const labels = { active: 'פעילות', upcoming: 'עתידיות', completed: 'הושלמו', cancelled: 'בוטלו' }
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-[13px] font-semibold border-b-2 transition-colors ${
                  tab === t ? 'border-[#7A283D] text-[#7A283D]' : 'border-transparent text-[#8C857B]'
                }`}
              >
                {labels[t]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-3">
        {filtered[tab].length === 0 ? (
          <div className="text-center py-16">
            <div className="text-[40px] mb-3">✂️</div>
            <p className="text-[16px] font-semibold text-[#181715] mb-1">אין הזמנות כאן</p>
            <p className="text-[14px] text-[#6D6860] mb-5">הזמן תספורת עכשיו</p>
            <button onClick={() => navigate('/book/service')} className="h-[46px] px-6 bg-[#7A283D] text-[#FFFDF8] font-semibold rounded-[12px] text-[14px]">
              הזמן ספר
            </button>
          </div>
        ) : (
          filtered[tab].map(booking => {
            const barber = mockBarbers.find(b => b.id === booking.barberId)
            const active = activeStatuses.includes(booking.status)
            return (
              <button
                key={booking.id}
                onClick={() => active ? navigate(`/booking/${booking.id}`) : null}
                className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-4 text-right w-full"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-[5px] ${
                    active ? 'bg-[#E9F9BF] text-[#397458]' : booking.status === 'completed' ? 'bg-[#E1F0E8] text-[#397458]' : 'bg-[#F3EEE5] text-[#8C857B]'
                  }`}>{STATUS_HE[booking.status]}</span>
                  <span className="text-[13px] text-[#8C857B]">{new Date(booking.scheduledTime).toLocaleDateString('he-IL')}</span>
                </div>
                <div className="flex items-center gap-2">
                  {barber && <div className="w-10 h-10 rounded-[8px] overflow-hidden bg-[#D8D1C5] shrink-0"><img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover" /></div>}
                  <div>
                    <div className="text-[15px] font-bold text-[#181715]">{barber?.name}</div>
                    <div className="text-[13px] text-[#6D6860]">{booking.serviceId.replace('s_', '').replace('_', ' ')} · {booking.finalPrice} ₪</div>
                  </div>
                </div>
                {booking.status === 'completed' && (
                  <div className="mt-3 pt-3 border-t border-[#D8D1C5] flex gap-2">
                    <button onClick={e => { e.stopPropagation(); navigate('/book/service') }} className="flex-1 h-[36px] border border-[#D8D1C5] rounded-[8px] text-[13px] text-[#181715] font-medium">
                      הזמן שוב
                    </button>
                    <button onClick={e => { e.stopPropagation(); navigate('/app/cut-profile') }} className="flex-1 h-[36px] border border-[#D8D1C5] rounded-[8px] text-[13px] text-[#181715] font-medium">
                      קאט פרופיל
                    </button>
                  </div>
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

function CutProfilePage() {
  const navigate = useNavigate()
  const profiles = [mockCutProfile, { ...mockCutProfile, id: 'cp2', name: 'אירוע', sideLength: '0 (Skin)', topLength: '2 ס"מ', photos: { front: HAIRCUT_PHOTOS[2], right: HAIRCUT_PHOTOS[3], left: HAIRCUT_PHOTOS[5], back: HAIRCUT_PHOTOS[6] } }]

  return (
    <div className="min-h-screen bg-[#F3EEE5] pb-24">
      <div className="bg-[#FFFDF8] border-b border-[#D8D1C5] px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-black text-[#181715]">הקאט שלי</h1>
          <button onClick={() => navigate('/book/service')} className="w-8 h-8 bg-[#7A283D] rounded-full flex items-center justify-center">
            <Plus size={16} className="text-[#FFFDF8]" />
          </button>
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">
        {profiles.map(profile => (
          <div key={profile.id} className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[20px] overflow-hidden">
            {/* Photo grid */}
            <div className="grid grid-cols-4 gap-1 p-1">
              {(['front', 'right', 'left', 'back'] as const).map(angle => (
                <div key={angle} className="aspect-square rounded-[8px] overflow-hidden bg-[#D8D1C5] relative">
                  {profile.photos[angle] ? (
                    <img src={profile.photos[angle]} alt={angle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Plus size={16} className="text-[#8C857B]" /></div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[16px] font-bold text-[#181715]">{profile.name}</h3>
                <div className="flex gap-1.5">
                  <button className="p-1.5 text-[#8C857B] hover:text-[#181715]"><Edit2 size={15} /></button>
                  <button className="p-1.5 text-[#8C857B] hover:text-[#C94B4B]"><Trash2 size={15} /></button>
                </div>
              </div>

              {/* Cut line */}
              <div className="h-[2px] bg-[#7A283D] mb-3" />

              <div className="grid grid-cols-2 gap-y-2 gap-x-6">
                {[
                  ['פייד', profile.fadeHeight],
                  ['צדדים', profile.sideLength],
                  ['למעלה', profile.topLength],
                  ['קו עורף', profile.neckline],
                  ['זקן', profile.beardLength],
                  ['מוצר', profile.product],
                ].map(([k, v]) => (
                  <div key={k}>
                    <span className="text-[11px] text-[#8C857B]">{k}</span>
                    <div className="text-[13px] font-semibold text-[#181715]">{v}</div>
                  </div>
                ))}
              </div>

              {profile.barberNotes && (
                <div className="mt-3 bg-[#F3EEE5] rounded-[10px] p-2.5">
                  <span className="text-[11px] text-[#8C857B]">הערת ספר: </span>
                  <span className="text-[12px] text-[#6D6860]">{profile.barberNotes}</span>
                </div>
              )}

              <button onClick={() => navigate('/book/service')} className="w-full mt-3 h-[40px] bg-[#7A283D] text-[#FFFDF8] text-[14px] font-semibold rounded-[10px]">
                הזמן עם הקאט הזה
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FavouritesPage() {
  const navigate = useNavigate()
  const faves = mockBarbers.filter(b => ['b1', 'b2'].includes(b.id))

  return (
    <div className="min-h-screen bg-[#F3EEE5] pb-24">
      <div className="bg-[#FFFDF8] border-b border-[#D8D1C5] px-4 pt-12 pb-4">
        <h1 className="text-[22px] font-black text-[#181715]">מועדפים</h1>
      </div>
      <div className="px-4 py-5 flex flex-col gap-3">
        {faves.map(b => (
          <div key={b.id} className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] overflow-hidden flex">
            <div className="w-24 h-[120px] overflow-hidden bg-[#D8D1C5] shrink-0">
              <img src={b.photoUrl} alt={b.name} className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="text-[16px] font-bold text-[#181715]">{b.name}</h3>
                  <p className="text-[12px] text-[#6D6860]">{b.specialties.slice(0, 2).join(' · ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <Star size={12} className="text-[#7A283D] fill-[#7A283D]" />
                <span className="text-[13px] font-semibold text-[#181715]">{b.rating}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8F36A]" />
                <span className="text-[12px] text-[#6D6860]">זמין {b.nextAvailable} · {b.arrivalMinutes} דקות</span>
              </div>
              <button onClick={() => navigate('/book/service')} className="h-[32px] px-3 bg-[#7A283D] text-[#FFFDF8] text-[12px] font-semibold rounded-[8px]">
                הזמן
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F3EEE5] pb-24">
      <div className="bg-[#FFFDF8] border-b border-[#D8D1C5] px-4 pt-12 pb-4">
        <h1 className="text-[22px] font-black text-[#181715]">הפרופיל שלי</h1>
      </div>
      <div className="px-4 py-5">
        <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-5 mb-4">
          <div className="w-16 h-16 bg-[#7A283D] rounded-full flex items-center justify-center mb-3">
            <span className="text-[24px] font-black text-[#FFFDF8]">ב</span>
          </div>
          <h2 className="text-[20px] font-bold text-[#181715]">בנימין</h2>
          <p className="text-[14px] text-[#6D6860]">050-1234567</p>
          <p className="text-[14px] text-[#6D6860]">רחוב עזה 32, ירושלים</p>
        </div>
        <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] overflow-hidden">
          {['כתובות שמורות', 'שיטות תשלום', 'התראות', 'פרטיות', 'תמיכה', 'יציאה'].map((item, i) => (
            <button key={item} className={`w-full text-right px-4 py-4 flex items-center justify-between hover:bg-[#F3EEE5] transition-colors ${i < 5 ? 'border-b border-[#D8D1C5]' : ''}`}>
              <span className={`text-[15px] ${item === 'יציאה' ? 'text-[#C94B4B]' : 'text-[#181715]'} font-medium`}>{item}</span>
              <ArrowRight size={16} className="text-[#8C857B] rotate-180" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CustomerApp() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route index element={<AppHome />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="cut-profile" element={<CutProfilePage />} />
        <Route path="favourites" element={<FavouritesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
