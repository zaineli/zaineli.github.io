/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a fully static site into ./out for GitHub Pages.
  output: "export",
  // GitHub Pages has no Image Optimization server, so serve images as-is.
  images: { unoptimized: true },
  // Emit /route/index.html (not /route.html) so nested routes resolve cleanly
  // on a static host and survive a hard refresh.
  trailingSlash: true,
};

export default nextConfig;
