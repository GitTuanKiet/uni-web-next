import { Info_App } from "@lib/constants";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { Header } from "@lib/components/layout/header";
import { Footer } from "@lib/components/layout/footer";

export const metadata: Metadata = {
  title: Info_App.title,
  description: `Landing page for ${Info_App.title}`,
};

function LandingPageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <div className="h-20"></div>
      <Footer />
    </>
  );
}

export default LandingPageLayout;
