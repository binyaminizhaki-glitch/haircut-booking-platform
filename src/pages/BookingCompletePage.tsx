import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Heart, Check } from 'lucide-react'
import { store } from '../data/store'
import { mockBarbers } from '../data/mockData'
import { mockCutProfile } from '../data/mockData'

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => onChange(n)}>
          <Star size={24} className={n <= value ? 'text-[#7A283D] fill-[#7A283D]' : 'text-[#D8D1C5]'} />
        </button>
      ))}
    </div>
  )
}

export default function BookingCompletePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const booking = store.getBooking(id!)
  const barber = mockBarbers.find(b => b.id === booking?.barberId) || mockBarbers[0]

  const [resultRating, setResultRating] = useState(5)
  const [punctualityRating, setPunctualityRating] = useState(5)
  const [cleanlinessRating, setCleanlinessRating] = useState(5)
  const [communicationRating, setCommunicationRating] = useState(5)
  const [tip, setTip] = useState(0)
  const [saved, setSaved] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F3EEE5] flex flex-col items-center justify-center gap-5 text-center px-6">
        <div className="w-16 h-16 bg-[#E1F0E8] rounded-full flex items-center justify-center">
          <Check size={28} className="text-[#397458]" />
        </div>
        <h2 className="text-[24px] font-black text-[#181715]">תודה על הדירוג!</h2>
        <p className="text-[16px] text-[#6D6860]">הקאט שלך נשמר בפרופיל.</p>
        <button onClick={() => navigate('/app')} className="h-[52px] px-8 bg-[#7A283D] text-[#FFFDF8] font-semibold rounded-[12px]">
          חזור לבית
        </button>
        <button onClick={() => navigate('/book/service')} className="text-[#7A283D] font-semibold text-[14px]">
          קבע תספורת הבאה
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3EEE5] pb-24">
      <div className="bg-[#FFFDF8] border-b border-[#D8D1C5] px-4 py-4 max-w-2xl mx-auto">
        <h1 className="text-[20px] font-black text-[#181715]">התספורת הסתיימה</h1>
        <p className="text-[14px] text-[#6D6860]">איך הייתה החוויה עם {barber.name.split(' ')[0]}?</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
        {/* Barber summary */}
        <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-4 flex items-center gap-3">
          <div className="w-14 h-16 rounded-[10px] overflow-hidden bg-[#D8D1C5] shrink-0">
            <img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#181715]">{barber.name}</div>
            <div className="text-[13px] text-[#6D6860]">{booking ? new Date(booking.scheduledTime).toLocaleDateString('he-IL') : ''}</div>
          </div>
        </div>

        {/* Ratings */}
        <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-5 flex flex-col gap-4">
          {[
            { label: 'תוצאה', value: resultRating, onChange: setResultRating },
            { label: 'עמידה בזמנים', value: punctualityRating, onChange: setPunctualityRating },
            { label: 'ניקיון', value: cleanlinessRating, onChange: setCleanlinessRating },
            { label: 'תקשורת', value: communicationRating, onChange: setCommunicationRating },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-[#181715]">{r.label}</span>
              <StarRating value={r.value} onChange={r.onChange} />
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-4">
          <p className="text-[14px] font-semibold text-[#181715] mb-3">טיפ (אופציונלי)</p>
          <div className="flex gap-2">
            {[0, 10, 15, 20, 30].map(t => (
              <button
                key={t}
                onClick={() => setTip(t)}
                className={`flex-1 py-2.5 rounded-[10px] text-[14px] font-semibold border-2 transition-all ${
                  tip === t ? 'border-[#7A283D] bg-[#7A283D] text-[#FFFDF8]' : 'border-[#D8D1C5] text-[#6D6860]'
                }`}
              >
                {t === 0 ? 'ללא' : `${t} ₪`}
              </button>
            ))}
          </div>
        </div>

        {/* Cut profile photos */}
        <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-4">
          <p className="text-[14px] font-semibold text-[#181715] mb-3">תמונות תוצאה (לפרופיל הקאט)</p>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(mockCutProfile.photos).filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="aspect-square rounded-[10px] overflow-hidden bg-[#D8D1C5]">
                <img src={v} alt={k} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Save to profile */}
        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-3 p-4 rounded-[14px] border-2 transition-all ${
            saved ? 'border-[#7A283D] bg-[#FFFDF8]' : 'border-[#D8D1C5] bg-[#FFFDF8]'
          }`}
        >
          <Heart size={18} className={saved ? 'text-[#7A283D] fill-[#7A283D]' : 'text-[#8C857B]'} />
          <div className="text-right">
            <div className="text-[14px] font-semibold text-[#181715]">שמור לפרופיל הקאט</div>
            <div className="text-[12px] text-[#6D6860]">בפעם הבאה הספר יודע בדיוק מה לעשות</div>
          </div>
          {saved && <Check size={16} className="text-[#7A283D] mr-auto" />}
        </button>
      </div>

      <div className="fixed bottom-0 right-0 left-0 p-4 bg-[#FFFDF8] border-t border-[#D8D1C5]">
        <button
          onClick={() => { store.updateBooking(id!, { customerRating: { result: resultRating, punctuality: punctualityRating, cleanliness: cleanlinessRating, communication: communicationRating, tip, comment: '' } }); setSubmitted(true) }}
          className="w-full h-[54px] bg-[#7A283D] text-[#FFFDF8] text-[16px] font-semibold rounded-[12px] hover:bg-[#5E1D2D]"
        >
          שלח דירוג
        </button>
      </div>
    </div>
  )
}
