import type { NextConfig } from "next";

/* GitHub Pages раздаёт сайт из подпапки /warehouse — включается в CI */
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* полностью статический сайт — деплоится на любой статик-хостинг */
  output: "export",
  basePath: isGitHubPages ? "/warehouse" : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
