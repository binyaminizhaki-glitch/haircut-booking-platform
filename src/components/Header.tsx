import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#FFFDF8] border-b border-[#D8D1C5]' : 'bg-transparent'
      }`}
      style={{ height: '80px' }}
    >
      <div className="max-w-[1360px] mx-auto h-full px-6 md:px-16 flex items-center justify-between flex-row-reverse">
        <Link to="/" aria-label="CUTNOW בית">
          <Logo size="md" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="ניווט ראשי">
          <button
            onClick={() => navigate('/book/service')}
            className="bg-[#7A283D] text-[#FFFDF8] text-[15px] font-semibold px-5 py-2.5 rounded-[12px] hover:bg-[#5E1D2D] transition-colors"
          >
            הזמן ספר
          </button>
          <Link to="/demo" className="text-[15px] text-[#6D6860] hover:text-[#181715] transition-colors font-medium">
            כניסה
          </Link>
          <a href="#business" className="text-[15px] text-[#6D6860] hover:text-[#181715] transition-colors font-medium">
            לעסקים
          </a>
          <Link to="/barber/onboarding" className="text-[15px] text-[#6D6860] hover:text-[#181715] transition-colors font-medium">
            לספרים
          </Link>
          <a href="#services" className="text-[15px] text-[#6D6860] hover:text-[#181715] transition-colors font-medium">
            שירותים
          </a>
          <a href="#how" className="text-[15px] text-[#6D6860] hover:text-[#181715] transition-colors font-medium">
            איך זה עובד
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[#181715]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="תפריט"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full right-0 left-0 bg-[#FFFDF8] border-b border-[#D8D1C5] shadow-lg">
          <nav className="flex flex-col p-6 gap-4">
            <a href="#how" className="text-[16px] text-[#181715] font-medium" onClick={() => setMenuOpen(false)}>איך זה עובד</a>
            <a href="#services" className="text-[16px] text-[#181715] font-medium" onClick={() => setMenuOpen(false)}>שירותים</a>
            <Link to="/barber/onboarding" className="text-[16px] text-[#181715] font-medium" onClick={() => setMenuOpen(false)}>לספרים</Link>
            <a href="#business" className="text-[16px] text-[#181715] font-medium" onClick={() => setMenuOpen(false)}>לעסקים</a>
            <Link to="/demo" className="text-[16px] text-[#181715] font-medium" onClick={() => setMenuOpen(false)}>כניסה</Link>
            <button
              onClick={() => { navigate('/book/service'); setMenuOpen(false) }}
              className="bg-[#7A283D] text-[#FFFDF8] text-[16px] font-semibold px-5 py-3 rounded-[12px] w-full text-center"
            >
              הזמן ספר
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
