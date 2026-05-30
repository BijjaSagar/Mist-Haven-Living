import { cn } from "@/lib/utils";
import { WaveUnderline } from "@/components/WaveDivider";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  dark?: boolean;
  showWave?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  dark = false,
  showWave = true,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-4 font-body text-xs font-medium uppercase tracking-[0.22em]",
            dark ? "text-sage" : "text-sage-deep",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-[2rem] leading-tight tracking-tight md:text-[2.5rem]",
          dark ? "text-pearl" : "text-taupe",
        )}
      >
        {title}
      </h2>
      {showWave && (
        <WaveUnderline
          className={cn(align === "center" && "mx-auto", dark && "opacity-80")}
        />
      )}
      {description && (
        <p
          className={cn(
            "mt-4 font-body text-[17px] leading-relaxed md:text-lg",
            dark ? "text-pearl/75" : "text-muted",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
