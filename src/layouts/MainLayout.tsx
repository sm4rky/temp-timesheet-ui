import { Button } from "@/components/shadcn/button";
import { useTheme } from "@/providers/ThemeProvider";
import { ReactNode } from "react";
import { toast } from "sonner";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { toggleTheme } = useTheme();

  return (
    <div className="relative h-screen w-screen flex flex-col bg-background">

      {/* Just for testing, remove when designing new layout */}
      <div className="absolute left-2 top-2 space-x-4">
        <Button onClick={toggleTheme}>Toggle theme</Button>
        <Button onClick={() => toast("Test sonner for notification popup")}>
          Test Sonner
        </Button>
      </div>

      <main className="flex-1">{children}</main>
    </div>
  );
}
