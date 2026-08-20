import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Shield,
  Banknote,
  Sparkles,
  Check,
  Minus,
  Plus,
  ChevronLeft,
  LocateFixed,
  MapPinned,
} from "lucide-react"
import Header from "../components/Header"
import Logo from "../components/Logo"
import JerusalemMap from "../components/JerusalemMap"
import HowItWorks from "../components/ui/how-it-works"
import FaqSection, { type FaqData } from "../components/ui/habit-faq-scroller"
import {
  mockServices,
  HERO_PHOTO,
  BARBER_HERO,
  KIT_PHOTO,
  HAIRCUT_PHOTOS,
  EVENT_PHOTO,
} from "../data/mockData"

function HeroSection() {
  const navigate = useNavigate()
  const [address, setAddress] = useState("")
  const [showAvailability, setShowAvailability] = useState(false)
  const [locationStatus, setLocationStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle")
  const [detectedLocation, setDetectedLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const handleSearch = () => {
    if (address.trim()) {
      setShowAvailability(true)
    }
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error")
      return
    }

    setLocationStatus("loading")
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setAddress("המיקום הנוכחי שלי")
        setDetectedLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        })
        setShowAvailability(true)
        setLocationStatus("success")
      },
      () => setLocationStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <section className="min-h-[calc(100svh-0px)] bg-[#F3EEE5] flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[44%_56%] max-w-[1360px] mx-auto w-full pt-[80px]">
        {/* Content side (right in RTL) */}
        <div className="flex flex-col justify-center px-6 md:px-16 py-12 lg:py-0 order-2 lg:order-1">
          <div className="max-w-[520px]">
            {/* Availability badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFFDF8] border border-[#D8D1C5] rounded-[8px] px-3 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#C8F36A] shrink-0" />
              <span className="text-[13px] font-medium text-[#6D6860]">
                ספרים זמינים בכל הארץ · לפי המיקום שלך
              </span>
            </div>

            {/* Hero headline */}
            <h1 className="text-[52px] md:text-[72px] lg:text-[80px] font-black leading-[1.0] tracking-[-0.03em] text-[#181715] mb-6">
              הזמן את הספר.{" "}
              <span className="text-[#7A283D]">לא את הכיסא.</span>
            </h1>

            <p className="text-[18px] md:text-[20px] text-[#6D6860] leading-[1.6] mb-10 font-normal">
              ספר מקצועי שמגיע אליך הביתה, למשרד או למלון.
              <br />מחיר וזמן הגעה ידועים מראש.
            </p>

            {/* Booking panel */}
            <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[20px] p-6 shadow-[0_18px_50px_rgba(33,27,28,0.06)]">
              <p className="text-[14px] font-semibold text-[#181715] mb-3">
                איפה תרצה להסתפר?
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="רחוב, מספר ועיר"
                  className="flex-1 h-[56px] px-4 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[12px] text-[16px] text-[#181715] placeholder-[#8C857B] focus:outline-none focus:border-[#7A283D] focus:ring-2 focus:ring-[#7A283D]/20"
                />
                <button
                  onClick={handleSearch}
                  className="h-[56px] px-4 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[12px] text-[#6D6860] hover:bg-[#EFE9DF] transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locationStatus === "loading"}
                className="mt-3 mb-4 inline-flex items-center gap-2 text-[13px] font-semibold text-[#7A283D] transition-colors hover:text-[#5E1D2D] disabled:opacity-60"
              >
                <LocateFixed size={16} />
                {locationStatus === "loading"
                  ? "מאתר את המיקום שלך..."
                  : "השתמש במיקום הנוכחי שלי"}
              </button>

              {locationStatus === "error" && (
                <p className="mb-4 text-[12px] text-[#C94B4B]">
                  לא הצלחנו לזהות מיקום. אפשר להזין כתובת מכל מקום בארץ.
                </p>
              )}

              {/* Availability */}
              {showAvailability && (
                <div className="flex items-start gap-3 mb-4 py-3 border-t border-[#D8D1C5]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C8F36A] mt-1 shrink-0" />
                  <div>
                    <p className="text-[14px] font-semibold text-[#181715]">
                      4 ספרים זמינים באזור שלך
                    </p>
                    <p className="text-[13px] text-[#6D6860]">
                      ההגעה הקרובה ביותר בעוד 38 דקות
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() =>
                  navigate("/book/service", {
                    state: {
                      detectedLocation,
                      locationQuery: address || undefined,
                    },
                  })
                }
                className="w-full h-[52px] bg-[#7A283D] text-[#FFFDF8] text-[16px] font-semibold rounded-[12px] hover:bg-[#5E1D2D] active:bg-[#4C1724] transition-colors"
              >
                מצא לי ספר
              </button>

              {/* Trust indicators */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#D8D1C5]">
                {[
                  { icon: Shield, label: "זהות מאומתת" },
                  { icon: Banknote, label: "מחיר סופי מראש" },
                  { icon: Sparkles, label: "ניקוי מלא בסיום" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon size={14} className="text-[#7A283D] shrink-0" />
                    <span className="text-[12px] text-[#6D6860] font-medium">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Photo side (left in RTL) */}
        <div className="relative order-1 lg:order-2 h-[55vw] lg:h-auto">
          <img
            src={HERO_PHOTO}
            alt="ספר מקצועי עובד בבית לקוח"
            className="w-full h-full object-cover"
            style={{ borderRadius: "0 0 0 24px" }}
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F3EEE5]/80 to-transparent lg:hidden" />
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      title: "בוחרים תספורת",
      description:
        "בוחרים שירות, מיקום וזמן. מעלים תמונת השראה או בוחרים מהקאט השמור.",
      colorTheme: "orange" as const,
      colors: {
        bg: "bg-[#FFF4EB]",
        text: "text-[#D97855]",
        border: "border-[#EBC7B8]",
      },
    },
    {
      title: "מקבלים התאמה",
      description:
        "המערכת מוצאת שלושה ספרים שמתאימים לסגנון, לאזור ולזמן שביקשת.",
      colorTheme: "blue" as const,
      colors: {
        bg: "bg-[#F1F7E3]",
        text: "text-[#397458]",
        border: "border-[#CFE1BF]",
      },
    },
    {
      title: "הספר מגיע ומנקה",
      description:
        "הספר מגיע עם ציוד מלא, מבצע את התספורת ומנקה את המקום בסיום.",
      colorTheme: "purple" as const,
      colors: {
        bg: "bg-[#F7ECEF]",
        text: "text-[#7A283D]",
        border: "border-[#E4C8D0]",
      },
    },
  ]

  return (
    <section
      id="how"
      className="bg-[#F3EEE5] pt-[96px] md:pt-[140px]"
      dir="rtl"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-16">
        <h2 className="text-[44px] md:text-[60px] font-black text-[#181715] tracking-[-0.02em]">
          איך זה עובד?
        </h2>
      </div>
      <HowItWorks features={steps} className="md:pt-12" />
    </section>
  )
}

