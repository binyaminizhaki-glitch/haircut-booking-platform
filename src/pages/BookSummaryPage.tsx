import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, CreditCard, Smartphone, Check, X, AlertCircle, Users } from 'lucide-react'
import BookingProgress from '../components/BookingProgress'
import { mockBarbers, mockServices } from '../data/mockData'
import { store } from '../data/store'
import type { Booking } from '../data/types'

type PayStep = 'summary' | 'group' | 'payment' | 'processing' | 'success' | 'failed'

export default function BookSummaryPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [step, setStep] = useState<PayStep>('summary')
  const [payMethod, setPayMethod] = useState<'card' | 'apple' | 'google' | 'bit'>('card')
  const [cardNum, setCardNum] = useState('')
  const [groupChoice, setGroupChoice] = useState<'solo' | 'plus1' | 'group'>('solo')
  const [failCount, setFailCount] = useState(0)

  const barber = mockBarbers.find(b => b.id === state?.barberId) || mockBarbers[0]
  const service = mockServices.find(s => s.id === state?.serviceId) || mockServices[1]
  const isImmediate = state?.timeOption === 'now'
  const urgencyFee = isImmediate ? 30 : 0
  const groupDiscount = groupChoice === 'plus1' ? Math.round(state?.price * 0.22) : groupChoice === 'group' ? Math.round(state?.price * 0.33) : 0
  const finalPrice = (state?.price || service.scheduledPrice) + urgencyFee - groupDiscount

  const handlePay = () => {
    setStep('processing')
    setTimeout(() => {
      if (failCount === 0 && Math.random() < 0.2) {
        setFailCount(1)
        setStep('failed')
      } else {
        // Create booking
        const bookingId = store.generateId()
        const now = new Date()
        const arrivalTime = new Date(now.getTime() + (state?.arrival || 42) * 60 * 1000)
        const timeStr = arrivalTime.getHours() + ':' + arrivalTime.getMinutes().toString().padStart(2, '0')

        const booking: Booking = {
          id: bookingId,
          customerId: 'demo_customer',
          barberId: barber.id,
          serviceId: service.id,
          address: state?.address || { street: 'רחוב עזה', number: '32', city: 'ירושלים', locationType: 'home' },
          scheduledTime: arrivalTime.toISOString(),
          status: 'requested',
          haircutBrief: state?.haircutBrief || { option: 'repeat' },
          servicePrice: state?.price || service.scheduledPrice,
          arrivalFee: 0,
          urgencyFee,
          groupDiscount,
          finalPrice,
          estimatedArrivalMinutes: state?.arrival || 42,
          estimatedArrivalTime: timeStr,
          estimatedDuration: service.durationMinutes,
          isImmediate,
          createdAt: now.toISOString(),
        }
        store.createBooking(booking)
        setStep('success')
        setTimeout(() => navigate(`/booking/${bookingId}`), 1500)
      }
    }, 2000)
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-[#F3EEE5] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-full border-2 border-[#D8D1C5] border-t-[#7A283D] animate-spin" />
        <p className="text-[18px] font-semibold text-[#181715]">מעבד תשלום...</p>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#F3EEE5] flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-16 h-16 bg-[#E1F0E8] rounded-full flex items-center justify-center">
          <Check size={28} className="text-[#397458]" />
        </div>
        <h2 className="text-[24px] font-black text-[#181715]">ההזמנה אושרה</h2>
        <p className="text-[16px] text-[#6D6860]">מעביר אותך לעמוד ההזמנה...</p>
      </div>
    )
  }

  if (step === 'failed') {
    return (
      <div className="min-h-screen bg-[#F3EEE5] flex flex-col items-center justify-center gap-5 text-center px-6">
        <div className="w-16 h-16 bg-[#F8E2E2] rounded-full flex items-center justify-center">
          <X size={28} className="text-[#C94B4B]" />
        </div>
        <h2 className="text-[22px] font-black text-[#181715]">התשלום נכשל</h2>
        <p className="text-[15px] text-[#6D6860]">נסה שוב עם כרטיס אחר או בחר שיטת תשלום אחרת.</p>
        <button onClick={() => setStep('payment')} className="h-[52px] px-8 bg-[#7A283D] text-[#FFFDF8] font-semibold rounded-[12px]">
          נסה שוב
        </button>
        <button onClick={() => navigate('/book/matches')} className="text-[14px] text-[#6D6860]">
          חזור לבחירת ספר
        </button>
      </div>
    )
  }

  if (step === 'group') {
    return (
      <div className="min-h-screen bg-[#F3EEE5] pb-24">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h2 className="text-[24px] font-black text-[#181715] mb-2">יש עוד מישהו שרוצה להסתפר?</h2>
          <p className="text-[15px] text-[#6D6860] mb-6">הוסף משתתפים לאותה הזמנה וקבלו מחיר קבוצתי.</p>

          <div className="flex flex-col gap-3 mb-6">
            {[
              { id: 'solo', label: 'רק אני', sub: `${state?.price || service.scheduledPrice} ₪`, discount: '' },
              { id: 'plus1', label: 'אני ועוד אדם', sub: `${Math.round((state?.price || service.scheduledPrice) * 0.78)} ₪ לאדם`, discount: 'חיסכון 22%' },
              { id: 'group', label: 'קבוצה (3+)', sub: `${Math.round((state?.price || service.scheduledPrice) * 0.67)} ₪ לאדם`, discount: 'חיסכון 33%' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setGroupChoice(opt.id as any)}
                className={`flex items-center justify-between p-4 rounded-[14px] border-2 transition-all ${
                  groupChoice === opt.id ? 'border-[#7A283D] bg-[#FFFDF8]' : 'border-[#D8D1C5] bg-[#FFFDF8]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#6D6860]" />
                  <div className="text-right">
                    <div className="text-[15px] font-semibold text-[#181715]">{opt.label}</div>
                    <div className="text-[13px] text-[#6D6860]">{opt.sub}</div>
                  </div>
                </div>
                {opt.discount && <span className="text-[12px] text-[#397458] bg-[#E1F0E8] px-2 py-0.5 rounded-[6px] font-semibold">{opt.discount}</span>}
              </button>
            ))}
          </div>

          {groupChoice !== 'solo' && (
            <div className="bg-[#E9F9BF] rounded-[12px] px-4 py-3 mb-6 flex items-center gap-2">
              <span className="text-[13px] text-[#181715]">שלח קישור: <strong>CUTNOW.co.il/join/ABC123</strong></span>
            </div>
          )}

          <button onClick={() => setStep('payment')} className="w-full h-[54px] bg-[#7A283D] text-[#FFFDF8] text-[16px] font-semibold rounded-[12px]">
            המשך לתשלום
          </button>
        </div>
      </div>
    )
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-[#F3EEE5] pb-24">
        <div className="sticky top-0 z-40 bg-[#FFFDF8] border-b border-[#D8D1C5] px-4 py-4 flex items-center gap-3 max-w-2xl mx-auto">
          <button onClick={() => setStep('summary')} className="p-2 text-[#6D6860]"><ArrowRight size={20} /></button>
          <h1 className="text-[18px] font-bold text-[#181715]">תשלום</h1>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
          <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[14px] text-[#6D6860]">{service.nameHe}</span>
              <span className="text-[14px] font-semibold text-[#181715]">{state?.price || service.scheduledPrice} ₪</span>
            </div>
            {urgencyFee > 0 && <div className="flex justify-between items-center mb-1"><span className="text-[14px] text-[#6D6860]">דמי מיידיות</span><span className="text-[14px] font-semibold text-[#D97855]">+{urgencyFee} ₪</span></div>}
            {groupDiscount > 0 && <div className="flex justify-between items-center mb-1"><span className="text-[14px] text-[#6D6860]">הנחה קבוצתית</span><span className="text-[14px] font-semibold text-[#397458]">-{groupDiscount} ₪</span></div>}
            <div className="h-[1px] bg-[#D8D1C5] my-3" />
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-bold text-[#181715]">סה"כ לתשלום</span>
              <span className="text-[22px] font-black text-[#181715]">{finalPrice} ₪</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'card', icon: CreditCard, label: 'כרטיס' },
              { id: 'apple', icon: Smartphone, label: 'Apple Pay' },
              { id: 'google', icon: Smartphone, label: 'Google' },
              { id: 'bit', icon: Smartphone, label: 'Bit' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setPayMethod(id as any)}
                className={`p-3 rounded-[12px] border-2 flex flex-col items-center gap-1 transition-all ${
                  payMethod === id ? 'border-[#7A283D] bg-[#FFFDF8]' : 'border-[#D8D1C5] bg-[#FFFDF8]'
                }`}
              >
                <Icon size={18} className={payMethod === id ? 'text-[#7A283D]' : 'text-[#8C857B]'} />
                <span className="text-[11px] text-[#6D6860]">{label}</span>
              </button>
            ))}
          </div>

          {payMethod === 'card' && (
            <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-4 flex flex-col gap-3">
              <div>
                <label className="block text-[12px] text-[#8C857B] mb-1.5">מספר כרטיס</label>
                <input
                  value={cardNum}
                  onChange={e => setCardNum(e.target.value.replace(/\D/g, '').slice(0, 16))}
                  placeholder="0000 0000 0000 0000"
                  className="w-full h-[46px] px-3 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[15px] text-[#181715] focus:outline-none focus:border-[#7A283D] ltr-number"
                  dir="ltr"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] text-[#8C857B] mb-1.5">תוקף</label>
                  <input placeholder="MM/YY" className="w-full h-[46px] px-3 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[15px] focus:outline-none focus:border-[#7A283D]" dir="ltr" />
                </div>
                <div>
                  <label className="block text-[12px] text-[#8C857B] mb-1.5">CVV</label>
                  <input placeholder="000" className="w-full h-[46px] px-3 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[15px] focus:outline-none focus:border-[#7A283D]" dir="ltr" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#8C857B]">
                <AlertCircle size={13} className="text-[#7A283D]" />
                זהו ממשק הדגמה — אין עיבוד אמיתי של כרטיסים
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 right-0 left-0 p-4 bg-[#FFFDF8] border-t border-[#D8D1C5]">
          <button onClick={handlePay} className="w-full h-[54px] bg-[#7A283D] text-[#FFFDF8] text-[16px] font-semibold rounded-[12px] hover:bg-[#5E1D2D] transition-colors">
            שלם {finalPrice} ₪
          </button>
        </div>
      </div>
    )
  }

  // Summary step
  return (
    <div className="min-h-screen bg-[#F3EEE5] pb-24">
      <div className="sticky top-0 z-40 bg-[#FFFDF8] border-b border-[#D8D1C5]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 text-[#6D6860]"><ArrowRight size={20} /></button>
            <h1 className="text-[18px] font-bold text-[#181715]">סיכום הזמנה</h1>
          </div>
          <BookingProgress currentStep={4} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
        {/* Barber */}
        <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-16 rounded-[10px] overflow-hidden bg-[#D8D1C5] shrink-0">
              <img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-right">
              <div className="text-[16px] font-bold text-[#181715]">{barber.name}</div>
              <div className="text-[13px] text-[#6D6860]">{service.nameHe}</div>
              <div className="text-[13px] text-[#6D6860] mt-1">מגיע בעוד {state?.arrival || 42} דקות · {state?.arrivalTime || '19:42'}</div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-4">
          {[
            ['שירות', service.nameHe],
            ['כתובת', `${state?.address?.street || 'רחוב עזה'} ${state?.address?.number || '32'}, ${state?.address?.city || 'ירושלים'}`],
            ['זמן הגעה', `${state?.arrival || 42} דקות · ${state?.arrivalTime || '19:42'}`],
            ['משך שירות', `${service.durationMinutes} דקות`],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-b border-[#D8D1C5] last:border-0">
              <span className="text-[13px] text-[#8C857B]">{k}</span>
              <span className="text-[14px] font-medium text-[#181715]">{v}</span>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-4">
          <div className="flex justify-between py-2 border-b border-[#D8D1C5]">
            <span className="text-[13px] text-[#8C857B]">{service.nameHe}</span>
            <span className="text-[14px] font-medium text-[#181715]">{state?.price || service.scheduledPrice} ₪</span>
          </div>
          {urgencyFee > 0 && (
            <div className="flex justify-between py-2 border-b border-[#D8D1C5]">
              <span className="text-[13px] text-[#8C857B]">דמי מיידיות</span>
              <span className="text-[14px] font-medium text-[#D97855]">+{urgencyFee} ₪</span>
            </div>
          )}
          <div className="flex justify-between pt-3">
            <span className="text-[15px] font-bold text-[#181715]">סה"כ</span>
            <span className="text-[22px] font-black text-[#181715]">{finalPrice} ₪</span>
          </div>
        </div>

        {/* Cancellation */}
        <p className="text-[12px] text-[#8C857B] text-center">
          ביטול חינם עד 30 דקות לפני ההגעה. אחרי כן — עלות ביטול של 30 ₪.
        </p>
      </div>

      <div className="fixed bottom-0 right-0 left-0 p-4 bg-[#FFFDF8] border-t border-[#D8D1C5]">
        <button onClick={() => setStep('group')} className="w-full h-[54px] bg-[#7A283D] text-[#FFFDF8] text-[16px] font-semibold rounded-[12px] hover:bg-[#5E1D2D] transition-colors">
          המשך לתשלום
        </button>
      </div>
    </div>
  )
}
