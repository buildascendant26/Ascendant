import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Split Three.js into its own chunk — only loaded when
            // ParticleSphereBackground mounts via React.lazy()
            three: ['three'],
            // Split GSAP — only loaded by TerminalGlitchOverlay
            gsap: ['gsap'],
            // Split Framer Motion — used across many components but can
            // still benefit from being cacheable independently
            motion: ['motion'],
            // React Router — small but stable, benefits from long-term cache
            router: ['react-router-dom'],
          },
        },
      },
      // Target modern browsers for smaller output
      target: 'es2020',
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
