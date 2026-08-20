import type { CSSProperties, ReactNode } from 'react'

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface FaqRow {
  id: string
  speed: string
  direction: 'left' | 'right'
  faqItems: FaqItem[]
}

export interface FaqData {
  mainTitle: string
  mainSubtitle: string
  rows: FaqRow[]
}

interface FaqCardProps {
  question: string
  answer: string
}

interface HorizontalScrollerProps {
  children: ReactNode
  speed?: string
  direction?: 'left' | 'right'
}

interface FaqSectionProps {
  data: FaqData
}

type ScrollStyle = CSSProperties & {
  '--scroll-duration': string
}

export function FaqCard({ question, answer }: FaqCardProps) {
  return (
    <article
      dir="rtl"
      className="faq-card flex w-[min(82vw,400px)] shrink-0 flex-col items-start gap-4 rounded-[18px] border border-[#D8D1C5] bg-[#FFFDF8] p-6 text-right shadow-[0_16px_40px_rgba(33,27,28,0.06)] md:p-7"
    >
      <h3 className="faq-title text-[19px] font-black leading-[1.35] text-[#181715] md:text-[21px]">
        {question}
      </h3>
      <p className="faq-answer text-[15px] leading-[1.75] text-[#6D6860] md:text-[16px]">
        {answer}
      </p>
    </article>
  )
}

export function HorizontalScroller({
  children,
  speed = '40s',
  direction = 'left',
}: HorizontalScrollerProps) {
  const animationClass =
    direction === 'right'
      ? 'animate-scroll-horizontal-reverse'
      : 'animate-scroll-horizontal'
  const style: ScrollStyle = { '--scroll-duration': speed }

  return (
    <div className="scroller-mask group relative w-full overflow-hidden" dir="ltr">
      <div className={`faq-scroll-track flex w-max ${animationClass}`} style={style}>
        <div className="flex shrink-0 items-stretch">
          <div className="flex shrink-0 items-stretch justify-center gap-4 px-2 md:gap-6 md:px-3">
            {children}
          </div>
          <div
            className="flex shrink-0 items-stretch justify-center gap-4 px-2 md:gap-6 md:px-3"
            aria-hidden="true"
          >
            {children}
          </div>
        </div>
        <div
          className="flex shrink-0 items-stretch"
          aria-hidden="true"
        >
          <div className="flex shrink-0 items-stretch justify-center gap-4 px-2 md:gap-6 md:px-3">
            {children}
          </div>
          <div className="flex shrink-0 items-stretch justify-center gap-4 px-2 md:gap-6 md:px-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FaqSection({ data }: FaqSectionProps) {
  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden bg-[#F3EEE5] py-[96px] md:py-[140px]"
      dir="rtl"
      aria-labelledby="faq-title"
    >
      <div className="mx-auto mb-12 flex max-w-[760px] flex-col items-center gap-5 px-6 text-center md:mb-16">
        <span className="rounded-full border border-[#D8D1C5] bg-[#FFFDF8] px-3 py-1 text-[12px] font-bold text-[#7A283D]">
          כל מה שרצית לדעת
        </span>
        <h2
          id="faq-title"
          className="faq-heading-reveal text-[42px] font-black leading-[1.08] tracking-[-0.025em] text-[#181715] md:text-[60px]"
        >
          {data.mainTitle}
        </h2>
        <p className="faq-subtitle-reveal max-w-[620px] text-[17px] leading-[1.7] text-[#6D6860] md:text-[18px]">
          {data.mainSubtitle}
        </p>
      </div>

      <div className="flex w-full flex-col gap-5 md:gap-6">
        {data.rows.map((row) => (
          <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
            {row.faqItems.map((item) => (
              <FaqCard key={item.id} question={item.question} answer={item.answer} />
            ))}
          </HorizontalScroller>
        ))}
      </div>

      <p className="mt-10 px-6 text-center text-[13px] text-[#8C857B]">
        אפשר לעצור את התנועה עם העכבר כדי לקרוא בנחת.
      </p>
    </section>
  )
}
