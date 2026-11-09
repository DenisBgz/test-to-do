import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Относительные пути позволяют открыть сборку из вложенной папки.
  base: './',
})
