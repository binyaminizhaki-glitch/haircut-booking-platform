import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertCircle, Check, CheckCircle2, ChevronLeft, MessageCircle, Phone, Send, X } from 'lucide-react'
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

type ContactAction = 'message' | 'call' | 'report' | null

const QUICK_MESSAGES = ['אני מחכה בכניסה', 'תתקשר כשתגיע', 'יש חניה ליד הבית']
const REPORT_REASONS = ['הספר מאחר', 'לא מצליח ליצור קשר', 'בעיה בהזמנה', 'אחר']
const DEMO_BARBER_PHONE = '050-555-0194'

export default function LiveBookingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(() => store.getBooking(id!))
  const [demoETA, setDemoETA] = useState(12)
  const [progress, setProgress] = useState(0.4)
  const [contactAction, setContactAction] = useState<ContactAction>(null)
  const [message, setMessage] = useState('')
  const [messageError, setMessageError] = useState('')
  const [messageSent, setMessageSent] = useState('')
  const [reportReason, setReportReason] = useState('')
  const [reportError, setReportError] = useState('')
  const [reportSent, setReportSent] = useState(false)
  const [callStarted, setCallStarted] = useState(false)

  useEffect(() => {
    setBooking(store.getBooking(id!))
  }, [id])

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
  const isReplacement = booking.status === 'replacement_required'

  const toggleContactAction = (action: Exclude<ContactAction, null>) => {
    setContactAction(current => current === action ? null : action)
    setMessageError('')
    setReportError('')
  }

  const sendMessage = () => {
    const cleanMessage = message.trim()
    if (!cleanMessage) {
      setMessageError('כתוב הודעה קצרה לפני השליחה.')
      return
    }

    setMessageSent(cleanMessage)
    setMessage('')
    setMessageError('')
  }

  const submitReport = () => {
    if (!reportReason) {
      setReportError('בחר את נושא הדיווח.')
      return
    }

    setReportSent(true)
    setReportError('')
  }

  return (
    <div className="min-h-dvh bg-[#211B1C] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3">
        <button onClick={() => navigate('/app')} className="p-2 text-[#8C857B]" aria-label="חזרה לאפליקציה">
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
              <button
                onClick={() => store.updateBookingStatus(booking.id, 'replacement_required')}
                className="flex-1 h-[46px] bg-[#7A283D] text-[#FFFDF8] rounded-[12px] font-semibold text-[14px]"
              >
                המשך לחפש
              </button>
              <button
                onClick={() => navigate('/app/bookings')}
                className="flex-1 h-[46px] border border-[#3A3032] text-[#8C857B] rounded-[12px] font-semibold text-[14px]"
              >
                בטל וקבל החזר
              </button>
            </div>
          </div>
        ) : isReplacement ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#C8F36A]/10">
              <CheckCircle2 className="size-6 text-[#C8F36A]" aria-hidden="true" />
            </div>
            <h2 className="mb-2 text-balance text-[22px] font-bold text-[#F3EEE5]">מחפשים עבורך ספר חלופי</h2>
            <p className="mx-auto mb-6 max-w-md text-pretty text-[14px] leading-6 text-[#8C857B]">
              הבקשה הועברה לספרים זמינים באזור. נעדכן אותך ברגע שנמצא התאמה חדשה, ללא שינוי במחיר.
            </p>
            <button
              onClick={() => navigate('/app/bookings')}
              className="h-[46px] rounded-[12px] bg-[#7A283D] px-6 text-[14px] font-semibold text-[#FFFDF8]"
            >
              חזרה להזמנות
            </button>
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
                { id: 'message' as const, icon: MessageCircle, label: 'הודעה' },
                { id: 'call' as const, icon: Phone, label: 'התקשר' },
                { id: 'report' as const, icon: AlertCircle, label: 'דיווח' },
              ].map(({ id: action, icon: Icon, label }) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => toggleContactAction(action)}
                  aria-pressed={contactAction === action}
                  aria-controls="contact-action-panel"
                  className="flex flex-col items-center gap-1 rounded-[12px] bg-[#211B1C] py-3 text-[#6D6860] transition-colors duration-150 hover:text-[#F3EEE5] aria-[pressed=true]:bg-[#7A283D] aria-[pressed=true]:text-[#FFFDF8]"
                >
                  <Icon size={18} aria-hidden="true" />
                  <span className="text-[12px]">{label}</span>
                </button>
              ))}
            </div>

            {contactAction && (
              <section id="contact-action-panel" className="mb-4 rounded-[14px] border border-[#3A3032] bg-[#211B1C] p-4" aria-live="polite">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-[15px] font-bold text-[#F3EEE5]">
                    {contactAction === 'message' ? `שליחת הודעה ל${barber.name}` : contactAction === 'call' ? `התקשרות ל${barber.name}` : 'דיווח על בעיה'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setContactAction(null)}
                    className="flex size-9 items-center justify-center rounded-full text-[#8C857B] hover:bg-[#2D2527] hover:text-[#F3EEE5]"
                    aria-label="סגור"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>

                {contactAction === 'message' && (
                  <div>
                    {messageSent && (
                      <div className="mb-3 flex items-start gap-2 rounded-[10px] bg-[#C8F36A]/10 p-3 text-[13px] text-[#C8F36A]">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <span>ההודעה נשלחה: “{messageSent}”</span>
                      </div>
                    )}
                    <div className="mb-3 flex flex-wrap gap-2">
                      {QUICK_MESSAGES.map(quickMessage => (
                        <button
                          key={quickMessage}
                          type="button"
                          onClick={() => {
                            setMessage(quickMessage)
                            setMessageError('')
                          }}
                          className="rounded-full border border-[#3A3032] px-3 py-1.5 text-[12px] text-[#8C857B] hover:border-[#7A283D] hover:text-[#F3EEE5]"
                        >
                          {quickMessage}
                        </button>
                      ))}
                    </div>
                    <label htmlFor="barber-message" className="mb-1.5 block text-[12px] font-medium text-[#8C857B]">הודעה לספר</label>
                    <textarea
                      id="barber-message"
                      value={message}
                      onChange={event => {
                        setMessage(event.target.value)
                        setMessageError('')
                      }}
                      rows={3}
                      placeholder="כתוב הודעה קצרה..."
                      className="w-full resize-none rounded-[10px] border border-[#3A3032] bg-[#2D2527] p-3 text-[14px] text-[#F3EEE5] placeholder:text-[#6D6860] focus:border-[#7A283D] focus:outline-none"
                    />
                    {messageError && <p className="mt-1.5 text-[12px] text-[#C94B4B]">{messageError}</p>}
                    <button
                      type="button"
                      onClick={sendMessage}
                      className="mt-3 inline-flex h-[42px] items-center justify-center gap-2 rounded-[10px] bg-[#7A283D] px-5 text-[14px] font-semibold text-[#FFFDF8]"
                    >
                      <Send className="size-4" aria-hidden="true" />
                      שלח הודעה
                    </button>
                  </div>
                )}

                {contactAction === 'call' && (
                  <div>
                    <p className="text-pretty text-[14px] leading-6 text-[#8C857B]">פתיחת שיחה ישירה עם {barber.name}. המספר נשאר מוסתר עד לאישור ההתקשרות.</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <a
                        href={`tel:${DEMO_BARBER_PHONE.replaceAll('-', '')}`}
                        onClick={() => setCallStarted(true)}
                        className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[10px] bg-[#7A283D] px-5 text-[14px] font-semibold text-[#FFFDF8]"
                      >
                        <Phone className="size-4" aria-hidden="true" />
                        התקשר עכשיו
                      </a>
                      <span className="ltr-number tabular-nums text-[14px] text-[#F3EEE5]" dir="ltr">{DEMO_BARBER_PHONE}</span>
                    </div>
                    {callStarted && <p className="mt-3 text-[12px] text-[#C8F36A]">נפתח חייגן המכשיר.</p>}
                  </div>
                )}

                {contactAction === 'report' && (
                  <div>
                    {reportSent ? (
                      <div className="flex items-start gap-2 rounded-[10px] bg-[#C8F36A]/10 p-3 text-[13px] text-[#C8F36A]">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <span>הדיווח התקבל. צוות התמיכה עוקב אחר ההזמנה.</span>
                      </div>
                    ) : (
                      <>
                        <p className="mb-3 text-[13px] text-[#8C857B]">מה קרה?</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {REPORT_REASONS.map(reason => (
                            <button
                              key={reason}
                              type="button"
                              onClick={() => {
                                setReportReason(reason)
                                setReportError('')
                              }}
                              aria-pressed={reportReason === reason}
                              className="rounded-[10px] border border-[#3A3032] p-3 text-right text-[13px] text-[#8C857B] hover:border-[#7A283D] aria-[pressed=true]:border-[#7A283D] aria-[pressed=true]:bg-[#7A283D]/15 aria-[pressed=true]:text-[#F3EEE5]"
                            >
                              {reason}
                            </button>
                          ))}
                        </div>
                        {reportError && <p className="mt-2 text-[12px] text-[#C94B4B]">{reportError}</p>}
                        <button
                          type="button"
                          onClick={submitReport}
                          className="mt-3 h-[42px] rounded-[10px] bg-[#7A283D] px-5 text-[14px] font-semibold text-[#FFFDF8]"
                        >
                          שלח דיווח
                        </button>
                      </>
                    )}
                  </div>
                )}
              </section>
            )}

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
