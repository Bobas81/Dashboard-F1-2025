import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Dashboard-F1-2025/' : '/',
  plugins: [react()],
}));
