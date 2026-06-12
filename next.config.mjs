/** @type {import('next').NextConfig} */
const nextConfig = {
  // Baileys is a server-only package; keep it out of the client bundle.
  serverExternalPackages: ["@whiskeysockets/baileys"],
};

export default nextConfig;
