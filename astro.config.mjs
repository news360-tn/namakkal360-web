// Namakkal 360 website: Astro (server pages) on Cloudflare Workers, styled only with Tailwind CSS
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server",
  devToolbar: { enabled: false },
  session: false,      // no logins or sessions on this site: no extra Cloudflare KV store needed
  adapter: cloudflare({ imageService: "passthrough", imagesBindingName: false }),      // story pictures are already sized by Cloudinary
  site: "https://news360.pages.dev",      // owner 26 Nov: the public address (a small Pages site in front of this worker - pages/)
  vite: { plugins: [tailwindcss()] },
});
