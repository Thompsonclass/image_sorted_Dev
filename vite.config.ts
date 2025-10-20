// vite.config.ts
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // ✅ Netlify(기본 빌드)는 '/', GitHub Pages 전용 모드는 '/image_sorted_Dev/'
  const basePath = env.VITE_BASE_PATH || (mode === 'ghpages' ? '/image_sorted_Dev/' : '/');

  return {
    base: basePath,
    server: { port: 3000, host: '0.0.0.0' },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  };
});
