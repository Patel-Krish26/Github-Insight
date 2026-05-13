import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // Force single React instance
            react: 'react',
            'react-dom': 'react-dom',
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', '@clerk/clerk-react'],
    },
})