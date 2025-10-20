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
  <div className="min-h-screen flex items-center justify-center bg-primary p-4">
    <div className="w-full max-w-md bg-background rounded-lg shadow-lg p-4 space-y-4">
        {/* Header: yellow bar, round back button, centered title, right logo */}
        <div className="flex items-center justify-between bg-secondary px-3 py-2">
          {/* round back button like the screenshot */}
          <Button
            variant="ghost"
            className="p-0 rounded-full w-9 h-9 border border-black bg-secondary text-primary hover:bg-secondary"
            onClick={() => router.push("/Home")}
            title="Back"
            aria-label="Back"
          >
            <ArrowLeft className="text-primary" size={18} />
          </Button>

          <div className="text-center text-primary font-extrabold text-lg select-none">
            Infodat Holidays
          </div>

          {/* Right logo (add /public/infodat-logo.png) */}
          <div className="w-10 h-7 relative">
            <Image
              src="/infodat-logo.png"
              alt="Infodat"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-foreground text-[15.5px] leading-snug mb-2 max-w-[440px]">
            Below is a list of our company's paid
            holidays which our office will be closed in 2025.
          </p>

          {isLoading && (
            <div className="text-muted-foreground py-2">Loading…</div>
          )}
          {isError && (
            <div className="text-destructive py-2">
              {(error as Error)?.message ?? "Failed to load holidays"}
            </div>
          )}

          {!isLoading && !isError && (
            <div className="pt-2">
              {holidays?.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center gap-2 py-3"
                >
                  {/* underlined name */}
                  <div className="text-foreground underline underline-offset-2 font-semibold text-[18px] whitespace-nowrap">
                    {h.holidayName}
                  </div>

                  {/* faint rule connecting to the date */}
                  <div className="flex-1 border-b border-muted opacity-70 translate-y-[-2px]" />

                  {/* underlined date */}
                  <div className="text-foreground underline underline-offset-2 text-[18px] whitespace-nowrap">
                    {formatHolidayDate(h.holidayDate)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
