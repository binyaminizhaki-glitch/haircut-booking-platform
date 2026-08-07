import { useEffect, useRef } from 'react'

interface Props {
  dark?: boolean
  showRoute?: boolean
  progress?: number // 0-1
  className?: string
}

// Jerusalem simplified SVG map with neighbourhood labels and streets
export default function JerusalemMap({ dark = false, showRoute = true, progress = 0.4, className = '' }: Props) {
  const dotRef = useRef<SVGCircleElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!pathRef.current || !dotRef.current) return
    const path = pathRef.current
    const total = path.getTotalLength()
    const point = path.getPointAtLength(total * progress)
    dotRef.current.setAttribute('cx', point.x.toString())
    dotRef.current.setAttribute('cy', point.y.toString())
  }, [progress])

  const bg = dark ? '#211B1C' : '#F3EEE5'
  const streetColor = dark ? '#2D2527' : '#D8D1C5'
  const majorStreet = dark ? '#3A3032' : '#BDB4A7'
  const labelColor = dark ? '#6D6860' : '#8C857B'
  const textColor = dark ? '#8C857B' : '#6D6860'

  return (
    <svg
      viewBox="0 0 400 300"
      className={`w-full h-full ${className}`}
      style={{ background: bg, borderRadius: '20px' }}
      aria-label="מפת ירושלים מדומה"
    >
      {/* Streets grid */}
      <g stroke={streetColor} strokeWidth="1" fill="none">
        <line x1="0" y1="60" x2="400" y2="60" />
        <line x1="0" y1="100" x2="400" y2="110" />
        <line x1="0" y1="150" x2="400" y2="145" />
        <line x1="0" y1="200" x2="400" y2="195" />
        <line x1="0" y1="250" x2="400" y2="248" />
        <line x1="70" y1="0" x2="75" y2="300" />
        <line x1="140" y1="0" x2="138" y2="300" />
        <line x1="210" y1="0" x2="208" y2="300" />
        <line x1="280" y1="0" x2="285" y2="300" />
        <line x1="350" y1="0" x2="352" y2="300" />
      </g>

      {/* Major roads */}
      <g stroke={majorStreet} strokeWidth="2" fill="none">
        <path d="M0,130 Q100,120 200,125 Q300,130 400,120" />
        <path d="M160,0 Q162,100 155,200 Q150,260 155,300" />
        <path d="M0,80 Q80,75 160,80 Q240,85 320,78 Q360,75 400,80" />
      </g>

      {/* Neighbourhood labels */}
      <g fill={labelColor} fontSize="10" fontFamily="Heebo, sans-serif" textAnchor="middle">
        <text x="100" y="85">רחביה</text>
        <text x="240" y="90">קטמון</text>
        <text x="180" y="170">בקעה</text>
        <text x="320" y="160">ארנונה</text>
        <text x="80" y="175">נחלאות</text>
        <text x="310" y="85">טלביה</text>
        <text x="100" y="240">מרכז</text>
        <text x="250" y="240">גן העיר</text>
        <text x="350" y="240">תלפיות</text>
      </g>

      {showRoute && (
        <>
          {/* Route line */}
          <path
            ref={pathRef}
            d="M280,90 Q240,100 210,115 Q190,125 170,130 Q150,135 130,128"
            stroke="#7A283D"
            strokeWidth="2.5"
            strokeDasharray="6,3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Customer location */}
          <g transform="translate(130,128)">
            <circle r="8" fill="#FFFDF8" stroke="#7A283D" strokeWidth="2" />
            <circle r="3" fill="#7A283D" />
          </g>
          <text x="130" y="146" fill={textColor} fontSize="9" textAnchor="middle" fontFamily="Heebo, sans-serif">אתה כאן</text>

          {/* Barber location (live dot) */}
          <circle
            ref={dotRef}
            cx="280" cy="90" r="7"
            fill="#C8F36A"
            stroke="#181715"
            strokeWidth="1.5"
          />
          <circle cx="280" cy="90" r="14" fill="#C8F36A" fillOpacity="0.2" />
        </>
      )}

      {/* Area markers */}
      <g fill={dark ? '#3A3032' : '#E9E3D8'}>
        <circle cx="100" cy="75" r="25" opacity="0.4" />
        <circle cx="180" cy="165" r="30" opacity="0.3" />
        <circle cx="310" cy="150" r="22" opacity="0.4" />
      </g>
    </svg>
  )
}
