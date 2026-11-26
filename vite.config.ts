import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Web běží na vlastní (sub)doméně v kořeni, proto je base '/'.
// Při nasazení do podsložky (např. GitHub Pages) nastavte BASE_PATH=/nazev-repa/ .
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 900 },
});
