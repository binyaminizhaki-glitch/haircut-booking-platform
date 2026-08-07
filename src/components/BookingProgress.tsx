interface Step { label: string; path: string }

const STEPS: Step[] = [
  { label: 'שירות', path: '/book/service' },
  { label: 'מיקום', path: '/book/location' },
  { label: 'סגנון', path: '/book/style' },
  { label: 'התאמה', path: '/book/matches' },
  { label: 'סיכום', path: '/book/summary' },
]

interface Props { currentStep: number }

export default function BookingProgress({ currentStep }: Props) {
  return (
    <div className="w-full px-4 md:px-0">
      <div className="flex items-center gap-0 justify-between max-w-md mx-auto">
        {STEPS.map((step, idx) => (
          <div key={step.path} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all ${
                  idx < currentStep
                    ? 'bg-[#7A283D] text-[#FFFDF8]'
                    : idx === currentStep
                    ? 'bg-[#7A283D] text-[#FFFDF8] ring-4 ring-[#7A283D]/20'
                    : 'bg-[#D8D1C5] text-[#8C857B]'
                }`}
              >
                {idx < currentStep ? '✓' : idx + 1}
              </div>
              <span className={`text-[11px] font-medium ${idx <= currentStep ? 'text-[#181715]' : 'text-[#8C857B]'}`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 mt-[-16px] transition-all ${idx < currentStep ? 'bg-[#7A283D]' : 'bg-[#D8D1C5]'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
