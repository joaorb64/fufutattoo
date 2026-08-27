import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  // GitHub Pages project sites are served from /<repo-name>/, so only use
  // that base when building in CI; local dev/build/preview stay at "/".
  base: process.env.GITHUB_ACTIONS ? "/fufutattoo/" : "/",
  server: {
    host: "0.0.0.0",
  },
});
