"use client";

import { useRef } from "react";
import { CheckCircle } from "lucide-react";
import { useCounterAnimation } from "@/hooks/use-counter-animation";

/**
 * Stat interface
 */
interface Stat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

/**
 * Stats data matching screenshot (2.png)
 * Single row red banner with checkmarks
 */
const stats: Stat[] = [
  {
    id: "1",
    prefix: "Since",
    label: "",
    value: 2021,
    suffix: "",
  },
  {
    id: "2",
    label: "Global Brands",
    value: 40,
    suffix: "+",
  },
  {
    id: "3",
    label: "Industries",
    value: 25,
    suffix: "+",
  },
  {
    id: "4",
    label: "Rating",
    value: 96,
    suffix: "%",
  },
];

/**
 * Stats Bar Section Component
 *
 * Single row layout matching screenshot (2.png):
 * - Full width red/coral background
 * - 4 stats in a single inline row
 * - Checkmark icons before each stat
 * - Format: "✓ Since 2021  ✓ 40+ Global Brands  ✓ 25+ Industries  ✓ 96% Rating"
 *
 * Features:
 * - GSAP counter animation (0 to target value)
 * - Responsive layout (maintains inline on tablet/desktop)
 * - Uses Lucide icons instead of SVGs
 *
 * @example
 * ```tsx
 * <StatsBar />
 * ```
 */
export default function StatsBar() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={sectionRef} 
      className="bg-primary py-4 text-primary-foreground"
      aria-label="Company statistics"
    >
      <div className="mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-6xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.id} className="flex justify-center">
              <StatItem stat={stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Individual Stat Item Component
 * Displays as: ✓ [prefix] value[suffix] label
 */
function StatItem({ stat }: { stat: Stat }) {
  const { value, ref } = useCounterAnimation({
    endValue: stat.value,
    duration: 2,
    scrollTrigger: true, // Enable GSAP ScrollTrigger for scroll-based animation
  });

  return (
    <div className="flex items-center gap-2">
      {/* Checkmark Icon */}
      <CheckCircle className="h-5 w-5 flex-shrink-0" />

      {/* Stat Content */}
      <div className="flex items-baseline gap-1 whitespace-nowrap">
        {stat.prefix && (
          <span className="text-sm font-medium">{stat.prefix}</span>
        )}
        <span ref={ref} className="text-lg font-bold">
          {value}
        </span>
        {stat.suffix && (
          <span className="text-lg font-bold">{stat.suffix}</span>
        )}
        {stat.label && (
          <span className="text-sm font-medium ml-1">{stat.label}</span>
        )}
      </div>
    </div>
  );
}
