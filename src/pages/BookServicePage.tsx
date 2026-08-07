import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ArrowRight, Clock, Check } from 'lucide-react'
import BookingProgress from '../components/BookingProgress'
import { mockServices } from '../data/mockData'

export default function BookServicePage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#F3EEE5]">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#FFFDF8] border-b border-[#D8D1C5]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/')} className="p-2 text-[#6D6860] hover:text-[#181715]">
              <ArrowRight size={20} />
            </button>
            <h1 className="text-[18px] font-bold text-[#181715]">בחרו שירות</h1>
          </div>
          <BookingProgress currentStep={0} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-3">
          {mockServices.map(service => (
            <button
              key={service.id}
              onClick={() => { setSelected(service.id); setTimeout(() => navigate('/book/location', { state: { serviceId: service.id } }), 150) }}
              className={`w-full rounded-[18px] overflow-hidden border-2 transition-all text-right ${
                selected === service.id ? 'border-[#7A283D]' : 'border-transparent bg-[#FFFDF8]'
              }`}
            >
              <div className="flex gap-0">
                <div className="w-28 h-28 shrink-0 overflow-hidden">
                  <img src={service.imageUrl} alt={service.nameHe} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="text-[17px] font-bold text-[#181715]">{service.nameHe}</h3>
                      <p className="text-[13px] text-[#6D6860] leading-[1.5] mt-0.5">{service.description}</p>
                    </div>
                    {selected === service.id && (
                      <div className="w-6 h-6 bg-[#7A283D] rounded-full flex items-center justify-center shrink-0 mr-1">
                        <Check size={13} className="text-[#FFFDF8]" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[17px] font-black text-[#181715]">מ-{service.scheduledPrice} ₪</span>
                    <div className="flex items-center gap-1 text-[12px] text-[#8C857B]">
                      <Clock size={12} />
                      {service.durationMinutes} דקות
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8F36A]" />
                      <span className="text-[11px] text-[#6D6860]">זמין</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile sticky CTA */}
      {selected && (
        <div className="fixed bottom-0 right-0 left-0 p-4 bg-[#FFFDF8] border-t border-[#D8D1C5] shadow-[0_-18px_50px_rgba(33,27,28,0.08)]">
          <button
            onClick={() => navigate('/book/location', { state: { serviceId: selected } })}
            className="w-full h-[54px] bg-[#7A283D] text-[#FFFDF8] text-[16px] font-semibold rounded-[12px] hover:bg-[#5E1D2D] transition-colors"
          >
            המשך
          </button>
        </div>
      )}
    </div>
  )
}
