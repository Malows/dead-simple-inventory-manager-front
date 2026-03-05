import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  // Service worker registration for PWA
  if (process.env.PROD && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration)
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
      })
  }
})
