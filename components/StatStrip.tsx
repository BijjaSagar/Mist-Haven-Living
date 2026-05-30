import { FadeUp } from "@/components/motion/FadeUp";

type Stat = {
  value: string;
  label: string;
};

type StatStripProps = {
  stats: Stat[];
  dark?: boolean;
};

export function StatStrip({ stats, dark = false }: StatStripProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6 ${dark ? "text-pearl" : "text-taupe"}`}
    >
      {stats.map((stat, index) => (
        <FadeUp key={stat.label} delay={index * 0.05}>
          <div className="text-center lg:text-left">
            <p
              className={`font-display text-3xl md:text-4xl ${dark ? "text-pearl" : "text-sage-deep"}`}
            >
              {stat.value}
            </p>
            <p
              className={`mt-2 font-body text-xs uppercase tracking-[0.12em] ${dark ? "text-pearl/70" : "text-muted"}`}
            >
              {stat.label}
            </p>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
