import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: path.join(__dirname, "dist"),
    lib: {
      entry: path.resolve(__dirname, "src/exports.tsx"),
      formats: ["es", "umd"],
      name: 'index',
      fileName: (format) => `index.${format}.js`,
    },
  },
});
