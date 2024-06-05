import { LightningBoltIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Info_App } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="px-4 py-10">
      <div className="container flex items-center p-0">
        <LightningBoltIcon className="mr-2 h-6 w-6" />
        <p className="text-sm">
          @{Info_App.title} platform{" "}
          . Join us on{" "}
          <a className="underline underline-offset-4" href={Info_App.facebookUrl}>
            Facebook
          </a>
          {" "} and {" "}
        </p>
          <a className="underline underline-offset-4" href={Info_App.twitterUrl}>
            <TwitterLogoIcon className="h-4 w-4 mx-2" />
          </a>
        <div className="ml-auto">{Info_App.title}</div>
      </div>
    </footer>
  );
};
