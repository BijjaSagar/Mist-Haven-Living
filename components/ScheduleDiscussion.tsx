import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

type ScheduleDiscussionProps = {
  calendlyUrl?: string | null;
};

export function ScheduleDiscussion({ calendlyUrl }: ScheduleDiscussionProps) {
  const url =
    calendlyUrl?.trim() ||
    process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() ||
    null;

  if (!url) {
    return (
      <div className="border border-hairline bg-oat p-8 text-center">
        <Calendar className="mx-auto h-8 w-8 text-sage-deep" />
        <h3 className="mt-4 font-display text-xl text-taupe">Schedule a Discussion</h3>
        <p className="mt-2 font-body text-sm text-muted">
          Book a call with our export team to discuss your program.
        </p>
        <Button asChild className="mt-6">
          <Link href="/contact#inquiry">Contact Us to Schedule</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-hairline bg-oat p-8">
      <div className="mb-6 text-center">
        <Calendar className="mx-auto h-8 w-8 text-sage-deep" />
        <h3 className="mt-4 font-display text-xl text-taupe">Schedule a Discussion</h3>
        <p className="mt-2 font-body text-sm text-muted">
          Pick a time that works for you — our export team is ready to help.
        </p>
        <Button asChild className="mt-4">
          <a href={url} target="_blank" rel="noopener noreferrer">
            Book on Calendly
          </a>
        </Button>
      </div>
      <iframe
        src={`${url}?hide_gdpr_banner=1`}
        title="Schedule a discussion with Mist & Haven Living"
        className="h-[520px] w-full border border-hairline bg-white"
        loading="lazy"
      />
    </div>
  );
}
