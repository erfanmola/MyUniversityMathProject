import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import svgLoader from 'vite-svg-loader'


export default defineConfig({
    plugins: [
        vue(),
        svgLoader({
            svgoConfig: {
                full: true,
                plugins: [
                    {
                        name: 'cleanupListOfValues',
                        params: {
                            overrides: {
                                cleanupIDs: false
                            },
                        }
                    }
                ]
            }
        }),
        VitePWA({ 
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}']
            },
            manifest: {
                name: 'پروژه دانشگاهی من',
                short_name: 'university',
                description: 'پروژه های دانشگاهی ریاضی من',
                theme_color: '#D32F2F',
                icons: [
                  {
                    src: '/MyUniversityMathProject/assets/icons/android-chrome-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                  },
                  {
                    src: '/MyUniversityMathProject/assets/icons/android-chrome-maskable-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                  }
                ]
              }
        }),
    ],
    build: {
        outDir: './docs',
        rollupOptions: {
            input: {
                main: './index.html',
                404: './404.html'
            }
        }
    },
    base: process.env.NODE_ENV === 'production' ? '/MyUniversityMathProject/' : '/',
});