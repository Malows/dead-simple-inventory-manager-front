import { onMounted } from 'vue'
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals'

export function useWebVitals() {
  onMounted(() => {
    // Core Web Vitals tracking (CWV)
    onCLS(console.log) // Cumulative Layout Shift
    onFCP(console.log) // First Contentful Paint
    onLCP(console.log) // Largest Contentful Paint
    onTTFB(console.log) // Time to First Byte

    // In production, you might want to send these metrics to analytics
    if (process.env.PROD) {
      // Example: Send to Google Analytics or your analytics service
      // gtag('event', 'web_vitals', { ... })
    }
  })
}