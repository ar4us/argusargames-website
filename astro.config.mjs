import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://argusargames.com",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "next-intl/server": path.resolve(__dirname, "./src/lib/i18n-context.tsx"),
        "next-intl": path.resolve(__dirname, "./src/lib/i18n-context.tsx"),
        "next/image": path.resolve(__dirname, "./src/components/ui/image.tsx"),
        "next/link": path.resolve(__dirname, "./src/i18n/navigation.tsx"),
      },
    },
  },
});
