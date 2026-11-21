/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_BUILD_EXPORT === "1";

const nextConfig = {
  ...(isExport
    ? { output: "export", distDir: "out" }
    : {
        async rewrites() {
          return [
            {
              source: "/api/:path*",
              destination: "http://127.0.0.1:5500/api/:path*",
            },
          ];
        },
      }),
  images: { unoptimized: true },
};

export default nextConfig;
