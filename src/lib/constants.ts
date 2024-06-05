
export const DATABASE_PREFIX = "uni";
export const EMAIL_SENDER = '"Uni" <no-reply@pluginai.dev>';
export const LIMITED_API_KEY = 5;
export const LIMITED_REQUEST = 600;
export const INTERVAL_SECONDS = 60;

export enum Paths {
  Home = "/",
  Login = "/login",
  Signup = "/signup",
  Dashboard = "/dashboard",
  VerifyEmail = "/verify-email",
  ResetPassword = "/reset-password",
  Billing = "/dashboard/billing",
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
  { name: "Dashboard", href: "/dashboard" },
  { name: "Technologies", href: "/#technologies" },
  { name: "Documentation", href: "/#documentation" },
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