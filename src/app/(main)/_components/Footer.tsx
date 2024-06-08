import { FacebookLogoIcon, TwitterLogoIcon } from "@/components";
import { BrainCircuit } from "lucide-react";
import { Info_App } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="px-4 py-10">
      <div className="container flex items-center p-0">
        <p className="text-sm flex">
          <BrainCircuit className="mr-2 h-6 w-6" />
          @{Info_App.title} platform{" "}
          <a className="underline underline-offset-4" href={Info_App.facebookUrl}>
            <FacebookLogoIcon className="h-4 w-4 mx-2" />
          </a>
          <a className="underline underline-offset-4" href={Info_App.twitterUrl}>
            <TwitterLogoIcon className="h-4 w-4 mx-2" />
          </a>
        </p>
        <div className="ml-auto">{Info_App.title}</div>
      </div>
    </footer>
  );
};
