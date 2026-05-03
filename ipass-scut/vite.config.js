import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Multi-page: index.html (lista + edição) e mapa-retaguarda.html (mapa interativo).
export default defineConfig({
    root: '.',
    publicDir: 'assets',
    server: {
        port: 5500,
        host: '127.0.0.1',
        strictPort: false,
        open: '/index.html',
    },
    preview: {
        port: 5500,
        host: '127.0.0.1',
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                mapa: resolve(__dirname, 'mapa-retaguarda.html'),
            },
        },
    },
});
