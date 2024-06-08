import { type ReactNode } from "react";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";

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
