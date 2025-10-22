import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { ReactElement, ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/shadcn/sonner";
import MainLayout from "@/layouts/MainLayout";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
        },
      })
  );

  // By default, wrap pages in MainLayout (gives us the 9:16 frame).
  // Pages can still override with their own getLayout if needed.
  const getLayout =
    Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {getLayout(<Component {...pageProps} />)}
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
