
export default{
  modules: [
    '@vite-pwa/nuxt',
    '@pinia/nuxt'
  ],
  css: ['vuetify/styles'],

  build: {
    transpile: ['vuetify'],
  },

  plugins: ['~/plugins/vuetify'],

  pwa: {
    manifest: {
      name: 'مصنع الاوائل',
      short_name: 'الاوائل',
      lang: 'ar',
      display: 'standalone',
      start_url: '/',
      theme_color: '#317EFB',
      background_color: '#ffffff',
      description: 'A progressive web application.',
      icons: [
        {
          src: '/android-launchericon-48-48.png',
          sizes: '48x48',
          type: 'image/png',
        },
        {
          src: '/android-launchericon-72-72.png',
          sizes: '72x72',
          type: 'image/png',
        },
        {
          src: '/android-launchericon-96-96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: '/android-launchericon-144-144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/android-launchericon-192-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-launchericon-512-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/android-launchericon-144-144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/android-launchericon-192-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-launchericon-512-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ]
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /^https?.*/, // Cache all https requests
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'https-cache',
          }
        },
        {
          urlPattern: /^https:\/\/buisness-mangment-system.onrender.com\/api\/.*/, // Specific API caching
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 24 * 60 * 60, // 1 day
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /\.(?:png|gif|jpg|jpeg|svg)$/, // Cache images
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            }
          }
        },
        {
          urlPattern: /.*\.(?:css|js)/, // Cache CSS and JavaScript
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
          }
        }
      ],
      cacheId: 'my-pwa',
      navigateFallback: '/',
    },
    devtools: true,
  }
};
