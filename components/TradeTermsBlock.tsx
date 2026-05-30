import { FadeUp } from "@/components/motion/FadeUp";

type Term = {
  label: string;
  value: string;
};

type TradeTermsBlockProps = {
  terms: Term[];
};

export function TradeTermsBlock({ terms }: TradeTermsBlockProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {terms.map((term, index) => (
        <FadeUp key={term.label} delay={index * 0.04}>
          <div className="border border-hairline bg-white p-5">
            <p className="font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
              {term.label}
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-taupe">
              {term.value}
            </p>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
