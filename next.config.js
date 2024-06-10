const { env } = await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  assetPrefix: env.NEXT_PUBLIC_PREFIX === "/" ? "" : env.NEXT_PUBLIC_PREFIX,
  output: env.NODE_ENV === "production" ? "standalone" : undefined,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default config;
