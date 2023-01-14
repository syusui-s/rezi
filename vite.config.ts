// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    extensions: ['jsx'],
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@/': `${__dirname}/src/`,
    },
  },
});
