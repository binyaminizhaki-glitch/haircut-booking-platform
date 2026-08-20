import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Home, Building2, Hotel, MapPin, LocateFixed, LoaderCircle } from 'lucide-react'
import BookingProgress from '../components/BookingProgress'
import { LocationMap } from '../components/ui/expanded-map'

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
  const initialDetectedLocation = state?.detectedLocation as { latitude: number; longitude: number } | undefined
  const [locType, setLocType] = useState('home')
  const [street, setStreet] = useState('')
  const [num, setNum] = useState('')
  const [city, setCity] = useState('')
  const [floor, setFloor] = useState('')
  const [apt, setApt] = useState('')
  const [timeOpt, setTimeOpt] = useState('now')
  const [coordinates, setCoordinates] = useState(initialDetectedLocation || { latitude: 32.0853, longitude: 34.7818 })
  const [usingCurrentLocation, setUsingCurrentLocation] = useState(Boolean(initialDetectedLocation))
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  const canContinue = usingCurrentLocation || Boolean(street && num && city)

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      return
    }

    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates({ latitude: coords.latitude, longitude: coords.longitude })
        setUsingCurrentLocation(true)
        setStreet('המיקום הנוכחי')
        setNum('GPS')
        setCity('המיקום שלך')
        setLocationStatus('idle')
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

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
        {/* Interactive location preview */}
        <section aria-labelledby="location-preview-title">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p id="location-preview-title" className="text-[14px] font-semibold text-[#181715]">
                נקודת ההגעה
              </p>
              <p className="mt-0.5 text-[12px] text-[#8C857B]">ודאו שהסיכה נמצאת באזור הנכון</p>
            </div>
            <span className="shrink-0 rounded-full bg-[#E9F9BF] px-2.5 py-1 text-[11px] font-semibold text-[#397458]">פריסה ארצית</span>
          </div>
          <LocationMap
            location={usingCurrentLocation ? 'המיקום הנוכחי שלך' : street || city ? `${street || 'רחוב'} ${num || ''}, ${city}` : 'בחרו כתובת בכל מקום בארץ'}
            latitude={coordinates.latitude}
            longitude={coordinates.longitude}
            zoom={15}
            defaultExpanded
          />
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locationStatus === 'loading'}
            className="mt-3 flex h-[46px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#7A283D]/25 bg-[#FFFDF8] text-[14px] font-semibold text-[#7A283D] transition-colors hover:bg-[#7A283D]/5 disabled:opacity-60"
          >
            {locationStatus === 'loading' ? <LoaderCircle size={17} className="animate-spin" /> : <LocateFixed size={17} />}
            {locationStatus === 'loading' ? 'מאתר את המיקום שלך...' : usingCurrentLocation ? 'המיקום שלך זוהה' : 'השתמש במיקום הנוכחי שלי'}
          </button>
          {locationStatus === 'error' && (
            <p className="mt-2 text-[12px] text-[#C94B4B]">לא הצלחנו לזהות מיקום. אפשר להזין כתובת ידנית מכל מקום בארץ.</p>
          )}
        </section>

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
              <input value={street} onChange={e => { setStreet(e.target.value); setUsingCurrentLocation(false) }} placeholder="שם הרחוב" className="w-full h-[44px] px-3 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[15px] focus:outline-none focus:border-[#7A283D]" />
            </div>
            <div>
              <label className="block text-[12px] text-[#8C857B] mb-1">מספר</label>
              <input value={num} onChange={e => { setNum(e.target.value); setUsingCurrentLocation(false) }} placeholder="12" className="w-full h-[44px] px-3 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[15px] focus:outline-none focus:border-[#7A283D]" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] text-[#8C857B] mb-1">עיר</label>
            <input value={city} onChange={e => { setCity(e.target.value); setUsingCurrentLocation(false) }} placeholder="עיר או יישוב" className="w-full h-[44px] px-3 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[15px] focus:outline-none focus:border-[#7A283D]" />
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
            <p className="text-[14px] font-semibold text-[#181715]">נציג ספרים זמינים באזור שלך</p>
            <p className="text-[12px] text-[#6D6860]">הזמינות וזמן ההגעה יחושבו לפי המיקום שבחרת</p>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 right-0 left-0 p-4 bg-[#FFFDF8] border-t border-[#D8D1C5] shadow-[0_-18px_50px_rgba(33,27,28,0.08)]">
        <button
          disabled={!canContinue}
          onClick={() => navigate('/book/style', { state: { ...state, address: { street, number: num, city, floor, apartment: apt, locationType: locType, coordinates: usingCurrentLocation ? coordinates : undefined }, timeOption: timeOpt } })}
          className="w-full h-[54px] bg-[#7A283D] disabled:opacity-40 text-[#FFFDF8] text-[16px] font-semibold rounded-[12px] hover:bg-[#5E1D2D] transition-colors"
        >
          המשך
        </button>
      </div>
    </div>
  )
}
