import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    server: { open: true },
    plugins: [
        react(),
        tsconfigPaths(),
        svgr({
            include: '**/*.svg?react',
        }),
        eslint(),
    ],
    build: {
        outDir: 'build',
    },
});
