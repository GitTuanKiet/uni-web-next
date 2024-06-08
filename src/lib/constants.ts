// import { prefixPath } from "./utils";

const prefixPath = (path: string) => {
  return process.env.NEXT_PUBLIC_APP_URL + path;
}

export const DATABASE_PREFIX = "uni";
export const EMAIL_SENDER = '"Uni" <no-reply@pluginai.dev>';
export const LIMITED_API_KEY = 5;
export const LIMITED_REQUEST = 60;
export const INTERVAL_SECONDS = 60;

export const Paths = {
  Home: prefixPath("/"),
  Login: prefixPath("/login"),
  Signup: prefixPath("/signup"),
  Dashboard: prefixPath("/dashboard"),
  VerifyEmail: prefixPath("/verify-email"),
  ResetPassword: prefixPath("/reset-password"),
  Billing: prefixPath("/dashboard/billing"),
  Settings: prefixPath("/dashboard/settings"),
}

export const Info_App = {
  title: "Uni",
  description: "Uni is a AI platform for everyone.",
  version: "1.0.0",
  twitterUrl: "https://twitter.com",
  facebookUrl: "https://www.facebook.com",
  discordUrl: "https://discord.com",
};

export const routes = [
  { name: "Dashboard", href: Paths.Dashboard },
  { name: "Documentation", href: prefixPath("/#documentation") },
] as const;

export const proxies = [
  {
    path: "content",
    target: "http://164.92.105.13:5001/api/v1",
  },
  {
    path: "stock",
    target: "https://stock.pluginai.dev",
  },
];
