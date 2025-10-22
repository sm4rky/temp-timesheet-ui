import { Button } from "@/components/shadcn/button";
import { useTheme } from "@/providers/ThemeProvider";
import { ReactNode } from "react";
import { toast } from "sonner";

/**
 * MainLayout
 * - 9:16 frame provided by global .viewport/.frame css
 * - We DO NOT make the entire page scroll. Children manage their own scroll areas.
 */
export default function MainLayout({ children }: { children: ReactNode }) {
  const { toggleTheme } = useTheme();

  return (
    <div className="viewport">
      <div className="frame relative flex flex-col">
        {/* Dev buttons; remove when done */}
        {/* <div className="absolute left-2 top-2 z-10 space-x-2">
          <Button onClick={toggleTheme}>Toggle theme</Button>
          <Button onClick={() => toast("Test sonner for notification popup")}>
            Test Sonner
          </Button>
        </div> */}

        {/* IMPORTANT: use a local wrapper so pages can control their own scroll.
           We avoid the global `.frame-body` rule to prevent page-wide scrolling. */}
        <div className="frame-body-local h-full w-full overflow-hidden">
          <main className="h-full w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
