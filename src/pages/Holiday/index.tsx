import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import holidayService from "@/services/holiday";
import { Button } from "@/components/shadcn/button";
import { ArrowLeft } from "lucide-react";

function formatHolidayDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  const mon = d.toLocaleString(undefined, { month: "short" });
  const day = d.toLocaleString(undefined, { day: "numeric" });
  return `${mon} ${day}`;
}

export default function HolidayPage() {
  const router = useRouter();
  const { data: holidays, isLoading, isError, error } = useQuery({
    queryKey: ["holidays"],
    queryFn: holidayService.getAllHolidays,
    staleTime: 5 * 60 * 1000,
  });

  return (
    /* Fill the frame; header fixed; list scrolls; no max-width shells */
    <div className="h-full w-full flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between bg-secondary px-3 py-2">
        <Button
          variant="ghost"
          className="p-0 rounded-full w-9 h-9 border border-primary bg-secondary text-primary hover:bg-secondary"
          onClick={() => router.push("/Home")}
          title="Back"
          aria-label="Back"
        >
          <ArrowLeft className="text-primary" size={18} />
        </Button>

        <div className="text-center text-primary font-extrabold text-lg select-none">
          Infodat Holidays
        </div>

        <div className="w-16 h-7 relative mr-[2px]">
          <Image
            src="/infodat-logo.png"
            alt="Infodat"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Body (scrolls) */}
      <div className="flex-1 overflow-auto px-5 pt-4 pb-6">
        {/* Intro copy — same feel as reference (left-aligned, narrow measure) */}
        <p className="text-[15.5px] leading-snug mb-4 max-w-[460px]">
          Below is a list of our company&apos;s paid holidays which our office will be
          closed in 2025.
        </p>

        {isLoading && <div className="text-muted-foreground py-2">Loading…</div>}
        {isError && (
          <div className="text-destructive py-2">
            {(error as Error)?.message ?? "Failed to load holidays"}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="pt-1">
            {holidays?.map((h) => (
              <div key={h.id} className="flex items-end gap-3 py-3">
                {/* Underlined holiday name */}
                <div className="underline underline-offset-2 text-[18px] font-semibold whitespace-nowrap">
                  {h.holidayName}
                </div>

                {/* Connecting rule */}
                <div className="flex-1 border-b border-muted opacity-80 translate-y-[-2px]" />

                {/* Underlined date */}
                <div className="underline underline-offset-2 text-[18px] whitespace-nowrap">
                  {formatHolidayDate(h.holidayDate)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
