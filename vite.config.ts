import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import rollupNodePolyfills from 'rollup-plugin-polyfill-node';

import UnoCSS from "unocss/vite"

export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), UnoCSS(), nodePolyfills({
      globals: {
        Buffer: false,
        global: false,
        process: false,
      }
    })],
    optimizeDeps: {
    },
    build: {
      rollupOptions: {
        plugins: [
          rollupNodePolyfills({
            include: ["crypto"]
          })
        ]
      }
    },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
