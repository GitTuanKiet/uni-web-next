import Link from "next/link";
import { type Metadata } from "next";
import { PlusIcon } from "@lib/components/icons";
import { Button } from "@lib/components/ui/button";
import {
  Drizzle,
  LuciaAuth,
  NextjsLight,
  NextjsDark,
  ReactJs,
  ShadcnUi,
  TRPC,
  TailwindCss,
  StripeLogo,
  ReactEmail,
} from "./_components/technologies-icons";
import CardSpotlight from "./_components/hover-card";

export const metadata: Metadata = {
  title: "A universal AI platform",
  description:
    "A Universal AI Platform for all your data needs. UniData is a platform that allows you to creative, automatic, smart, and secure any thing in one place.",
};

const technologies = [
  {
    name: "Next.js",
    description: "The React Framework for Production",
    logo: NextjsIcon,
  },
  {
    name: "React.js",
    description: "A JavaScript library for building user interfaces",
    logo: ReactJs,
  },
  {
    name: "Tailwind CSS",
    description: "A utility-first CSS framework",
    logo: TailwindCss,
  },
  {
    name: "TRPC",
    description: "The Realtime GraphQL & REST API",
    logo: TRPC,
  },
  {
    name: "Shadcn UI",
    description: "A collection of UI components",
    logo: ShadcnUi,
  },
  {
    name: "Lucia Auth",
    description: "Authentication for Next.js",
    logo: LuciaAuth,
  },
  {
    name: "Stripe",
    description: "Online payment processing for internet businesses",
    logo: StripeLogo,
  },
  {
    name: "React Email",
    description: "A React component for rendering HTML emails",
    logo: ReactEmail,
  },
  {
    name: "Database",
    description: "Drizzle with postgres database",
    logo: Drizzle,
  },
];

const HomePage = () => {
  return (
    <>
      <section className="mx-auto grid min-h-[calc(100vh-300px)] max-w-5xl flex-col  items-center justify-center gap-4 py-10 text-center  md:py-12">
        <div className="p-4">
          <div className="mb-10 flex items-center justify-center gap-3">
            <NextjsIcon className="h-[52px] w-[52px]" />
            <PlusIcon className="h-8 w-8" />
            <LuciaAuth className="h-14 w-14" />
          </div>
          <h1 className="text-balance bg-gradient-to-tr  from-black/70 via-black to-black/60 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-zinc-400/10 dark:via-white/90 dark:to-white/20  sm:text-5xl md:text-6xl lg:text-7xl">
            Universal AI platform
          </h1>
          <p className="mb-10 mt-4 text-balance text-center text-muted-foreground md:text-lg lg:text-xl">
            UniData is a platform that allows you to creative, automatic, smart, and secure any
            thing in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
      <section>
        <div className="container mx-auto lg:max-w-screen-lg">
          <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
            <a id="technologies" className="anchor" /> Technologies
          </h1>
          <p className="mb-10 text-balance text-center text-muted-foreground md:text-lg lg:text-xl">
            UniData is built with the latest technologies to provide the best experience for our
            users.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {technologies.map((technology, i) => (
              <CardSpotlight
                key={i}
                name={technology.name}
                description={technology.description}
                logo={<technology.logo className="h-12 w-12" />}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

function NextjsIcon({ className }: { className?: string }) {
  return (
    <>
      <NextjsLight className={className + " dark:hidden"} />
      <NextjsDark className={className + " hidden dark:block"} />
    </>
  );
}
