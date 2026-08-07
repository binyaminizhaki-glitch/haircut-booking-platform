import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageCircle, Phone, AlertCircle, Check, ChevronLeft } from 'lucide-react'
import JerusalemMap from '../components/JerusalemMap'
import { mockBarbers } from '../data/mockData'
import { store } from '../data/store'
import type { BookingStatus } from '../data/types'

const STATUS_LABELS: Record<BookingStatus, string> = {
  requested: 'ההזמנה התקבלה',
  matched: 'נמצא ספר מתאים',
  accepted: 'הספר אישר',
  preparing: 'ערכת הציוד בהכנה',
  travelling: 'הספר יצא לדרך',
  arrived: 'הספר הגיע',
  in_progress: 'התספורת התחילה',
  cleaning: 'הספר מנקה את האזור',
  completed: 'התספורת הסתיימה',
  cancelled: 'ההזמנה בוטלה',
  replacement_required: 'מחפש ספר חלופי',
}

const STATUS_ORDER: BookingStatus[] = ['requested', 'matched', 'accepted', 'preparing', 'travelling', 'arrived', 'in_progress', 'cleaning', 'completed']

export default function LiveBookingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(() => store.getBooking(id!))
  const [demoETA, setDemoETA] = useState(12)
  const [progress, setProgress] = useState(0.4)

  useEffect(() => {
    const unsub = store.onSync(() => {
      setBooking(store.getBooking(id!))
    })
    return unsub
  }, [id])

  useEffect(() => {
    if (booking?.status === 'travelling') {
      const t = setInterval(() => {
        setDemoETA(p => Math.max(0, p - 1))
        setProgress(p => Math.min(0.95, p + 0.04))
      }, 3000)
      return () => clearInterval(t)
    }
  }, [booking?.status])

  useEffect(() => {
    if (booking?.status === 'completed') {
      const t = setTimeout(() => navigate(`/booking/${id}/complete`), 2000)
      return () => clearTimeout(t)
    }
  }, [booking?.status, id, navigate])

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F3EEE5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[18px] text-[#181715] font-semibold mb-3">הזמנה לא נמצאה</p>
          <button onClick={() => navigate('/app')} className="text-[#7A283D] font-semibold">חזור</button>
        </div>
      </div>
    )
  }

  const barber = mockBarbers.find(b => b.id === booking.barberId) || mockBarbers[0]
  const currentIdx = STATUS_ORDER.indexOf(booking.status)
  const isCancelled = booking.status === 'cancelled'
  const isCompleted = booking.status === 'completed'

  return (
    <div className="min-h-screen bg-[#211B1C] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3">
        <button onClick={() => navigate('/app')} className="p-2 text-[#8C857B]">
          <ChevronLeft size={22} />
        </button>
        <div className="text-center">
          <div className="text-[13px] text-[#6D6860]">הזמנה {booking.id.slice(-6).toUpperCase()}</div>
        </div>
        <div className="w-10" />
      </div>

      {/* Map */}
      <div className="mx-4 mb-4 h-[200px] md:h-[260px] rounded-[20px] overflow-hidden">
        <JerusalemMap dark={true} showRoute={booking.status === 'travelling'} progress={progress} />
      </div>

      {/* Status card */}
      <div className="flex-1 bg-[#2D2527] rounded-t-[24px] mx-0 px-5 pt-6 pb-8">
        {isCancelled ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-[#F8E2E2]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-[#C94B4B]" />
            </div>
            <h2 className="text-[22px] font-bold text-[#F3EEE5] mb-2">הספר נאלץ לבטל</h2>
            <p className="text-[14px] text-[#8C857B] mb-6">אנחנו כבר מחפשים מחליף. המחיר שלך נשאר ללא שינוי.</p>
            <div className="flex gap-3">
              <button className="flex-1 h-[46px] bg-[#7A283D] text-[#FFFDF8] rounded-[12px] font-semibold text-[14px]">המשך לחפש</button>
              <button onClick={() => navigate('/')} className="flex-1 h-[46px] border border-[#3A3032] text-[#8C857B] rounded-[12px] font-semibold text-[14px]">בטל וקבל החזר</button>
            </div>
          </div>
        ) : (
          <>
            {/* Barber info */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-[10px] overflow-hidden bg-[#3A3032] shrink-0">
                <img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h2 className="text-[20px] font-black text-[#F3EEE5]">{barber.name} {booking.status === 'travelling' ? 'בדרך אליך' : STATUS_LABELS[booking.status]}</h2>
                {booking.status === 'travelling' && (
                  <div className="flex items-baseline gap-1">
                    <span className="text-[36px] font-black text-[#FFFDF8]">{demoETA}</span>
                    <span className="text-[16px] text-[#8C857B]">דקות</span>
                    <span className="text-[13px] text-[#6D6860] mr-2">· שעת הגעה {booking.estimatedArrivalTime}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C8F36A]" />
                <span className="text-[12px] text-[#C8F36A] font-medium">שידור חי</span>
              </div>
            </div>

            {/* Progress timeline */}
            <div className="flex flex-col gap-2 mb-6">
              {STATUS_ORDER.filter(s => s !== 'replacement_required').map((s, idx) => {
                const done = idx <= currentIdx
                const active = idx === currentIdx
                if (idx > currentIdx + 2) return null
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      done ? 'bg-[#7A283D]' : 'bg-[#3A3032]'
                    }`}>
                      {done && <Check size={11} className="text-[#FFFDF8]" />}
                    </div>
                    <span className={`text-[14px] ${active ? 'text-[#FFFDF8] font-semibold' : done ? 'text-[#6D6860]' : 'text-[#3A3032]'}`}>
                      {STATUS_LABELS[s]}
                    </span>
                    {active && <span className="w-2 h-2 rounded-full bg-[#C8F36A] mr-auto shrink-0" />}
                  </div>
                )
              })}
            </div>

            {/* Cut line */}
            <div className="h-[2px] bg-[#7A283D] mb-5" />

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { icon: MessageCircle, label: 'הודעה' },
                { icon: Phone, label: 'התקשר' },
                { icon: AlertCircle, label: 'דיווח' },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="flex flex-col items-center gap-1 py-3 bg-[#211B1C] rounded-[12px]">
                  <Icon size={18} className="text-[#8C857B]" />
                  <span className="text-[12px] text-[#6D6860]">{label}</span>
                </button>
              ))}
            </div>

            {/* Demo controls */}
            <div className="bg-[#211B1C] rounded-[14px] p-3 border border-[#3A3032]">
              <p className="text-[11px] text-[#6D6860] mb-2 text-center">🎮 שליטת הדגמה</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {STATUS_ORDER.map(s => (
                  <button
                    key={s}
                    onClick={() => store.updateBookingStatus(booking.id, s)}
                    className={`px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors ${
                      booking.status === s ? 'bg-[#7A283D] text-[#FFFDF8]' : 'bg-[#2D2527] text-[#8C857B] hover:bg-[#3A3032]'
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
