import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/* base path is env-driven so the same build runs on:
   - GitHub Pages: VITE_BASE defaults to '/Coffeshop-E-Commerce-Website/'
   - Vercel:        set VITE_BASE="/" in the project env vars
   - Custom domain: set VITE_BASE="/"  */
const base = process.env.VITE_BASE || "/Coffeshop-E-Commerce-Website/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
