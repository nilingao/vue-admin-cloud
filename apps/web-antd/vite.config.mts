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
            target: 'https://www.nilongao.cn/basic-api',
            ws: true,
          },
        },
      },
    },
  };
});
