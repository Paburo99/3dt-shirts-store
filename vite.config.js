import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom'],
                    'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
                    'vendor-postprocessing': ['@react-three/postprocessing'],
                    'vendor-motion': ['framer-motion'],
                    'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-slot'],
                },
            },
        },
    },
});
