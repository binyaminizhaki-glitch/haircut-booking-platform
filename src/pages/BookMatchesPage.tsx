import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Star, Clock, Check, Shield } from 'lucide-react'
import BookingProgress from '../components/BookingProgress'
import { mockBarbers } from '../data/mockData'

const MATCHES = [
  { barberId: 'b1', tag: 'ההתאמה הטובה ביותר', matchPct: 94, arrival: 42, price: 179 },
  { barberId: 'b2', tag: 'המהיר ביותר', matchPct: 81, arrival: 28, price: 149 },
  { barberId: 'b6', tag: 'המחיר הטוב ביותר', matchPct: 87, arrival: 46, price: 159 },
]

export default function BookMatchesPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3EEE5] flex flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 rounded-full border-2 border-[#D8D1C5] border-t-[#7A283D] animate-spin" />
        </div>
        {/* Cut line animation */}
        <div className="w-48 h-[2px] bg-[#D8D1C5] relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 h-full w-16 bg-[#7A283D] animate-[slide_1.5s_ease-in-out_infinite]" style={{ animation: 'cutline 1.5s ease-in-out infinite' }} />
        </div>
        <h2 className="text-[22px] font-bold text-[#181715] mb-2">מחפשים את הספרים המתאימים ביותר</h2>
        <p className="text-[15px] text-[#6D6860]">בודקים סגנון, תיק עבודות ומרחק...</p>
        <style>{`@keyframes cutline { 0% { right: 100% } 100% { right: -33% } }`}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3EEE5] pb-24">
      <div className="sticky top-0 z-40 bg-[#FFFDF8] border-b border-[#D8D1C5]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 text-[#6D6860]"><ArrowRight size={20} /></button>
            <h1 className="text-[18px] font-bold text-[#181715]">הספרים המתאימים לך</h1>
          </div>
          <BookingProgress currentStep={3} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-[14px] text-[#6D6860] mb-5">מצאנו שלושה ספרים שמתאימים לקאט שביקשת</p>

        <div className="flex flex-col gap-4">
          {MATCHES.map(({ barberId, tag, matchPct, arrival, price }) => {
            const barber = mockBarbers.find(b => b.id === barberId)!
            const arrivalTime = new Date(Date.now() + arrival * 60 * 1000)
            const timeStr = arrivalTime.getHours() + ':' + arrivalTime.getMinutes().toString().padStart(2, '0')
            const isSelected = selected === barberId

            return (
              <div
                key={barberId}
                className={`bg-[#FFFDF8] rounded-[20px] border-2 overflow-hidden transition-all ${isSelected ? 'border-[#7A283D]' : 'border-[#D8D1C5]'}`}
              >
                {/* Tag */}
                <div className={`px-4 py-1.5 text-[12px] font-bold ${isSelected ? 'bg-[#7A283D] text-[#FFFDF8]' : 'bg-[#F3EEE5] text-[#6D6860]'}`}>
                  {tag}
                </div>

                <div className="p-4">
                  <div className="flex gap-3 mb-4">
                    {/* Portrait */}
                    <div className="w-16 h-20 rounded-[10px] overflow-hidden bg-[#D8D1C5] shrink-0">
                      <img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2 justify-end mb-0.5">
                        <span className="text-[11px] bg-[#E1F0E8] text-[#397458] px-1.5 py-0.5 rounded-[4px] font-medium flex items-center gap-1">
                          <Shield size={10} /> מאומת
                        </span>
                        <h3 className="text-[17px] font-black text-[#181715]">{barber.name}</h3>
                      </div>
                      <p className="text-[13px] text-[#6D6860] mb-2">{barber.specialties.slice(0, 2).join(' · ')}</p>

                      <div className="flex items-center gap-3 justify-end">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-[#7A283D] fill-[#7A283D]" />
                          <span className="text-[13px] font-semibold text-[#181715]">{barber.rating}</span>
                          <span className="text-[11px] text-[#8C857B]">({barber.completedBookings} תספורות)</span>
                        </div>
                      </div>
                    </div>

                    {/* Match % */}
                    <div className="flex flex-col items-center justify-center w-14 shrink-0">
                      <div className="text-[22px] font-black text-[#7A283D]">{matchPct}%</div>
                      <div className="text-[10px] text-[#8C857B]">התאמה</div>
                    </div>
                  </div>

                  {/* Portfolio strip */}
                  <div className="flex gap-1.5 mb-4">
                    {barber.portfolio.slice(0, 3).map(p => (
                      <div key={p.id} className="w-16 h-16 rounded-[8px] overflow-hidden bg-[#D8D1C5] shrink-0">
                        <img src={p.imageUrl} alt={p.style} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="text-[12px] text-[#8C857B] flex items-center mr-1">עבודות דומות</div>
                  </div>

                  {/* Arrival + price */}
                  <div className="flex items-center justify-between py-3 border-t border-[#D8D1C5]">
                    <div className="flex items-center gap-1.5 text-[13px] text-[#6D6860]">
                      <Clock size={13} />
                      מגיע בעוד {arrival} דקות · {timeStr}
                    </div>
                    <span className="text-[22px] font-black text-[#181715]">{price} ₪</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => navigate(`/barbers/${barberId}`, { state: { ...state, matchBarberId: barberId, price, arrival } })}
                      className="flex-1 h-[44px] border border-[#D8D1C5] text-[#181715] text-[14px] font-semibold rounded-[10px] hover:bg-[#F3EEE5] transition-colors"
                    >
                      פרופיל
                    </button>
                    <button
                      onClick={() => {
                        setSelected(barberId)
                        setTimeout(() => navigate('/book/summary', { state: { ...state, barberId, price, arrival, arrivalTime: timeStr } }), 150)
                      }}
                      className="flex-1 h-[44px] bg-[#7A283D] text-[#FFFDF8] text-[14px] font-semibold rounded-[10px] hover:bg-[#5E1D2D] transition-colors flex items-center justify-center gap-1.5"
                    >
                      {isSelected && <Check size={15} />}
                      {isSelected ? 'נבחר' : `בחר את ${barber.name.split(' ')[0]}`}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
