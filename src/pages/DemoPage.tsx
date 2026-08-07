import { useNavigate } from 'react-router-dom'
import { User, Scissors, Settings } from 'lucide-react'
import { store } from '../data/store'
import Logo from '../components/Logo'

export default function DemoPage() {
  const navigate = useNavigate()

  const enter = (role: 'customer' | 'barber' | 'admin') => {
    store.setRole(role)
    if (role === 'customer') navigate('/app')
    else if (role === 'barber') navigate('/barber')
    else navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-[#F3EEE5] flex flex-col items-center justify-center px-6">
      <div className="mb-10 text-center">
        <Logo size="lg" />
        <p className="text-[15px] text-[#6D6860] mt-3">גישת הדגמה — בחר תפקיד</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {[
          { role: 'customer', label: 'כניסה כלקוח', sub: 'בנימין · ירושלים', icon: User, dest: '/app' },
          { role: 'barber', label: 'כניסה כספר', sub: 'עידו לוי · רחביה', icon: Scissors, dest: '/barber' },
          { role: 'admin', label: 'כניסה כמנהל', sub: 'מרכז פעילות', icon: Settings, dest: '/admin' },
        ].map(({ role, label, sub, icon: Icon, dest }) => (
          <button
            key={role}
            onClick={() => enter(role as any)}
            className="w-full bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-5 flex items-center gap-4 text-right hover:border-[#7A283D] hover:bg-[#FFFDF8] transition-all group"
          >
            <div className="w-12 h-12 bg-[#F3EEE5] rounded-full flex items-center justify-center group-hover:bg-[#7A283D]/10">
              <Icon size={22} className="text-[#7A283D]" />
            </div>
            <div>
              <div className="text-[16px] font-bold text-[#181715]">{label}</div>
              <div className="text-[13px] text-[#6D6860]">{sub}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <button onClick={() => navigate('/')} className="text-[14px] text-[#8C857B] hover:text-[#181715]">
          ← חזור לאתר
        </button>
      </div>
    </div>
  )
}
