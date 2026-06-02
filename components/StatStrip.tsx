"use client";

import { CountUpStat } from "@/components/CountUpStat";
import { FadeUp } from "@/components/motion/FadeUp";

type Stat = {
  value: string;
  label: string;
};

type StatStripProps = {
  stats: Stat[];
  dark?: boolean;
  /** Show only first N stats (default: all) */
  limit?: number;
};

export function StatStrip({ stats, dark = true, limit }: StatStripProps) {
  const displayStats = limit ? stats.slice(0, limit) : stats;

  if (displayStats.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid grid-cols-2 gap-8 md:gap-10 lg:grid-cols-4 ${dark ? "text-pearl" : "text-taupe"}`}
    >
      {displayStats.map((stat, index) => (
        <FadeUp key={stat.label} delay={index * 0.08}>
          <CountUpStat
            value={stat.value}
            label={stat.label}
            dark={dark}
            className="text-center"
          />
        </FadeUp>
      ))}
    </div>
  );
}
