const { env } = await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  assetPrefix: env.NODE_ENV === "production" ? "/user" : "",
  output: env.NODE_ENV === "production" ? "standalone" : undefined,
};

export default config;
