import { FacebookLogoIcon, TwitterLogoIcon } from "@/components";
import { Info_App } from "@/lib/constants";
import LogoIcon from "@/app/logo";

export const Footer = () => {
  return (
    <footer className="px-4 py-10">
      <div className="container flex items-center p-0">
        <p className="text-sm flex justify-center items-center gap-2">
          <LogoIcon className="h-16 w-24 mr-2"/>
          <a className="underline underline-offset-4" href={Info_App.facebookUrl}>
            <FacebookLogoIcon className="h-4 w-4 mx-2 dark:bg-white" />
          </a>
          <a className="underline underline-offset-4" href={Info_App.twitterUrl}>
            <TwitterLogoIcon className="h-4 w-4 mx-2" />
          </a>
        </p>
      </div>
    </footer>
  );
};
