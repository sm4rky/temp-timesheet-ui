import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/shadcn/button";
import { ArrowLeft } from "lucide-react";
import leaveBalanceService from "@/services/leaveBalance";

/** Helpers */
function getDisplayName(): string {
  if (process.env.NEXT_PUBLIC_DISPLAY_NAME) return process.env.NEXT_PUBLIC_DISPLAY_NAME;
  const email = process.env.NEXT_PUBLIC_USER_EMAIL || "user@infodatinc.com";
  const local = email.split("@")[0].replace(/[._-]/g, " ");
  return local
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}
function todayMMDDYYYY() {
  const d = new Date();
  const mm = String(d.getMonth() + 1);
  const dd = String(d.getDate());
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export default function TimeOffPage() {
  const router = useRouter();
  const displayName = getDisplayName();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["leave-balance"],
    queryFn: leaveBalanceService.getLeaveBalance,
    staleTime: 5 * 60 * 1000,
  });

  /** Yellow tile used three times */
  const Tile = ({
    title,
    value,
    subText,
    emphasize = false,
  }: {
    title: string;
    value?: string;
    subText?: string;
    emphasize?: boolean;
  }) => (
    <div className="w-[300px] rounded-md border border-primary shadow-inner bg-secondary mx-auto">
      <div className="px-6 py-5 text-center">
        <div className="text-primary font-extrabold text-[24px] leading-tight">
          {title}
        </div>
        <div
          className={
            emphasize
              ? "mt-2 text-primary font-extrabold text-[22px]"
              : "mt-2 text-primary font-semibold text-[16px]"
          }
        >
          {value ?? "days"}
        </div>
        <div className="mt-1 text-primary text-[14px]">
          {subText ?? "days"}
        </div>
      </div>
    </div>
  );

  const carried = !isLoading && !isError ? String(data?.carriedOverDays ?? 0) : undefined;
  const current = !isLoading && !isError ? String(data?.currentYearDays ?? 0) : undefined;
  const balance =
    !isLoading && !isError ? `${String(data?.leaveBalance ?? 0)} days` : undefined;
  const used = !isLoading && !isError ? String(data?.usedPtoDays ?? 0) : "-";

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      {/* Outer card shell to match your other pages */}
      <div className="w-full max-w-md bg-background rounded-lg shadow-lg overflow-hidden">
        {/* Header bar — yellow, round back button, centered title, right logo */}
        <div className="flex items-center justify-between bg-secondary px-3 py-2">
          <Button
            variant="ghost"
            className="p-0 rounded-full w-9 h-9 border border-primary bg-secondary text-primary hover:bg-secondary"
            onClick={() => router.push("/Home")}
            aria-label="Back"
            title="Back"
          >
            <ArrowLeft className="text-primary" size={18} />
          </Button>

          <div className="text-center text-primary font-extrabold text-lg select-none">
            Time Off
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

        {/* Body — dark background, light text (from tokens) */}
        <div className="w-full flex flex-col items-center bg-background text-foreground">
          {/* Name heading with line-break like screenshot */}
          <div className="mt-6 text-center font-extrabold text-[24px] leading-snug">
            {displayName}&apos;s Leave
            <br />
            Balance
          </div>

          {/* Stacked yellow tiles */}
          <div className="mt-6 flex flex-col items-center gap-6">
            <Tile title="Carried Over" value={carried} />
            <Tile title="Current Year" value={current} />
            <Tile title="Leave Balance" value={balance} subText="Available" emphasize />
          </div>

          {/* Footer lines in yellow (use secondary for the exact yellow) */}
          <div className="mt-8 text-center font-extrabold text-[20px] text-secondary">
            As of Today: {todayMMDDYYYY()}
            <br />
            <span className="mt-2 inline-block">Used P.T.O: {used} days</span>
          </div>

          {isError && (
            <div className="mt-3 text-destructive text-sm pb-4">
              {(error as Error)?.message ?? "Failed to load leave balance"}
            </div>
          )}
          {!isError && <div className="pb-4" />}
        </div>
      </div>
    </div>
  );
}
