import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    checker({
      typescript: true,
    }),
  ],
  build: {
    outDir: 'build',
    sourcemap: false,
    minify: 'terser',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          // Material-UI components
          if (id.includes('@mui/material')) {
            return 'mui-material';
          }
          // Material-UI system and styles
          if (id.includes('@mui/system') || id.includes('@emotion')) {
            return 'mui-system';
          }
          // Redux and state management
          if (id.includes('redux') || id.includes('@reduxjs')) {
            return 'redux-vendor';
          }
          // Router
          if (id.includes('react-router')) {
            return 'router-vendor';
          }
          // Charts and data visualization
          if (id.includes('echarts') || id.includes('chart')) {
            return 'charts-vendor';
          }
          // Other large dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
