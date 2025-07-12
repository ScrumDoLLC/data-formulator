import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-analysis.html', // Output file for the analysis
      open: true, // Automatically open the analysis in the browser
    }),
  ],
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
