import logoImage from '../assets/cutnow-logo.png'

interface LogoProps {
  dark?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ dark = false, size = 'md' }: LogoProps) {
  const sizes = {
    sm: {
      frame: 'w-[84px] h-[50px]',
      image: 'w-[129px] h-[129px] left-[-26px] top-[-41px]',
    },
    md: {
      frame: 'w-[108px] h-[65px]',
      image: 'w-[166px] h-[166px] left-[-34px] top-[-52px]',
    },
    lg: {
      frame: 'w-[140px] h-[84px]',
      image: 'w-[215px] h-[215px] left-[-44px] top-[-68px]',
    },
  }
  const selectedSize = sizes[size]

  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-[8px] select-none ${selectedSize.frame} ${
        dark ? 'ring-1 ring-white/15' : ''
      }`}
      role="img"
      aria-label="CUTNOW"
    >
      <img
        src={logoImage}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`pointer-events-none absolute max-w-none object-cover ${selectedSize.image}`}
      />
    </span>
  )
}
