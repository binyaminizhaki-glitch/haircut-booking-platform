"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "motion/react";

interface CardProps {
  number: string;
  title: string;
  description: string;
  colorTheme?: "orange" | "blue" | "purple";
  className?: string;
  rotate?: string;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const Card = ({
  number,
  title,
  description,
  colorTheme = "blue",
  className,
  rotate,
  colors: customColors,
}: CardProps) => {
  const defaultBgColors = {
    orange: "bg-[#FFF4EB]",
    blue: "bg-[#F1F7E3]",
    purple: "bg-[#F7ECEF]",
  };
  const defaultTextColors = {
    orange: "text-[#D97855]",
    blue: "text-[#397458]",
    purple: "text-[#7A283D]",
  };
  const defaultBorderColors = {
    orange: "border-[#EBC7B8]",
    blue: "border-[#CFE1BF]",
    purple: "border-[#E4C8D0]",
  };

  const bgColor = customColors?.bg || defaultBgColors[colorTheme];
  const textColor = customColors?.text || defaultTextColors[colorTheme];
  const borderColor = customColors?.border || defaultBorderColors[colorTheme];

  return (
    <div
      className={`relative z-10 mx-auto w-full max-w-[326px] transition-transform duration-300 md:mx-0 md:w-[280px] md:hover:z-30 md:hover:scale-105 ${rotate} ${className}`}
    >
      <div className="rounded-[25px] border border-[#D8D1C5] bg-[#FFFDF8] p-2.5 shadow-[0_18px_45px_rgba(33,27,28,0.11)]">
        <Pin className={`mx-auto mb-4 h-8 w-8 ${textColor} z-20`} />
        <div
          className={`${bgColor} border ${borderColor} relative flex h-full flex-col overflow-hidden rounded-[15px] p-5`}
        >
          <span
            className={`${textColor} mb-4 text-4xl font-handwriting`}
            style={{
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
            }}
          >
            {number}
          </span>
          <h3 className="mb-[10px] text-[22px] font-bold leading-tight text-[#181715]">
            {title}
          </h3>
          <p className="text-sm/6 tracking-tight text-[#6D6860]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export interface Step {
  title: string;
  description: string;
  colorTheme?: "orange" | "blue" | "purple";
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
}

const DEFAULT_CARD_POSITIONS: StepPosition[] = [
  {
    className: "md:absolute md:top-0 md:left-[15%]",
    rotate: "rotate-[2deg] md:rotate-[8deg]",
  },
  {
    className: "md:absolute md:top-[120px] md:right-[15%]",
    rotate: "-rotate-[2deg] md:-rotate-[8deg]",
  },
  {
    className: "md:absolute md:top-[450px] md:left-[15%]",
    rotate: "rotate-[2deg] md:rotate-[8deg]",
  },
  {
    className: "md:absolute md:top-[570px] md:right-[10%]",
    rotate: "-rotate-[2deg] md:-rotate-[8deg]",
  },
  {
    className: "md:absolute md:top-[850px] md:left-[15%]",
    rotate: "rotate-[2deg] md:rotate-[8deg]",
  },
];

export default function HowItWorks({
  features,
  className,
  stepPositions,
}: HowItWorksProps) {
  const defaultFeatures: Step[] = [
    {
      title: "Create Account",
      description:
        "Sign up in minutes. Enter your details and verify your email to get started.",
      colorTheme: "orange",
    },
    {
      title: "Verify Identity",
      description:
        "Complete your profile verification to ensure secure transactions and compliance.",
      colorTheme: "blue",
    },
    {
      title: "Select Plan",
      description:
        "Choose from a variety of investment plans tailored to your financial goals.",
      colorTheme: "purple",
    },
    {
      title: "Analyze & Invest",
      description:
        "Review returns and make your first investment with confidence.",
      colorTheme: "orange",
    },
    {
      title: "Track Growth",
      description:
        "Monitor your portfolio in real-time and watch your wealth grow over time.",
      colorTheme: "blue",
    },
  ];

  const data = features && features.length > 0 ? features : defaultFeatures;
  const positions = stepPositions || DEFAULT_CARD_POSITIONS;

  let height = 1130;
  if (data.length === 1) height = 400;
  else if (data.length === 2) height = 450;
  else if (data.length === 3) height = 800;
  else if (data.length === 4) height = 900;
  else height = 1130;

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={`relative overflow-hidden bg-[#F3EEE5] px-5 pb-20 pt-10 md:px-8 md:py-20 ${className}`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-100"
          style={{
            backgroundImage:
              "linear-gradient(rgba(122, 40, 61, 0.055) 1px, transparent 1px)",
            backgroundSize: "100% 32px",
            marginTop: "4px",
          }}
        />
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#C8F36A]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-24 h-80 w-80 rounded-full bg-[#7A283D]/8 blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div
            className="relative mx-auto flex h-auto w-full max-w-[1000px] flex-col gap-8 md:block md:h-[var(--md-height)]"
            style={{ "--md-height": `${height}px` } as React.CSSProperties}
          >
            {data.length > 1 && (
              <div className="pointer-events-none absolute bottom-10 right-1/2 top-10 border-r-2 border-dashed border-[#7A283D]/15 md:hidden" />
            )}
            {data.length > 1 && (
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block z-0"
                viewBox={`0 0 1000 ${height}`}
                preserveAspectRatio="none"
              >
                {(() => {
                  const pathD = data.reduce((acc, _, index) => {
                    if (index >= data.length - 1) return acc;
                    if (index === 0)
                      return "M 290 150 C 500 150, 550 270, 710 270";
                    if (index === 1)
                      return acc + " C 850 270, 500 350, 290 450";
                    if (index === 2)
                      return acc + " C 290 600, 550 720, 750 720";
                    if (index === 3)
                      return acc + " C 950 720, 500 800, 290 850";
                    return acc;
                  }, "");
                  return (
                    <m.path
                      d={pathD}
                      stroke="currentColor"
                      className="text-[#7A283D]/25"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{
                        strokeDashoffset: -140,
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  );
                })()}
              </svg>
            )}

            {data.map((step, index) => {
              const position = positions[index % positions.length];

              return (
                <Card
                  key={step.title}
                  number={`0${index + 1}`}
                  title={step.title}
                  description={step.description}
                  colorTheme={step.colorTheme || "blue"}
                  colors={step.colors}
                  rotate={position.rotate}
                  className={position.className}
                />
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
