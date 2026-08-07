import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Star, Shield, Check, Clock, MapPin } from 'lucide-react'
import { mockBarbers } from '../data/mockData'

export default function BarberProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state } = useLocation()
  const barber = mockBarbers.find(b => b.id === id) || mockBarbers[0]
  const [activeFilter, setActiveFilter] = useState('הכול')

  const filters = ['הכול', 'Fade', 'זקן', 'קלאסי', 'ילדים']
  const filteredPortfolio = activeFilter === 'הכול'
    ? barber.portfolio
    : barber.portfolio.filter(p => p.tags.some(t => activeFilter.toLowerCase().includes(t.toLowerCase()) || t.includes(activeFilter)))

  return (
    <div className="min-h-screen bg-[#F3EEE5] pb-24">
      {/* Sticky top */}
      <div className="sticky top-0 z-40 bg-[#FFFDF8] border-b border-[#D8D1C5] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 text-[#6D6860]"><ArrowRight size={20} /></button>
        <span className="text-[16px] font-bold text-[#181715]">{barber.name}</span>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Portrait */}
        <div className="relative h-[360px] overflow-hidden">
          <img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F3EEE5] via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 left-0 p-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#E1F0E8] text-[#397458] text-[11px] font-bold px-2 py-0.5 rounded-[5px] flex items-center gap-1">
                    <Shield size={10} /> מאומת
                  </span>
                </div>
                <h1 className="text-[28px] font-black text-[#181715]">{barber.name}</h1>
                <p className="text-[14px] text-[#6D6860]">{barber.neighbourhood} · {barber.yearsExperience} שנות ניסיון</p>
              </div>
              <div className="text-left">
                <div className="text-[26px] font-black text-[#181715]">{barber.rating}</div>
                <div className="flex justify-end">
                  {[1,2,3,4,5].map(n => <Star key={n} size={12} className={n <= Math.round(barber.rating) ? 'text-[#7A283D] fill-[#7A283D]' : 'text-[#D8D1C5]'} />)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 flex flex-col gap-5">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'הזמנות', value: barber.completedBookings },
              { label: 'אמינות הגעה', value: `${barber.arrivalReliability}%` },
              { label: 'ניקיון', value: barber.cleanlinessRating },
              { label: 'תוצאה', value: barber.relevantRating },
            ].map(s => (
              <div key={s.label} className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[12px] p-3 text-center">
                <div className="text-[18px] font-black text-[#181715]">{s.value}</div>
                <div className="text-[11px] text-[#8C857B]">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div>
            <p className="text-[15px] text-[#6D6860] leading-[1.7]">{barber.bio}</p>
          </div>

          {/* Specialties */}
          <div>
            <p className="text-[13px] font-semibold text-[#8C857B] mb-2">התמחויות</p>
            <div className="flex flex-wrap gap-2">
              {barber.specialties.map(s => (
                <span key={s} className="px-3 py-1.5 bg-[#FFFDF8] border border-[#D8D1C5] rounded-[8px] text-[13px] text-[#181715] font-medium">{s}</span>
              ))}
            </div>
          </div>

          {/* Languages + Area */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[14px] p-3">
              <p className="text-[11px] text-[#8C857B] mb-1.5">שפות</p>
              <div className="flex flex-wrap gap-1">
                {barber.languages.map(l => <span key={l} className="text-[13px] text-[#181715] font-medium">{l}</span>).reduce((acc, el, i) => i < barber.languages.length - 1 ? [...acc, el, <span key={`sep${i}`} className="text-[#D8D1C5]">, </span>] : [...acc, el], [] as React.ReactNode[])}
              </div>
            </div>
            <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[14px] p-3">
              <p className="text-[11px] text-[#8C857B] mb-1.5">אזורים</p>
              <p className="text-[12px] text-[#181715] font-medium">{barber.serviceAreas.slice(0, 2).join(', ')}</p>
            </div>
          </div>

          {/* Portfolio */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[15px] font-bold text-[#181715]">תיק עבודות</p>
            </div>
            <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`shrink-0 px-3 py-1.5 rounded-[8px] text-[13px] font-medium border transition-all ${
                    activeFilter === f ? 'bg-[#7A283D] text-[#FFFDF8] border-[#7A283D]' : 'bg-[#FFFDF8] text-[#6D6860] border-[#D8D1C5]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {filteredPortfolio.map(p => (
                <div key={p.id} className="aspect-square rounded-[10px] overflow-hidden bg-[#D8D1C5]">
                  <img src={p.imageUrl} alt={p.style} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          {barber.reviews.length > 0 && (
            <div>
              <p className="text-[15px] font-bold text-[#181715] mb-3">ביקורות</p>
              <div className="flex flex-col gap-3">
                {barber.reviews.map(r => (
                  <div key={r.id} className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[14px] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] font-semibold text-[#181715]">{r.customerName}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(n => <Star key={n} size={12} className={n <= r.overallRating ? 'text-[#7A283D] fill-[#7A283D]' : 'text-[#D8D1C5]'} />)}
                      </div>
                    </div>
                    {r.comment && <p className="text-[13px] text-[#6D6860]">{r.comment}</p>}
                    <p className="text-[11px] text-[#8C857B] mt-1.5">{r.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipment */}
          <div>
            <p className="text-[13px] font-semibold text-[#8C857B] mb-2">ציוד</p>
            <div className="flex flex-col gap-1">
              {barber.equipment.map(e => (
                <div key={e} className="flex items-center gap-2">
                  <Check size={13} className="text-[#7A283D] shrink-0" />
                  <span className="text-[13px] text-[#6D6860]">{e}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next availability */}
          <div className="bg-[#E9F9BF] rounded-[14px] p-4 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#397458] shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-[#181715]">זמין {barber.nextAvailable}</p>
              <p className="text-[12px] text-[#6D6860]">הגעה בעוד {barber.arrivalMinutes} דקות</p>
            </div>
            <span className="text-[22px] font-black text-[#181715] mr-auto">{state?.price || barber.basePrice} ₪</span>
          </div>
        </div>
      </div>

      {/* Sticky book button */}
      <div className="fixed bottom-0 right-0 left-0 p-4 bg-[#FFFDF8] border-t border-[#D8D1C5]">
        <button
          onClick={() => navigate('/book/summary', { state: { ...state, barberId: barber.id, price: state?.price || barber.basePrice, arrival: state?.arrival || barber.arrivalMinutes, arrivalTime: state?.arrivalTime } })}
          className="w-full h-[54px] bg-[#7A283D] text-[#FFFDF8] text-[16px] font-semibold rounded-[12px] hover:bg-[#5E1D2D] transition-colors"
        >
          בחר את {barber.name.split(' ')[0]} · {state?.price || barber.basePrice} ₪
        </button>
      </div>
    </div>
  )
}
