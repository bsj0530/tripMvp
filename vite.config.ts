import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/tago": {
        target: "https://apis.data.go.kr",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/api\/tago/, "/1613000/SuburbsBusInfo"),
      },

      "/api/good-restaurant": {
        target: "https://apis.data.go.kr",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(
            /^\/api\/good-restaurant/,
            "/5090000/goodRestaurantStatusService",
          ),
      },

      "/api/kakao-local": {
        target: "https://dapi.kakao.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/kakao-local/, ""),
      },
    },
  },
});
