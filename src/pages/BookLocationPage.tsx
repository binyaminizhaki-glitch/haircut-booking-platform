import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Home, Building2, Hotel, MapPin } from 'lucide-react'
import BookingProgress from '../components/BookingProgress'
import JerusalemMap from '../components/JerusalemMap'

const locationTypes = [
  { id: 'home', label: 'בית', icon: Home },
  { id: 'office', label: 'משרד', icon: Building2 },
  { id: 'hotel', label: 'מלון', icon: Hotel },
  { id: 'other', label: 'כתובת אחרת', icon: MapPin },
]

const timeOptions = [
  { id: 'now', label: 'הכי מוקדם', sub: 'בעוד ~38 דקות', fee: true },
  { id: '90min', label: 'בתוך 90 דקות', sub: 'עד 11:45', fee: false },
  { id: 'evening', label: 'הערב', sub: '19:00–22:00', fee: false },
  { id: 'custom', label: 'בחירת שעה', sub: 'בחר מועד', fee: false },
]

export default function BookLocationPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [locType, setLocType] = useState('home')
  const [street, setStreet] = useState('רחוב עזה')
  const [num, setNum] = useState('32')
  const [city, setCity] = useState('ירושלים')
  const [floor, setFloor] = useState('')
  const [apt, setApt] = useState('')
  const [timeOpt, setTimeOpt] = useState('now')

  const canContinue = street && num && city

  return (
    <div className="min-h-screen bg-[#F3EEE5] pb-24">
      <div className="sticky top-0 z-40 bg-[#FFFDF8] border-b border-[#D8D1C5]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/book/service')} className="p-2 text-[#6D6860]">
              <ArrowRight size={20} />
            </button>
            <h1 className="text-[18px] font-bold text-[#181715]">מיקום וזמן</h1>
          </div>
          <BookingProgress currentStep={1} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Map */}
        <div className="h-[180px] rounded-[16px] overflow-hidden">
          <JerusalemMap dark={false} showRoute={false} className="rounded-[16px]" />
        </div>

        {/* Location type */}
        <div>
          <p className="text-[14px] font-semibold text-[#6D6860] mb-3">סוג המיקום</p>
          <div className="grid grid-cols-4 gap-2">
            {locationTypes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setLocType(id)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-[12px] border transition-all ${
                  locType === id ? 'border-[#7A283D] bg-[#FFFDF8]' : 'border-[#D8D1C5] bg-[#FFFDF8]'
                }`}
              >
                <Icon size={18} className={locType === id ? 'text-[#7A283D]' : 'text-[#8C857B]'} />
                <span className={`text-[12px] font-medium ${locType === id ? 'text-[#7A283D]' : 'text-[#6D6860]'}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Address fields */}
        <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-4 flex flex-col gap-3">
          <p className="text-[14px] font-semibold text-[#181715]">כתובת</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-[12px] text-[#8C857B] mb-1">רחוב</label>
              <input value={street} onChange={e => setStreet(e.target.value)} className="w-full h-[44px] px-3 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[15px] focus:outline-none focus:border-[#7A283D]" />
            </div>
            <div>
              <label className="block text-[12px] text-[#8C857B] mb-1">מספר</label>
              <input value={num} onChange={e => setNum(e.target.value)} className="w-full h-[44px] px-3 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[15px] focus:outline-none focus:border-[#7A283D]" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] text-[#8C857B] mb-1">עיר</label>
            <input value={city} onChange={e => setCity(e.target.value)} className="w-full h-[44px] px-3 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[15px] focus:outline-none focus:border-[#7A283D]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#8C857B] mb-1">קומה (אופציונלי)</label>
              <input value={floor} onChange={e => setFloor(e.target.value)} placeholder="3" className="w-full h-[44px] px-3 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[15px] focus:outline-none focus:border-[#7A283D]" />
            </div>
            <div>
              <label className="block text-[12px] text-[#8C857B] mb-1">דירה (אופציונלי)</label>
              <input value={apt} onChange={e => setApt(e.target.value)} placeholder="12" className="w-full h-[44px] px-3 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[15px] focus:outline-none focus:border-[#7A283D]" />
            </div>
          </div>
        </div>

        {/* Time */}
        <div>
          <p className="text-[14px] font-semibold text-[#6D6860] mb-3">מתי?</p>
          <div className="flex flex-col gap-2">
            {timeOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setTimeOpt(opt.id)}
                className={`flex items-center justify-between p-4 rounded-[14px] border-2 transition-all ${
                  timeOpt === opt.id ? 'border-[#7A283D] bg-[#FFFDF8]' : 'border-[#D8D1C5] bg-[#FFFDF8]'
                }`}
              >
                <div className="text-right">
                  <div className={`text-[15px] font-semibold ${timeOpt === opt.id ? 'text-[#181715]' : 'text-[#6D6860]'}`}>{opt.label}</div>
                  <div className="text-[13px] text-[#8C857B]">{opt.sub}</div>
                </div>
                {opt.fee && (
                  <span className="text-[12px] text-[#D97855] bg-[#F9E9D7] px-2 py-0.5 rounded-[6px] font-medium">+30 ₪ דמי מיידיות</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Availability indicator */}
        <div className="flex items-center gap-3 bg-[#E9F9BF] rounded-[12px] px-4 py-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#397458] shrink-0" />
          <div>
            <p className="text-[14px] font-semibold text-[#181715]">4 ספרים זמינים באזור שלך</p>
            <p className="text-[12px] text-[#6D6860]">ההגעה הקרובה ביותר בעוד 38 דקות</p>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 right-0 left-0 p-4 bg-[#FFFDF8] border-t border-[#D8D1C5] shadow-[0_-18px_50px_rgba(33,27,28,0.08)]">
        <button
          disabled={!canContinue}
          onClick={() => navigate('/book/style', { state: { ...state, address: { street, number: num, city, floor, apartment: apt, locationType: locType }, timeOption: timeOpt } })}
          className="w-full h-[54px] bg-[#7A283D] disabled:opacity-40 text-[#FFFDF8] text-[16px] font-semibold rounded-[12px] hover:bg-[#5E1D2D] transition-colors"
        >
          המשך
        </button>
      </div>
    </div>
  )
}
