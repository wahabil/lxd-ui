import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  server: {
    port: 3000,
    proxy: {
      "/ui/assets": {
        target: "https://localhost:8407/",
        rewrite: (path) => path.replace(/^\/ui/, ""),
        secure: false,
      },
    },
  },
});
