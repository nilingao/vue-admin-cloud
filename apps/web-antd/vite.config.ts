import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/basic-api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/basic-api/, ''),
            // mock代理目标地址
            target: 'http://127.0.0.1:9190',
            ws: true,
          },
        },
      },
    },
  };
});
