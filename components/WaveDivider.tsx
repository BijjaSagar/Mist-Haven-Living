import { cn } from "@/lib/utils";

type WaveDividerProps = {
  className?: string;
  flip?: boolean;
  variant?: "sage" | "pearl" | "oat" | "taupe";
};

const fillMap = {
  sage: "var(--sage)",
  pearl: "var(--pearl)",
  oat: "var(--oat)",
  taupe: "var(--taupe)",
};

export function WaveDivider({
  className,
  flip = false,
  variant = "sage",
}: WaveDividerProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden leading-none",
        flip && "rotate-180",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-8 w-full md:h-10"
        preserveAspectRatio="none"
      >
        <path
          d="M0 24C120 8 240 40 360 24C480 8 600 40 720 24C840 8 960 40 1080 24C1200 8 1320 40 1440 24V48H0V24Z"
          fill={fillMap[variant]}
        />
        <path
          d="M0 20C180 36 360 4 540 20C720 36 900 4 1080 20C1260 36 1440 4 1440 20"
          stroke={fillMap[variant]}
          strokeWidth="1.5"
          strokeOpacity="0.5"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function WaveUnderline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("mt-3 h-2 w-24", className)}
      aria-hidden="true"
    >
      <path
        d="M0 4C15 1 30 7 45 4C60 1 75 7 90 4C105 1 120 7 120 4"
        stroke="var(--sage)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
