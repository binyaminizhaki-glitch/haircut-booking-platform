import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Upload, X, RotateCcw } from 'lucide-react'
import BookingProgress from '../components/BookingProgress'
import { mockCutProfile, HAIRCUT_PHOTOS } from '../data/mockData'

const hairTypes = ['ישר', 'גלי', 'מתולתל', 'אפרו', 'עבה', 'דק']
const fadeHeights = ['Skin', 'Low', 'Mid', 'High', 'ללא פייד']
const sideLengths = ['0', '0.5', '1', '1.5', '2', '3', '4']
const topLengths = ['2 ס"מ', '3 ס"מ', '4 ס"מ', '5 ס"מ', '6 ס"מ', '7+ ס"מ']

export default function BookStylePage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [option, setOption] = useState<'repeat' | 'upload' | 'catalog' | 'barber_choice'>('repeat')
  const [uploadedImg, setUploadedImg] = useState<string | null>(null)
  const [hairType, setHairType] = useState('מתולתל')
  const [fadeHeight, setFadeHeight] = useState('Low')
  const [topLength, setTopLength] = useState('4 ס"מ')
  const [beard, setBeard] = useState('6 מ"מ')
  const [notes, setNotes] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setUploadedImg(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const brief = { option, imageUrl: uploadedImg || undefined, hairType, fadeHeight, topLength, beard, notes }

  return (
    <div className="min-h-screen bg-[#F3EEE5] pb-24">
      <div className="sticky top-0 z-40 bg-[#FFFDF8] border-b border-[#D8D1C5]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 text-[#6D6860]"><ArrowRight size={20} /></button>
            <h1 className="text-[18px] font-bold text-[#181715]">סגנון התספורת</h1>
          </div>
          <BookingProgress currentStep={2} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
        {/* Option selector */}
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: 'repeat', label: 'חזור על האחרונה', sub: mockCutProfile.name },
            { id: 'upload', label: 'העלה תמונת השראה', sub: 'מהגלריה שלך' },
            { id: 'catalog', label: 'בחר מהקטלוג', sub: 'סגנונות מוצעים' },
            { id: 'barber_choice', label: 'הספר יחליט', sub: 'תאר בקצרה' },
          ] as const).map(opt => (
            <button
              key={opt.id}
              onClick={() => setOption(opt.id)}
              className={`p-4 rounded-[14px] border-2 text-right transition-all ${
                option === opt.id ? 'border-[#7A283D] bg-[#FFFDF8]' : 'border-[#D8D1C5] bg-[#FFFDF8]'
              }`}
            >
              <div className={`text-[14px] font-semibold ${option === opt.id ? 'text-[#7A283D]' : 'text-[#181715]'}`}>{opt.label}</div>
              <div className="text-[12px] text-[#8C857B] mt-0.5">{opt.sub}</div>
            </button>
          ))}
        </div>

        {/* Repeat last cut */}
        {option === 'repeat' && (
          <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-4">
            <p className="text-[14px] font-bold text-[#181715] mb-3">{mockCutProfile.name}</p>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {Object.entries(mockCutProfile.photos).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="aspect-square rounded-[10px] overflow-hidden bg-[#D8D1C5]">
                  <img src={v} alt={k} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-right">
              <div><span className="text-[11px] text-[#8C857B]">פייד </span><span className="text-[13px] font-semibold text-[#181715]">{mockCutProfile.fadeHeight}</span></div>
              <div><span className="text-[11px] text-[#8C857B]">צדדים </span><span className="text-[13px] font-semibold text-[#181715]">{mockCutProfile.sideLength}</span></div>
              <div><span className="text-[11px] text-[#8C857B]">למעלה </span><span className="text-[13px] font-semibold text-[#181715]">{mockCutProfile.topLength}</span></div>
              <div><span className="text-[11px] text-[#8C857B]">זקן </span><span className="text-[13px] font-semibold text-[#181715]">{mockCutProfile.beardLength}</span></div>
            </div>
          </div>
        )}

        {/* Upload */}
        {option === 'upload' && (
          <div>
            {uploadedImg ? (
              <div className="relative rounded-[18px] overflow-hidden aspect-[4/3]">
                <img src={uploadedImg} alt="תמונת השראה" className="w-full h-full object-cover" />
                <button
                  onClick={() => setUploadedImg(null)}
                  className="absolute top-3 left-3 w-8 h-8 bg-[#FFFDF8] rounded-full flex items-center justify-center shadow"
                >
                  <X size={15} />
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute top-3 right-3 w-8 h-8 bg-[#FFFDF8] rounded-full flex items-center justify-center shadow"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full aspect-[4/3] border-2 border-dashed border-[#BDB4A7] rounded-[18px] flex flex-col items-center justify-center gap-3 hover:border-[#7A283D] hover:bg-[#FFFDF8] transition-all"
              >
                <Upload size={28} className="text-[#8C857B]" />
                <span className="text-[15px] text-[#6D6860] font-medium">לחץ להעלאת תמונה</span>
                <span className="text-[12px] text-[#8C857B]">JPG, PNG עד 10MB</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
        )}

        {/* Catalog */}
        {option === 'catalog' && (
          <div className="grid grid-cols-3 gap-2">
            {HAIRCUT_PHOTOS.map((img, i) => (
              <button key={i} onClick={() => { setUploadedImg(img); setOption('upload') }} className="aspect-square rounded-[12px] overflow-hidden border-2 border-transparent hover:border-[#7A283D] transition-all">
                <img src={img} alt={`סגנון ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Optional detail selectors */}
        {option !== 'barber_choice' && (
          <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-4 flex flex-col gap-4">
            <p className="text-[14px] font-bold text-[#181715]">פרטים (אופציונלי)</p>

            <div>
              <p className="text-[12px] text-[#8C857B] mb-2">סוג שיער</p>
              <div className="flex flex-wrap gap-2">
                {hairTypes.map(t => (
                  <button
                    key={t}
                    onClick={() => setHairType(t)}
                    className={`px-3 py-1.5 rounded-[8px] text-[13px] font-medium border transition-all ${
                      hairType === t ? 'bg-[#7A283D] text-[#FFFDF8] border-[#7A283D]' : 'bg-[#F3EEE5] text-[#6D6860] border-[#D8D1C5]'
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[12px] text-[#8C857B] mb-2">גובה פייד</p>
              <div className="flex flex-wrap gap-2">
                {fadeHeights.map(f => (
                  <button
                    key={f}
                    onClick={() => setFadeHeight(f)}
                    className={`px-3 py-1.5 rounded-[8px] text-[13px] font-medium border transition-all ${
                      fadeHeight === f ? 'bg-[#7A283D] text-[#FFFDF8] border-[#7A283D]' : 'bg-[#F3EEE5] text-[#6D6860] border-[#D8D1C5]'
                    }`}
                  >{f}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[12px] text-[#8C857B] mb-2">אורך למעלה</p>
              <div className="flex flex-wrap gap-2">
                {topLengths.map(t => (
                  <button
                    key={t}
                    onClick={() => setTopLength(t)}
                    className={`px-3 py-1.5 rounded-[8px] text-[13px] font-medium border transition-all ${
                      topLength === t ? 'bg-[#7A283D] text-[#FFFDF8] border-[#7A283D]' : 'bg-[#F3EEE5] text-[#6D6860] border-[#D8D1C5]'
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[12px] text-[#8C857B] mb-1.5">הערות לספר</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="כל דבר שחשוב לך שהספר ידע..."
                rows={3}
                className="w-full px-3 py-2.5 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[14px] text-[#181715] placeholder-[#8C857B] focus:outline-none focus:border-[#7A283D] resize-none"
              />
            </div>
          </div>
        )}

        {option === 'barber_choice' && (
          <div>
            <label className="block text-[13px] text-[#6D6860] mb-2">תאר בקצרה מה אתה מחפש</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="לדוגמה: תספורת קצרה בצדדים, קצת ווליום למעלה..."
              rows={4}
              className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#D8D1C5] rounded-[14px] text-[15px] text-[#181715] placeholder-[#8C857B] focus:outline-none focus:border-[#7A283D] resize-none"
            />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 right-0 left-0 p-4 bg-[#FFFDF8] border-t border-[#D8D1C5] shadow-[0_-18px_50px_rgba(33,27,28,0.08)]">
        <button
          onClick={() => navigate('/book/matches', { state: { ...state, haircutBrief: brief } })}
          className="w-full h-[54px] bg-[#7A283D] text-[#FFFDF8] text-[16px] font-semibold rounded-[12px] hover:bg-[#5E1D2D] transition-colors"
        >
          מצא ספרים מתאימים
        </button>
      </div>
    </div>
  )
}
