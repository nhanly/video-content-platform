"use client";

import { ThemeProvider } from "./theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = React.useRef<QueryClient>(null);
  if (!queryClient.current) {
    queryClient.current =
      typeof window === "undefined"
        ? makeQueryClient()
        : (browserQueryClient ??= makeQueryClient());
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient.current}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