function ServicesSection() {
  const navigate = useNavigate()
  const services = mockServices.slice(0, 6)
  const getPriceLabel = (service: typeof mockServices[number]) =>
    service.id === "s_father_son"
      ? `${service.scheduledPrice} ₪ לשניהם · ${service.scheduledPrice / 2} ₪ לאדם`
      : `מ-${service.scheduledPrice} ₪`

  return (
    <section id="services" className="py-[96px] md:py-[140px] bg-[#FFFDF8]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-16">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-[44px] md:text-[60px] font-black text-[#181715] tracking-[-0.02em]">
            מה אתה צריך היום?
          </h2>
          <button
            onClick={() => navigate("/book/service")}
            className="hidden md:block text-[15px] text-[#7A283D] font-semibold hover:text-[#5E1D2D]"
          >
            כל השירותים ←
          </button>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Large feature card */}
          <div
            className="col-span-2 row-span-2 relative rounded-[20px] overflow-hidden cursor-pointer group"
            style={{ minHeight: "320px" }}
            onClick={() => navigate("/book/service")}
          >
            <img
              src={services[1].imageUrl}
              alt={services[1].nameHe}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              style={{ minHeight: "320px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181715]/80 via-[#181715]/20 to-transparent" />
            <div className="absolute bottom-0 right-0 left-0 p-6 text-right">
              <div className="inline-flex items-center gap-1.5 bg-[#C8F36A] rounded-[6px] px-2 py-0.5 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#181715]" />
                <span className="text-[11px] font-bold text-[#181715]">
                  זמין עכשיו
                </span>
              </div>
              <h3 className="text-[28px] font-black text-[#FFFDF8] mb-1">
                {services[1].nameHe}
              </h3>
              <p className="text-[14px] text-[#F3EEE5]/80 mb-3">
                {services[1].description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[20px] font-bold text-[#FFFDF8]">
                  {getPriceLabel(services[1])}
                </span>
                <span className="text-[13px] text-[#F3EEE5]/70">
                  {services[1].durationMinutes} דקות
                </span>
              </div>
            </div>
          </div>

          {/* Medium cards */}
          {services
            .filter((_, i) => i !== 1)
            .slice(0, 4)
            .map((service) => (
              <div
                key={service.id}
                className="relative rounded-[18px] overflow-hidden cursor-pointer group"
                style={{ minHeight: "160px" }}
                onClick={() => navigate("/book/service")}
              >
                <img
                  src={service.imageUrl}
                  alt={service.nameHe}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ minHeight: "160px" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181715]/70 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-4 text-right">
                  <h3 className="text-[16px] font-bold text-[#FFFDF8] mb-0.5">
                    {service.nameHe}
                  </h3>
                  <span className="text-[14px] font-semibold text-[#F3EEE5]/90">
                    {getPriceLabel(service)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

function MatchingSection() {
  return (
    <section className="py-[96px] md:py-[140px] bg-[#F3EEE5]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[40px] md:text-[56px] font-black text-[#181715] tracking-[-0.02em] mb-6">
              לא הספר הכי קרוב.
              <span className="text-[#7A283D]"> הספר הכי מתאים.</span>
            </h2>
            <p className="text-[18px] text-[#6D6860] leading-[1.7] mb-8">
              המערכת מתאימה לפי סגנון, סוג שיער, תיק עבודות רלוונטי, דירוגים
              ומרחק — לא רק לפי מי הכי קרוב.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "סגנון תספורת מבוקש — 35%",
                "תיק עבודות דומה — 20%",
                "זמינות ומרחק — 30%",
                "דירוג רלוונטי — 10%",
                "קשר קודם עם הלקוח — 5%",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check size={16} className="text-[#7A283D] shrink-0" />
                  <span className="text-[15px] text-[#6D6860]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Match visualization */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-[14px] overflow-hidden aspect-square bg-[#D8D1C5]">
                <img
                  src={HAIRCUT_PHOTOS[0]}
                  alt="תמונת השראה"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-[14px] overflow-hidden aspect-square bg-[#D8D1C5]">
                <img
                  src={HAIRCUT_PHOTOS[1]}
                  alt="עבודה דומה של הספר"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Cut line connector */}
            <div className="flex items-center justify-center mb-4">
              <div className="h-[2px] w-full bg-[#7A283D] relative">
                <div className="absolute right-1/2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#C8F36A] border-2 border-[#181715]" />
              </div>
            </div>
            {/* Match card */}
            <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[18px] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-bold text-[#FFFDF8] bg-[#7A283D] px-2.5 py-1 rounded-[6px]">
                  ההתאמה הטובה ביותר
                </span>
                <span className="text-[18px] font-black text-[#181715]">
                  94%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[8px] overflow-hidden bg-[#D8D1C5] shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format"
                    alt="עידו לוי"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-[16px] font-bold text-[#181715]">
                    עידו לוי
                  </div>
                  <div className="text-[13px] text-[#6D6860]">
                    Low Fade ושיער מתולתל
                  </div>
                </div>
              </div>
              <div className="cut-line my-3" />
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#6D6860]">
                  מגיע בעוד 42 דקות
                </span>
                <span className="text-[20px] font-black text-[#181715]">
                  179 ₪
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LiveServiceSection() {
  const statuses = [
    { label: "ההזמנה אושרה", done: true },
    { label: "ערכת הציוד בהכנה", done: true },
    { label: "הספר יצא לדרך", done: true, active: true },
    { label: "הספר הגיע", done: false },
    { label: "התספורת הסתיימה", done: false },
  ]

  return (
    <section className="py-[96px] md:py-[140px] bg-[#211B1C]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Map */}
          <div className="h-[300px] lg:h-[400px]">
            <JerusalemMap
              dark={true}
              showRoute={true}
              progress={0.45}
              className="rounded-[20px]"
            />
          </div>

          {/* Status */}
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8F36A]" />
              <span className="text-[13px] text-[#C8F36A] font-semibold">
                שידור חי
              </span>
            </div>
            <h2 className="text-[36px] md:text-[48px] font-black text-[#F3EEE5] tracking-[-0.02em] mb-2">
              עומר בדרך אליך
            </h2>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-[52px] font-black text-[#FFFDF8]">12</span>
              <span className="text-[20px] text-[#8C857B]">דקות</span>
              <span className="text-[16px] text-[#6D6860] mr-2">
                · שעת הגעה 19:42
              </span>
            </div>

            {/* Progress steps */}
            <div className="flex flex-col gap-3">
              {statuses.map((s, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      s.done
                        ? "bg-[#7A283D]"
                        : "bg-[#2D2527] border border-[#3A3032]"
                    }`}
                  >
                    {s.done && <Check size={11} className="text-[#FFFDF8]" />}
                  </div>
                  <span
                    className={`text-[15px] ${
                      s.active
                        ? "text-[#FFFDF8] font-semibold"
                        : s.done
                          ? "text-[#6D6860]"
                          : "text-[#3A3032]"
                    }`}
                  >
                    {s.label}
                  </span>
                  {(s as any).active && (
                    <span className="w-2 h-2 rounded-full bg-[#C8F36A] mr-auto" />
                  )}
                </div>
              ))}
            </div>

            <div className="h-[2px] bg-[#7A283D] my-6" />
            <p className="text-[14px] text-[#6D6860]">
              ערכת הציוד הוכנה · הספר יצא מרחביה
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CleaningSection() {
  return (
    <section className="py-[96px] md:py-[140px] bg-[#F3EEE5]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[36px] md:text-[52px] font-black text-[#181715] tracking-[-0.02em] mb-6">
              אנחנו משאירים תספורת.
              <span className="text-[#7A283D]"> לא רצפה מלאה בשיער.</span>
            </h2>
            <p className="text-[18px] text-[#6D6860] leading-[1.7] mb-8">
              כל ספר מגיע עם ציוד מחוטא, משטח איסוף ושואב כף יד. בסיום השירות —
              ניקוי מלא ודירוג ניקיון נפרד.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "ציוד מחוטא", desc: "לפני כל לקוח" },
                { title: "משטח איסוף", desc: "אין שיער על הרצפה" },
                { title: "ניקוי בסיום", desc: "שואב כף יד" },
                { title: "דירוג נפרד", desc: "ניקיון בלבד" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[14px] p-4"
                >
                  <div className="text-[16px] font-bold text-[#181715] mb-1">
                    {item.title}
                  </div>
                  <div className="text-[13px] text-[#6D6860]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] overflow-hidden aspect-[4/3] bg-[#D8D1C5]">
            <img
              src={KIT_PHOTO}
              alt="ערכת ציוד ספר ניידת"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function CutProfileSection() {
  const angles = [
    { label: "חזית", img: HAIRCUT_PHOTOS[0] },
    { label: "צד ימין", img: HAIRCUT_PHOTOS[1] },
    { label: "צד שמאל", img: HAIRCUT_PHOTOS[3] },
    { label: "עורף", img: HAIRCUT_PHOTOS[4] },
  ]

  return (
    <section className="py-[96px] md:py-[140px] bg-[#FFFDF8]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Photos with cut line */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              {angles.map(({ label, img }) => (
                <div
                  key={label}
                  className="relative rounded-[14px] overflow-hidden aspect-square bg-[#D8D1C5]"
                >
                  <img
                    src={img}
                    alt={label}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Cut line overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <line
                  x1="50"
                  y1="0"
                  x2="50"
                  y2="100"
                  stroke="#7A283D"
                  strokeWidth="0.5"
                  strokeDasharray="3,3"
                />
                <line
                  x1="0"
                  y1="50"
                  x2="100"
                  y2="50"
                  stroke="#7A283D"
                  strokeWidth="0.5"
                  strokeDasharray="3,3"
                />
              </svg>
            </div>
          </div>

          <div>
            <h2 className="text-[36px] md:text-[52px] font-black text-[#181715] tracking-[-0.02em] mb-6">
              בפעם הבאה לא צריך
              <span className="text-[#7A283D]"> להסביר הכול מחדש.</span>
            </h2>
            <p className="text-[18px] text-[#6D6860] leading-[1.7] mb-8">
              הספר מתעד את פרטי התספורת. בהזמנה הבאה — אותו קאט, אותן מידות.
            </p>
            <div className="bg-[#F3EEE5] rounded-[18px] p-5 mb-6">
              <div className="text-[14px] font-bold text-[#181715] mb-3">
                הקאט הרגיל שלי
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {[
                  ["סגנון", "Low Fade"],
                  ["צדדים", "0.5 (מספר 1.5)"],
                  ["למעלה", '4 ס"מ'],
                  ["קו עורף", "טבעי"],
                  ["זקן", '6 מ"מ'],
                  ["מוצר", "אמולסיה קלה"],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <span className="text-[11px] text-[#8C857B]">{k}</span>
                    <span className="text-[14px] font-semibold text-[#181715]">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[14px] text-[#6D6860]">
              ניתן לשחזר את הקאט עם אותו ספר או עם כל ספר מאומת אחר ברשת.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function GroupCutSection() {
  const [people, setPeople] = useState(2)
  const BASE_PRICE = 149
  const discounts: { [k: number]: number } = { 1: 0, 2: 0.22, 3: 0.33, 4: 0.38 }
  const discountRate = discounts[Math.min(people, 4)] ?? 0.38
  const pricePerPerson = Math.round(BASE_PRICE * (1 - discountRate))
  const total = pricePerPerson * people
  const navigate = useNavigate()

  return (
    <section className="py-[96px] md:py-[140px] bg-[#F3EEE5]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[36px] md:text-[52px] font-black text-[#181715] tracking-[-0.02em] mb-6">
              נסיעה אחת. כמה תספורות.
              <span className="text-[#7A283D]"> מחיר טוב יותר לכולם.</span>
            </h2>
            <p className="text-[18px] text-[#6D6860] leading-[1.7] mb-8">
              שלח קישור לחברים, לקולגות או לבני המשפחה — וכולם מקבלים הנחה
              קבוצתית.
            </p>

            {/* Price calculator */}
            <div className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[20px] p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[15px] font-semibold text-[#181715]">
                  מספר משתתפים
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPeople(Math.max(1, people - 1))}
                    disabled={people === 1}
                    aria-label="הפחת משתתף"
                    className="flex size-8 items-center justify-center rounded-full border border-[#D8D1C5] bg-[#F3EEE5] hover:bg-[#EFE9DF] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-[20px] font-black tabular-nums text-[#181715]">
                    {people}
                  </span>
                  <button
                    onClick={() => setPeople(Math.min(8, people + 1))}
                    disabled={people === 8}
                    aria-label="הוסף משתתף"
                    className="flex size-8 items-center justify-center rounded-full border border-[#D8D1C5] bg-[#F3EEE5] hover:bg-[#EFE9DF] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="cut-line my-4" />
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[14px] text-[#6D6860]">מחיר לאדם</span>
                <span className="text-[28px] font-black tabular-nums text-[#181715]">
                  {pricePerPerson} ₪
                </span>
              </div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-[13px] text-[#8C857B]">
                  {people === 1 ? 'סה"כ עבור אדם אחד' : `סה"כ עבור ${people} אנשים`}
                </span>
                <span className="text-[18px] font-bold tabular-nums text-[#6D6860]">
                  {total} ₪
                </span>
              </div>
              {people > 1 && (
                <div className="bg-[#E9F9BF] rounded-[8px] px-3 py-2 mb-4 text-center">
                  <span className="text-[13px] font-semibold text-[#181715]">
                    חוסך {Math.round(discountRate * 100)}% לכל
                    אחד
                  </span>
                </div>
              )}
              <button
                onClick={() => navigate("/book/service")}
                className="w-full h-[52px] bg-[#7A283D] text-[#FFFDF8] text-[15px] font-semibold rounded-[12px] hover:bg-[#5E1D2D] transition-colors"
              >
                {people === 1 ? "הזמן תספורת" : "פתח הזמנה קבוצתית"}
              </button>
            </div>
          </div>
          <div className="rounded-[24px] overflow-hidden aspect-[4/3] bg-[#D8D1C5]">
            <img
              src={EVENT_PHOTO}
              alt="חבריא בדירה"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function BarberRecruitSection() {
  const navigate = useNavigate()
  return (
    <section className="py-[96px] md:py-[140px] bg-[#211B1C]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[40px] md:text-[56px] font-black text-[#F3EEE5] tracking-[-0.02em] mb-6">
              הכיסא שלך יכול להיות
              <span className="text-[#C8F36A]"> בכל מקום.</span>
            </h2>
            <p className="text-[18px] text-[#8C857B] leading-[1.7] mb-8">
              פתח שעות זמינות, קבל הזמנות באזור שלך ובנה יום עבודה בלי לשלם
              שכירות למספרה.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: "4", label: "הזמנות היום" },
                { value: "38", label: "דקות נסיעה" },
                { value: "586 ₪", label: "הכנסה צפויה" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="bg-[#2D2527] rounded-[14px] p-4 text-center"
                >
                  <div className="text-[28px] font-black text-[#F3EEE5]">
                    {m.value}
                  </div>
                  <div className="text-[12px] text-[#8C857B]">{m.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/barber/onboarding")}
              className="h-[52px] px-8 bg-[#F3EEE5] text-[#211B1C] text-[15px] font-semibold rounded-[12px] hover:bg-[#FFFDF8] transition-colors"
            >
              הצטרף כספר
            </button>
          </div>
          <div className="rounded-[24px] overflow-hidden aspect-[4/5] bg-[#2D2527]">
            <img
              src={BARBER_HERO}
              alt="ספר עצמאי"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function BusinessSection() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    participants: "",
    date: "",
    phone: "",
    note: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="business" className="py-[96px] md:py-[140px] bg-[#F3EEE5]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-[40px] md:text-[52px] font-black text-[#181715] tracking-[-0.02em] mb-6">
              לעסקים ואירועים
            </h2>
            <p className="text-[18px] text-[#6D6860] leading-[1.7] mb-8">
              שירות קאט לחברות, בתי מלון, אירועים, הפקות וחתונות. תיאום מרכזי,
              ספרים מרובים, הצעת מחיר מותאמת.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                "משרדים",
                "בתי מלון",
                "אירועים",
                "הפקות",
                "חתונות",
                "מלונות",
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 text-[15px] text-[#6D6860]"
                >
                  <Check size={15} className="text-[#7A283D]" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {submitted ? (
            <div className="bg-[#E1F0E8] border border-[#397458]/30 rounded-[20px] p-8 flex flex-col items-center justify-center text-center">
              <Check size={32} className="text-[#397458] mb-3" />
              <h3 className="text-[22px] font-bold text-[#181715] mb-2">
                הבקשה התקבלה
              </h3>
              <p className="text-[16px] text-[#6D6860]">
                ניצור איתך קשר בהקדם.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-[#FFFDF8] border border-[#D8D1C5] rounded-[20px] p-6 flex flex-col gap-4"
            >
              {[
                { key: "name", label: "שם", placeholder: "שמך" },
                {
                  key: "company",
                  label: "חברה / מקום",
                  placeholder: "שם החברה או האירוע",
                },
                {
                  key: "participants",
                  label: "מספר משתתפים",
                  placeholder: "10",
                  type: "number",
                },
                { key: "date", label: "תאריך", placeholder: "", type: "date" },
                {
                  key: "phone",
                  label: "טלפון",
                  placeholder: "050-0000000",
                  type: "tel",
                },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-[13px] font-semibold text-[#6D6860] mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    value={form[(field.key as keyof typeof form)]}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="w-full h-[46px] px-4 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[15px] text-[#181715] focus:outline-none focus:border-[#7A283D]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[13px] font-semibold text-[#6D6860] mb-1.5">
                  הערה
                </label>
                <textarea
                  value={form.note}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, note: e.target.value }))
                  }
                  placeholder="פרטים נוספים..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#F3EEE5] border border-[#D8D1C5] rounded-[10px] text-[15px] text-[#181715] focus:outline-none focus:border-[#7A283D] resize-none"
                />
              </div>
              <button
                type="submit"
                className="h-[52px] bg-[#7A283D] text-[#FFFDF8] text-[15px] font-semibold rounded-[12px] hover:bg-[#5E1D2D] transition-colors"
              >
                שלח פנייה
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

const faqData: FaqData = {
  mainTitle: "שאלות טובות. תשובות ישרות.",
  mainSubtitle:
    "ריכזנו את כל מה שחשוב לדעת לפני שמזמינים ספר עד הבית — בלי אותיות קטנות ובלי הפתעות.",
  rows: [
    {
      id: "booking",
      speed: "52s",
      direction: "left",
      faqItems: [
        {
          id: "arrival-time",
          question: "תוך כמה זמן הספר יכול להגיע?",
          answer:
            "בהזמנה מיידית נראה לך זמן הגעה משוער לכל ספר זמין לידך. הזמן משתנה לפי המיקום, התנועה והזמינות באזור שלך.",
        },
        {
          id: "advance-booking",
          question: "אפשר להזמין מראש?",
          answer:
            "כן. אפשר לבחור יום ושעה שנוחים לך, או להזמין ספר שיגיע בהקדם האפשרי.",
        },
        {
          id: "location",
          question: "איפה אפשר לקבל את השירות?",
          answer:
            "בבית, במשרד, במלון או בכל מקום פרטי ומתאים ברחבי הארץ. הזמינות מוצגת בזמן אמת לפי הכתובת או המיקום הנוכחי שלך.",
        },
        {
          id: "barber-choice",
          question: "אפשר לבחור ספר ספציפי?",
          answer:
            "בהחלט. אפשר לבחור ספר מוכר או לקבל שלוש התאמות לפי הסגנון, סוג השיער, המיקום והזמינות שלך.",
        },
      ],
    },
    {
      id: "service",
      speed: "58s",
      direction: "right",
      faqItems: [
        {
          id: "equipment",
          question: "מה צריך להכין לפני שהספר מגיע?",
          answer:
            "רק מקום ישיבה נוח ושקע חשמל קרוב. הספר מביא איתו את כלי העבודה, מוצרי הטיפוח וערכת הניקוי.",
        },
        {
          id: "cleaning",
          question: "מי מנקה אחרי התספורת?",
          answer:
            "הספר. כל הזמנה כוללת משטח איסוף וניקוי מלא של אזור העבודה בסיום, ללא תשלום נוסף.",
        },
        {
          id: "hygiene",
          question: "איך שומרים על היגיינה?",
          answer:
            "כלים שעוברים בין לקוחות מחוטאים לפני כל שירות, והספרים נדרשים לעבוד לפי נוהלי ההיגיינה של CUTNOW.",
        },
        {
          id: "saved-cut",
          question: "אפשר לשמור את פרטי התספורת לפעם הבאה?",
          answer:
            "כן. נשמור את הסגנון, האורכים וההעדפות שלך, כדי שתוכל לשחזר את אותו קאט גם עם ספר אחר.",
        },
      ],
    },
    {
      id: "payment",
      speed: "64s",
      direction: "left",
      faqItems: [
        {
          id: "final-price",
          question: "המחיר שמופיע הוא המחיר הסופי?",
          answer:
            "כן. המחיר מוצג לפני אישור ההזמנה וכולל הגעה, ציוד וניקוי. תוספות יחויבו רק אם אישרת אותן מראש.",
        },
        {
          id: "payment-method",
          question: "איך משלמים?",
          answer:
            "התשלום מתבצע בצורה מאובטחת דרך האפליקציה. החיוב מושלם רק לאחר שהשירות הסתיים.",
        },
        {
          id: "cancellation",
          question: "מה קורה אם צריך לבטל?",
          answer:
            "אפשר לבטל ללא עלות עד המועד שמופיע במסך ההזמנה. ביטול מאוחר עשוי להיות כרוך בדמי ביטול.",
        },
        {
          id: "group",
          question: "אפשר להזמין כמה תספורות יחד?",
          answer:
            "כן. בהזמנה קבוצתית אפשר לצרף חברים, משפחה או קולגות ולקבל מחיר טוב יותר לכל משתתף.",
        },
      ],
    },
  ],
}

function Footer() {
  const currentYear = new Date().getFullYear()

  const footerColumns = [
    {
      title: "מזמינים CUT",
      links: [
        { label: "איך זה עובד", href: "#how" },
        { label: "השירותים שלנו", href: "#services" },
        { label: "CUT לעסקים", href: "#business" },
      ],
    },
    {
      title: "לספרים",
      links: [
        { label: "הצטרפות ל־CUTNOW", href: "/barber/onboarding" },
        { label: "כניסה ללוח הספר", href: "/barber" },
        { label: "מרכז הדגמה", href: "/demo" },
      ],
    },
    {
      title: "חשוב לדעת",
      links: [
        { label: "בטיחות והיגיינה", href: "#how" },
        { label: "שאלות נפוצות", href: "#faq" },
        { label: "שירות בפריסה ארצית", href: "#coverage" },
      ],
    },
  ]

  return (
    <footer
      id="coverage"
      className="overflow-hidden bg-[#211B1C] text-[#F3EEE5]"
      dir="rtl"
    >
      <div className="mx-auto max-w-[1360px] px-6 pb-8 pt-8 md:px-16 md:pb-10 md:pt-12">
        <div className="grid gap-12 py-10 md:grid-cols-2 md:py-12 lg:grid-cols-[1.35fr_2fr] lg:gap-20 lg:py-14">
          <div>
            <a
              href="/"
              aria-label="CUTNOW — חזרה לראש העמוד"
              className="inline-flex"
            >
              <Logo dark size="lg" />
            </a>
            <p className="mt-5 max-w-[360px] text-[15px] leading-7 text-[#A39B90]">
              ספרים מקצועיים שמגיעים עד אליך — לבית, למשרד, למלון או לאירוע.
              המחיר, ההתאמה וזמן ההגעה ידועים מראש.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#2D2527] px-3.5 py-2 text-[13px] font-medium text-[#D8D1C5]">
              <MapPinned size={16} className="text-[#C8F36A]" />
              שירות ארצי לפי המיקום שלך
            </div>
          </div>

          <nav
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3"
            aria-label="ניווט תחתון"
          >
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-4 text-[12px] font-bold tracking-[0.12em] text-[#8C857B]">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[14px] text-[#D8D1C5] transition-colors hover:text-[#C8F36A]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-7 text-[12px] text-[#8C857B] sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} CUTNOW. כל הזכויות שמורות.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="#" className="transition-colors hover:text-[#F3EEE5]">
              פרטיות
            </a>
            <a href="#" className="transition-colors hover:text-[#F3EEE5]">
              תנאי שימוש
            </a>
            <span className="inline-flex items-center gap-1.5 text-[#BDB4A7]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8F36A]" />
              זמינים ברחבי ישראל
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <ServicesSection />
      <MatchingSection />
      <LiveServiceSection />
      <CleaningSection />
      <CutProfileSection />
      <GroupCutSection />
      <BarberRecruitSection />
      <div id="faq">
        <FaqSection data={faqData} />
      </div>
      <BusinessSection />
      <Footer />
    </div>
  )
}
