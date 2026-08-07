import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'

const STEPS = [
  { label: 'פרטים אישיים' },
  { label: 'אימות זהות' },
  { label: 'ניסיון מקצועי' },
  { label: 'תיק עבודות' },
  { label: 'התמחויות' },
  { label: 'אזורים' },
  { label: 'ציוד' },
  { label: 'ראיון' },
]

export default function BarberOnboarding() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', city: 'ירושלים', years: '', bio: '' })
  const navigate = useNavigate()

  if (step >= STEPS.length) {
    return (
      <div className="min-h-screen bg-[#F3EEE5] flex flex-col items-center justify-center text-center px-6 gap-5">
        <div className="w-16 h-16 bg-[#E1F0E8] rounded-full flex items-center justify-center">
          <Check size={28} className="text-[#397458]" />
        </div>
        <h2 className="text-[26px] font-black text-[#181715]">הבקשה התקבלה!</h2>
        <p className="text-[16px] text-[#6D6860] max-w-sm">נבדוק את הפרטים שלך ונחזור אליך בתוך 3-5 ימי עסקים לתיאום ראיון.</p>
        <p className="text-[14px] text-[#8C857B]">לא כל מועמד מתקבל — אנחנו שומרים על רמה גבוהה.</p>
        <button onClick={() => navigate('/')} className="h-[52px] px-8 bg-[#7A283D] text-[#FFFDF8] font-semibold rounded-[12px]">
          חזור לעמוד הבית
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3EEE5] pb-24">
      <div className="bg-[#FFFDF8] border-b border-[#D8D1C5] px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => step > 0 ? setStep(step - 1) : navigate('/')} className="p-2 text-[#6D6860]">
            <ArrowRight size={20} />
          </button>
          <h1 className="text-[18px] font-bold text-[#181715]">הצטרפות כספר</h1>
        </div>
        {/* Progress */}
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= step ? 'bg-[#7A283D]' : 'bg-[#D8D1C5]'}`} />
          ))}
        </div>
        <p className="text-[12px] text-[#8C857B] mt-2">שלב {step + 1} מתוך {STEPS.length} · {STEPS[step].label}</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-[22px] font-black text-[#181715]">ספר לנו עליך</h2>
            {[
              { key: 'name', label: 'שם מלא', placeholder: 'שם פרטי ומשפחה' },
              { key: 'phone', label: 'טלפון', placeholder: '050-0000000', type: 'tel' },
              { key: 'city', label: 'עיר מגורים', placeholder: 'ירושלים' },
              { key: 'years', label: 'שנות ניסיון', placeholder: '5', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[13px] font-semibold text-[#6D6860] mb-1.5">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  value={form[f.key as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full h-[48px] px-4 bg-[#FFFDF8] border border-[#D8D1C5] rounded-[12px] text-[15px] text-[#181715] focus:outline-none focus:border-[#7A283D]"
                />
              </div>
            ))}
            <div>
              <label className="block text-[13px] font-semibold text-[#6D6860] mb-1.5">ספר לנו על עצמך</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                placeholder="ניסיון, סגנונות, מה מייחד אותך..."
                rows={4}
                className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#D8D1C5] rounded-[12px] text-[15px] text-[#181715] focus:outline-none focus:border-[#7A283D] resize-none"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-[22px] font-black text-[#181715]">אימות זהות</h2>
            <p className="text-[15px] text-[#6D6860]">אנחנו מאמתים את זהות כל ספר. זהו חלק בלתי נפרד מהבטחת הפלטפורמה.</p>
            <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-5 flex flex-col gap-3">
              {[
                { label: 'תמונת תעודת זהות', status: 'pending' },
                { label: 'סלפי עם תעודה', status: 'pending' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[15px] text-[#181715]">{item.label}</span>
                  <button className="h-[36px] px-4 border border-[#D8D1C5] rounded-[8px] text-[13px] text-[#6D6860] font-medium">העלה</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step > 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-[22px] font-black text-[#181715]">{STEPS[step].label}</h2>
            <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-5">
              <p className="text-[15px] text-[#6D6860]">שלב זה ידורש מידע נוסף בגרסה המלאה.</p>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 right-0 left-0 p-4 bg-[#FFFDF8] border-t border-[#D8D1C5]">
        <button
          onClick={() => setStep(step + 1)}
          className="w-full h-[54px] bg-[#7A283D] text-[#FFFDF8] text-[16px] font-semibold rounded-[12px] hover:bg-[#5E1D2D]"
        >
          {step < STEPS.length - 1 ? 'המשך' : 'שלח בקשה'}
        </button>
      </div>
    </div>
  )
}
