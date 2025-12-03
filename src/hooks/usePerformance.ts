'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  totalBlockingTime: number
}

export function usePerformance() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Measure page load time
      const pageLoadTime = performance.now()
      
      // Core Web Vitals tracking
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            const fcp = entry.startTime
            console.log(`FCP: ${fcp}ms`)
          }
          
          if (entry.name === 'largest-contentful-paint') {
            const lcp = entry.startTime
            console.log(`LCP: ${lcp}ms`)
          }
          
          if (entry.name === 'layout-shift') {
            const cls = (entry as any).value
            console.log(`CLS: ${cls}`)
          }
        }
      })

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] })

      // Resource timing
      const resources = performance.getEntriesByType('resource')
      const images = resources.filter(r => r.initiatorType === 'img')
      const scripts = resources.filter(r => r.initiatorType === 'script')
      const styles = resources.filter(r => r.initiatorType === 'css')

      console.log('Performance Summary:', {
        pageLoadTime: `${pageLoadTime.toFixed(2)}ms`,
        resources: resources.length,
        images: images.length,
        scripts: scripts.length,
        styles: styles.length,
        totalSize: `${(resources.reduce((acc, r) => acc + (r as any).decodedBodySize || 0, 0) / 1024).toFixed(2)}KB`
      })

      return () => observer.disconnect()
    }
  }, [])

  const measureInteraction = (name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-start`)
      
      return () => {
        performance.mark(`${name}-end`)
        performance.measure(name, `${name}-start`, `${name}-end`)
        const duration = performance.getEntriesByName(name)[0].duration
        console.log(`Interaction ${name}: ${duration.toFixed(2)}ms`)
      }
    }
    return () => {}
  }

  const trackDownload = (gameName: string) => {
    // Simulate analytics tracking
    console.log(`Download tracked: ${gameName}`)
    
    // In production, send to analytics service
    // Example: Google Analytics, Plausible, etc.
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'download', {
        game_name: gameName
      })
    }
  }

  const trackSearch = (query: string, results: number) => {
    console.log(`Search tracked: "${query}" returned ${results} results`)
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search', {
        search_term: query,
        results_count: results
      })
    }
  }

  return {
    measureInteraction,
    trackDownload,
    trackSearch
  }
}
