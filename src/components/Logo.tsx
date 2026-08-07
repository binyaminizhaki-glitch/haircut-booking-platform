interface LogoProps {
  dark?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ dark = false, size = 'md' }: LogoProps) {
  const sizes = { sm: 'text-lg tracking-[-0.04em]', md: 'text-2xl tracking-[-0.04em]', lg: 'text-3xl tracking-[-0.05em]' }
  const color = dark ? 'text-[#F3EEE5]' : 'text-[#181715]'

  return (
    <span className={`font-black ${sizes[size]} ${color} select-none relative inline-flex items-center gap-1`} style={{ fontFamily: 'Heebo, sans-serif' }}>
      CUT
      <span className="relative">
        NOW
        {/* Small lime availability dot */}
        <span
          className="absolute -top-0.5 -left-1 w-1.5 h-1.5 rounded-full bg-[#C8F36A]"
          aria-hidden="true"
        />
      </span>
    </span>
  )
}
