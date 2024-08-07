import { forwardRef, type SVGProps } from "react";
import { cn } from "@/lib/utils";

const AnimatedSpinner = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn(className)}
    >
      <g className="animated-spinner">
        <rect x="11" y="1" width="2" height="5" opacity=".14" />
        <rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29" />
        <rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43" />
        <rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57" />
        <rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71" />
        <rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86" />
        <rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)" />
      </g>
    </svg>
  ),
);
AnimatedSpinner.displayName = "AnimatedSpinner";

const CreditCard = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      viewBox="0 0 24 24"
      className={cn(className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
      <line x1="2" y1="10" x2="22" y2="10"></line>
    </svg>
  ),
);
CreditCard.displayName = "CreditCard";

const GoogleLogoIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      className={cn(className)}
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
    </svg>
  ),
);
GoogleLogoIcon.displayName = "GoogleLogoIcon";

const FacebookLogoIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      className={cn(className)}
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 24 24"
    >
      <title>Facebook</title>
      <path
        d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
      />
      </svg>
  ),
);

FacebookLogoIcon.displayName = "FacebookLogoIcon";

export { AnimatedSpinner, CreditCard, GoogleLogoIcon, FacebookLogoIcon };

export {
  EyeOpenIcon,
  EyeNoneIcon as EyeCloseIcon,
  SunIcon,
  MoonIcon,
  ExclamationTriangleIcon,
  ExitIcon,
  EnterIcon,
  RocketIcon,
  PlusIcon,
  HamburgerMenuIcon,
  Pencil2Icon,
  UpdateIcon,
  CheckCircledIcon,
  PlayIcon,
  // GearIcon,
  // TrashIcon,
  // ArchiveIcon,
  ResetIcon,
  FileTextIcon,
  IdCardIcon,
  PlusCircledIcon,
  FilePlusIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
  ArrowLeftIcon,
} from "@radix-ui/react-icons";

export {
  DiscordLogoIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
  CodeSandboxLogoIcon,
  LinkedInLogoIcon,
  InstagramLogoIcon,
  ModulzLogoIcon,
  IconJarLogoIcon,
  NotionLogoIcon,
  VercelLogoIcon,
  FigmaLogoIcon,
  FramerLogoIcon,
  SketchLogoIcon,
  StitchesLogoIcon
} from "@radix-ui/react-icons";

export {
  Chrome as ChromeLogoIcon,
  Codepen as CodepenLogoIcon,
  Feather as FeatherLogoIcon,
  Frame as FrameLogoIcon,
  Gitlab as GitlabLogoIcon,
  Hexagon as HexagonLogoIcon,
  Pocket as PocketLogoIcon,
  ShieldHalf as ShieldHalfLogoIcon,
  Slack as SlackLogoIcon,
  Target as TargetLogoIcon,
  Trello as TrelloLogoIcon,
  Twitch as TwitchLogoIcon,
  Youtube as YoutubeLogoIcon,
} from "lucide-react";
