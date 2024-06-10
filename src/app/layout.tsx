import "@/styles/globals.css";
// import "@/styles/mobile.css";
// import "@/styles/style.css";

import { TRPCReactProvider } from "@/trpc/react";
import { Providers, TailwindIndicator } from "@/components";
import { Info_App } from "@/lib/constants";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: Info_App.title,
    template: `%s | ${Info_App.title}`,
  },
  description: Info_App.description,
  icons: [{ rel: "icon", url: "/icon.png" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen overflow-x-hidden bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
