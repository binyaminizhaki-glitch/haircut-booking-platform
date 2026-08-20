import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'
import type React from 'react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'

interface LocationMapProps {
  location?: string
  latitude?: number
  longitude?: number
  zoom?: number
  className?: string
  tileProvider?: 'openstreetmap' | 'carto-light' | 'carto-dark'
  defaultExpanded?: boolean
}

function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = 2 ** zoom
  const x = Math.floor(((lng + 180) / 360) * n)
  const latRad = (lat * Math.PI) / 180
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  )

  return { x, y }
}

function getTileUrl(provider: LocationMapProps['tileProvider'], x: number, y: number, z: number) {
  switch (provider) {
    case 'carto-light':
      return `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`
    case 'carto-dark':
      return `https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/${z}/${x}/${y}.png`
    default:
      return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
  }
}

function formatCoordinates(lat: number, lng: number) {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'

  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`
}

export function LocationMap({
  location = 'המיקום שלך',
  latitude = 32.0853,
  longitude = 34.7818,
  zoom = 14,
  className = '',
  tileProvider = 'carto-light',
  defaultExpanded = false,
}: LocationMapProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [tilesLoaded, setTilesLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridId = useId().replace(/:/g, '')

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-80, 80], [2, -2])
  const rotateY = useTransform(mouseX, [-160, 160], [-2, 2])
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const coordinates = useMemo(
    () => formatCoordinates(latitude, longitude),
    [latitude, longitude],
  )

  const tiles = useMemo(() => {
    const centerTile = latLngToTile(latitude, longitude, zoom)
    const tileUrls: { url: string; offsetX: number; offsetY: number }[] = []

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        tileUrls.push({
          url: getTileUrl(tileProvider, centerTile.x + dx, centerTile.y + dy, zoom),
          offsetX: dx,
          offsetY: dy,
        })
      }
    }

    return tileUrls
  }, [latitude, longitude, zoom, tileProvider])

  useEffect(() => {
    let cancelled = false
    let loadedCount = 0
    setTilesLoaded(false)

    tiles.forEach((tile) => {
      const image = new Image()
      const handleComplete = () => {
        loadedCount += 1
        if (!cancelled && loadedCount === tiles.length) setTilesLoaded(true)
      }

      image.onload = handleComplete
      image.onerror = handleComplete
      image.src = tile.url
    })

    return () => {
      cancelled = true
    }
  }, [tiles])

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set(event.clientX - (rect.left + rect.width / 2))
    mouseY.set(event.clientY - (rect.top + rect.height / 2))
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const toggleExpanded = () => setIsExpanded((expanded) => !expanded)

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full cursor-pointer select-none ${className}`}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={toggleExpanded}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          toggleExpanded()
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`${location} — ${isExpanded ? 'מזעור המפה' : 'הרחבת המפה'}`}
    >
      <motion.div
        className="relative w-full overflow-hidden rounded-[18px] border border-[#D8D1C5] bg-[#FFFDF8] shadow-[0_14px_35px_rgba(33,27,28,0.08)]"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{ height: isExpanded ? 280 : 140 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      >
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-white/10 via-transparent to-[#7A283D]/10" />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute h-[768px] w-[768px]"
                  style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                >
                  {tiles.map((tile, index) => (
                    <motion.div
                      key={tile.url}
                      className="absolute h-64 w-64"
                      style={{
                        left: `${(tile.offsetX + 1) * 256}px`,
                        top: `${(tile.offsetY + 1) * 256}px`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: tilesLoaded ? 1 : 0 }}
                      transition={{ duration: 0.3, delay: index * 0.035 }}
                    >
                      <img
                        src={tile.url}
                        alt=""
                        width={256}
                        height={256}
                        draggable={false}
                        className="h-full w-full"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {!tilesLoaded && <div className="absolute inset-0 animate-pulse bg-[#E9E3D8]" />}

              <motion.div
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.2 }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(122, 40, 61, 0.35))' }}
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    fill="#7A283D"
                  />
                  <circle cx="12" cy="9" r="2.5" fill="#FFFDF8" />
                </svg>
              </motion.div>

              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#211B1C]/85 via-transparent to-white/10" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isExpanded ? 0 : 1 }}
          transition={{ duration: 0.25 }}
        >
          <svg width="100%" height="100%" className="absolute inset-0" aria-hidden="true">
            <defs>
              <pattern id={gridId} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#7A283D" strokeOpacity="0.08" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${gridId})`} />
          </svg>
        </motion.div>

        <div className="relative z-20 flex h-full flex-col justify-between p-5" dir="rtl">
          <div className="flex items-start justify-between">
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isExpanded ? 'text-white' : 'text-[#7A283D]'}
              animate={{
                filter: isHovered
                  ? 'drop-shadow(0 0 8px rgba(122, 40, 61, 0.45))'
                  : 'drop-shadow(0 0 3px rgba(122, 40, 61, 0.2))',
              }}
              aria-hidden="true"
            >
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" x2="9" y1="3" y2="18" />
              <line x1="15" x2="15" y1="6" y2="21" />
            </motion.svg>

            <span className={`text-[11px] font-medium ${isExpanded ? 'text-white/80' : 'text-[#8C857B]'}`}>
              {isExpanded ? 'לחיצה למזעור' : 'לחיצה לפתיחת המפה'}
            </span>
          </div>

          <div className="space-y-1 text-right">
            <motion.h3
              className={`text-[15px] font-semibold tracking-tight ${isExpanded ? 'text-white' : 'text-[#181715]'}`}
              animate={{ x: isHovered ? -4 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {location}
            </motion.h3>

            <AnimatePresence>
              {isExpanded && (
                <motion.p
                  className="font-mono text-xs text-white/75"
                  dir="ltr"
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {coordinates}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              className={`h-px bg-gradient-to-l ${isExpanded ? 'from-white/70 via-white/30' : 'from-[#7A283D]/70 via-[#7A283D]/30'} to-transparent`}
              initial={{ scaleX: 0, originX: 1 }}
              animate={{ scaleX: isHovered || isExpanded ? 1 : 0.3 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {isExpanded && (
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
            className="absolute bottom-1 left-2 z-30 rounded bg-white/80 px-1.5 py-0.5 text-[9px] text-[#6D6860] hover:text-[#181715]"
          >
            © OpenStreetMap © CARTO
          </a>
        )}
      </motion.div>
    </motion.div>
  )
}

export default LocationMap
