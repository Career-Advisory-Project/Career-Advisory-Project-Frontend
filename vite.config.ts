import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  server: {
    proxy: {
<<<<<<< HEAD
      '/api': {
        target: 'http://127.0.0.1:3658/m1/1161078-1154369-default',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
=======
      "/api": {
        target: "http://127.0.0.1:3658/m1/1161078-1154369-default",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
>>>>>>> d57df21762131c5f6d7648ef9b1178714492c1f5
