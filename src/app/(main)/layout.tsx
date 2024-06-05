import { type ReactNode } from "react";
import { Header } from "@lib/components/layout/header";
import { Footer } from "@lib/components/layout/footer";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
