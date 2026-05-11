import type { NextConfig } from "next";
import path from "node:path";

// ディレクトリ名に日本語（マルチバイト文字）が含まれると Turbopack が内部で panic するため、
// 当面 webpack をデフォルトとする。outputFileTracingRoot は親ディレクトリの lockfile 誤検知を抑止。
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  // cloudflared tunnel や ngrok 等の外部オリジンからの dev server アクセスを許可
  allowedDevOrigins: ["*.trycloudflare.com", "*.ngrok-free.app", "*.ngrok.app"],
};

export default nextConfig;
