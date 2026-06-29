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

  /* Performance knobs.
     - target: es2020 covers ~98% of browsers in 2026 and lets Vite
       skip transpiling modern syntax through @vitejs/plugin-react
       for most files. Cuts build time and (slightly) the bundle.
     - cssCodeSplit: per-route CSS chunks so Menu / Gallery / Hero
       don't ship each other's unused Tailwind utilities. (v4 emits
       one CSS file by default; we split it by entry.)
     - assetsInlineLimit: anything smaller than 4KB stays a data
       URI inline (favicons, SVGs); anything larger becomes a real
       file so the browser can stream it in parallel with the JS.
     - rollupOptions.output.manualChunks: split framer-motion, the
       Lenis smooth-scroll helper, and the AI assistant widget
       into their own chunks. Browsers can cache them across
       deploys because their content hashes don't change with
       menu copy edits. */
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "es2020",
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Rolldown (this Vite's bundler) requires manualChunks as a
        // function rather than an object map. Anything imported from
        // "react"/"react-dom" or "framer-motion" gets hoisted into
        // its own chunk so re-deploys with copy-only changes don't
        // bust their caches.
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/scheduler/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/framer-motion") || id.includes("node_modules/@react-spring") || id.includes("node_modules/motion-")) {
            return "motion";
          }
          return undefined;
        },
      },
    },
  },
});
