import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import yaml from "vite-plugin-yaml";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), yaml],
  base: "/",
  server: {
    host: "0.0.0.0",
  },
});
