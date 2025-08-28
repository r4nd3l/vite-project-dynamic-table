import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path"; // Import resolve from path

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      vue: resolve(__dirname, "node_modules/vue/dist/vue.esm-bundler.js"), // Add alias for Vue
    },
  },
});
