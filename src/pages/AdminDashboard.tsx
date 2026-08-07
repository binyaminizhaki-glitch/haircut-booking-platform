import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Users, DollarSign, AlertTriangle, Check, AlertCircle, Shield } from 'lucide-react'
import JerusalemMap from '../components/JerusalemMap'
import { mockBarbers, mockAdminAlerts, mockPricingConfig } from '../data/mockData'
import { store } from '../data/store'

function AdminNav() {
  const loc = useLocation()
  const tabs = [
    { to: '/admin', label: 'בית', icon: LayoutDashboard },
    { to: '/admin/bookings', label: 'הזמנות', icon: BookOpen },
    { to: '/admin/barbers', label: 'ספרים', icon: Users },
    { to: '/admin/pricing', label: 'תמחור', icon: DollarSign },
    { to: '/admin/alerts', label: 'התראות', icon: AlertTriangle },
  ]
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-[#211B1C] border-b border-[#2D2527] flex items-center">
      <div className="text-[16px] font-black text-[#F3EEE5] tracking-tight px-4 py-3 border-l border-[#2D2527] shrink-0">CUTNOW / Admin</div>
      <div className="flex flex-1 overflow-x-auto">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname === to
          return (
            <Link key={to} to={to} className={`flex items-center gap-2 px-4 py-3 text-[13px] font-medium whitespace-nowrap ${active ? 'text-[#C8F36A] border-b-2 border-[#C8F36A]' : 'text-[#6D6860] hover:text-[#F3EEE5]'}`}>
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function AdminHome() {
  const bookings = store.getBookings()
  const activeBookings = bookings.filter(b => ['travelling', 'arrived', 'in_progress'].includes(b.status))
  const availableBarbers = mockBarbers.filter(b => b.status === 'available')
  const alerts = mockAdminAlerts.filter(a => a.severity === 'high')

  return (
    <div className="p-6">
      <h1 className="text-[24px] font-black text-[#F3EEE5] mb-5">מרכז פעילות</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'ספרים זמינים', value: availableBarbers.length, color: 'text-[#C8F36A]' },
          { label: 'הזמנות פעילות', value: activeBookings.length, color: 'text-[#F3EEE5]' },
          { label: 'בקשות ממתינות', value: bookings.filter(b => b.status === 'requested').length, color: 'text-[#D97855]' },
          { label: 'התראות קריטיות', value: alerts.length, color: 'text-[#C94B4B]' },
        ].map(s => (
          <div key={s.label} className="bg-[#2D2527] border border-[#3A3032] rounded-[14px] p-4">
            <div className={`text-[28px] font-black ${s.color}`}>{s.value}</div>
            <div className="text-[12px] text-[#6D6860]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="h-[320px] mb-5">
        <JerusalemMap dark={true} showRoute={true} progress={0.4} className="rounded-[16px]" />
      </div>

      {/* Active barbers */}
      <div className="bg-[#2D2527] border border-[#3A3032] rounded-[16px] p-4">
        <h2 className="text-[15px] font-bold text-[#F3EEE5] mb-3">ספרים פעילים</h2>
        <div className="flex flex-col gap-2">
          {mockBarbers.slice(0, 4).map(b => (
            <div key={b.id} className="flex items-center justify-between py-2 border-b border-[#3A3032] last:border-0">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${b.status === 'available' ? 'bg-[#C8F36A]' : b.status === 'travelling' ? 'bg-[#D97855]' : 'bg-[#8C857B]'}`} />
                <span className="text-[14px] text-[#F3EEE5]">{b.name}</span>
                <span className="text-[12px] text-[#6D6860]">{b.neighbourhood}</span>
              </div>
              <span className="text-[12px] text-[#8C857B]">{b.status === 'available' ? 'זמין' : b.status === 'travelling' ? 'בנסיעה' : 'עסוק'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AdminBookings() {
  const [filter, setFilter] = useState('all')
  const bookings = store.getBookings()
  const FILTERS = [
    { id: 'all', label: 'הכול' },
    { id: 'active', label: 'פעילות' },
    { id: 'completed', label: 'הושלמו' },
    { id: 'cancelled', label: 'בוטלו' },
  ]
  const filtered = filter === 'all' ? bookings : bookings.filter(b =>
    filter === 'active' ? ['requested','matched','accepted','travelling','arrived','in_progress'].includes(b.status) :
    filter === 'completed' ? b.status === 'completed' : b.status === 'cancelled'
  )

  return (
    <div className="p-6">
      <h1 className="text-[22px] font-black text-[#F3EEE5] mb-5">הזמנות</h1>
      <div className="flex gap-2 mb-4">
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`px-3 py-1.5 rounded-[8px] text-[13px] font-medium ${filter === f.id ? 'bg-[#7A283D] text-[#FFFDF8]' : 'bg-[#2D2527] text-[#8C857B]'}`}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-[#3A3032]">
              {['ID', 'לקוח', 'ספר', 'שירות', 'סטטוס', 'מחיר', 'פעולות'].map(h => (
                <th key={h} className="py-2 px-3 text-[12px] text-[#6D6860] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const barber = mockBarbers.find(mb => mb.id === b.barberId)
              return (
                <tr key={b.id} className="border-b border-[#2D2527] hover:bg-[#2D2527] transition-colors">
                  <td className="py-2.5 px-3 text-[12px] text-[#8C857B] font-mono">{b.id.slice(-6)}</td>
                  <td className="py-2.5 px-3 text-[13px] text-[#F3EEE5]">בנימין</td>
                  <td className="py-2.5 px-3 text-[13px] text-[#F3EEE5]">{barber?.name || '—'}</td>
                  <td className="py-2.5 px-3 text-[12px] text-[#8C857B]">{b.serviceId.replace('s_', '')}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-[4px] ${
                      b.status === 'completed' ? 'bg-[#E1F0E8]/20 text-[#C8F36A]' :
                      b.status === 'cancelled' ? 'bg-[#F8E2E2]/20 text-[#C94B4B]' :
                      'bg-[#C8F36A]/10 text-[#D97855]'
                    }`}>{b.status}</span>
                  </td>
                  <td className="py-2.5 px-3 text-[14px] font-bold text-[#C8F36A]">{b.finalPrice} ₪</td>
                  <td className="py-2.5 px-3">
                    <button onClick={() => store.updateBookingStatus(b.id, 'cancelled')} className="text-[12px] text-[#C94B4B] hover:underline">בטל</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminBarbers() {
  return (
    <div className="p-6">
      <h1 className="text-[22px] font-black text-[#F3EEE5] mb-5">ספרים</h1>
      <div className="flex flex-col gap-3">
        {mockBarbers.map(b => (
          <div key={b.id} className="bg-[#2D2527] border border-[#3A3032] rounded-[16px] p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-14 rounded-[8px] overflow-hidden bg-[#3A3032] shrink-0">
                <img src={b.photoUrl} alt={b.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[15px] font-bold text-[#F3EEE5]">{b.name}</h3>
                  <div className="flex items-center gap-1">
                    <Shield size={12} className="text-[#C8F36A]" />
                    <span className="text-[11px] text-[#C8F36A]">מאומת</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'דירוג', value: b.rating },
                    { label: 'ניקיון', value: b.cleanlinessRating },
                    { label: 'אמינות', value: `${b.arrivalReliability}%` },
                    { label: 'ביטולים', value: `${b.cancellationRate}%` },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="text-[14px] font-bold text-[#F3EEE5]">{s.value}</div>
                      <div className="text-[10px] text-[#6D6860]">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminPricing() {
  const [config, setConfig] = useState(mockPricingConfig)

  const SERVICE_NAMES: Record<string, string> = {
    s_classic: 'תספורת קלאסית', s_fade: 'פייד', s_beard: 'תספורת וזקן',
    s_beard_only: 'סידור זקן', s_kid: 'תספורת לילד', s_father_son: 'אב ובן',
  }

  return (
    <div className="p-6">
      <h1 className="text-[22px] font-black text-[#F3EEE5] mb-5">תמחור</h1>
      <div className="flex flex-col gap-4">
        {Object.entries(config.services).map(([id, prices]) => (
          <div key={id} className="bg-[#2D2527] border border-[#3A3032] rounded-[14px] p-4">
            <h3 className="text-[14px] font-bold text-[#F3EEE5] mb-3">{SERVICE_NAMES[id] || id}</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'מחיר מתוזמן', key: 'scheduled' },
                { label: 'מחיר מיידי', key: 'immediate' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-[11px] text-[#6D6860] mb-1">{label}</label>
                  <div className="flex items-center gap-2 bg-[#211B1C] border border-[#3A3032] rounded-[8px] px-3 h-[40px]">
                    <input
                      type="number"
                      value={prices[key as keyof typeof prices]}
                      onChange={e => setConfig(p => ({ ...p, services: { ...p.services, [id]: { ...p.services[id], [key]: +e.target.value } } }))}
                      className="flex-1 bg-transparent text-[14px] text-[#F3EEE5] focus:outline-none text-left"
                      dir="ltr"
                    />
                    <span className="text-[13px] text-[#6D6860]">₪</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-[#2D2527] border border-[#3A3032] rounded-[14px] p-4">
          <h3 className="text-[14px] font-bold text-[#F3EEE5] mb-3">הגדרות כלליות</h3>
          {[
            { label: 'דמי מיידיות', value: config.urgencyFee, key: 'urgencyFee' },
            { label: 'עמלת פלטפורמה %', value: Math.round(config.platformCommission * 100), key: 'platformCommission' },
          ].map(({ label, value, key }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-[#3A3032] last:border-0">
              <span className="text-[14px] text-[#F3EEE5]">{label}</span>
              <input
                type="number"
                defaultValue={value}
                className="w-20 bg-[#211B1C] border border-[#3A3032] rounded-[6px] px-2 h-[34px] text-[14px] text-[#F3EEE5] text-center focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AdminAlerts() {
  const alerts = mockAdminAlerts
  const severityColor = (s: string) => s === 'high' ? 'bg-[#F8E2E2]/20 text-[#C94B4B] border-[#C94B4B]/30' : s === 'medium' ? 'bg-[#F9E9D7]/20 text-[#D97855] border-[#D97855]/30' : 'bg-[#2D2527] text-[#8C857B] border-[#3A3032]'

  return (
    <div className="p-6">
      <h1 className="text-[22px] font-black text-[#F3EEE5] mb-5">התראות</h1>
      <div className="flex flex-col gap-3">
        {alerts.map(a => (
          <div key={a.id} className={`border rounded-[14px] p-4 ${severityColor(a.severity)}`}>
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-[14px] font-semibold mb-1">{a.message}</p>
                <p className="text-[12px] opacity-70">{new Date(a.createdAt).toLocaleTimeString('he-IL')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#181715] text-[#F3EEE5]">
      <AdminNav />
      <div className="pt-[52px]">
        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="barbers" element={<AdminBarbers />} />
          <Route path="pricing" element={<AdminPricing />} />
          <Route path="alerts" element={<AdminAlerts />} />
        </Routes>
      </div>
    </div>
  )
}
