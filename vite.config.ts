import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        compression(),
        VitePWA({
            registerType: "autoUpdate",
            injectRegister: "inline",
            manifest: {
                name: "동사마스터 - Your companion for Korean verbs",
                short_name: "동사마스터",
                description: "동사마스터 - Your companion for Korean verbs. A simple website designed to help you practice your Korean verb conjugations.",
                theme_color: "#ffffff",
                "icons": [
                    {
                        "src": "pwa-64x64.png",
                        "sizes": "64x64",
                        "type": "image/png"
                    },
                    {
                        "src": "pwa-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "pwa-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    },
                    {
                        "src": "maskable-icon-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "maskable"
                    }
                ]
            }
        })
    ],
});
