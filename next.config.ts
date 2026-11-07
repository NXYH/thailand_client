import { networkInterfaces } from "node:os"
import type { NextConfig } from "next"

// Next blocks its dev scripts on any address but localhost, which leaves pages visible but dead.
// Allow this machine's LAN addresses so `npm run dev` also works from a phone on the same Wi-Fi.
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((net) => net?.family === "IPv4" && !net.internal)
  .map((net) => net!.address)

const nextConfig: NextConfig = { allowedDevOrigins: lanAddresses }

export default nextConfig
