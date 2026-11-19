import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// three.js được tải động từ hero (import('./capsuleScene')), nên tự tách thành chunk riêng.
export default defineConfig({
  plugins: [react()],
});
