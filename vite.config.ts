import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  // Served from the apex custom domain (fufuart.com), so the site lives at
  // the root path in every environment.
  base: "/",
  server: {
    host: "0.0.0.0",
  },
});
