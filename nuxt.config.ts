// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'URL minifier'
    }
  },
  runtimeConfig: {
    public: {
      apiPath: '', // Must be overridden by NUXT_PUBLIC_API_PATH environment variable
    }
  },
  build: {
    transpile: [
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/vue-fontawesome',
        '@fortawesome/free-solid-svg-icons',
    ]
}
})
