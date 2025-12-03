'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseLazyLoadOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useLazyLoad<T extends HTMLElement = HTMLElement>(
  options: UseLazyLoadOptions = {}
) {
  const { threshold = 0.1, rootMargin = '100px', once = true } = options
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      
      if (entry.isIntersecting) {
        setIsVisible(true)
        
        if (once && ref.current) {
          observer.unobserve(ref.current)
        }
      } else if (!once) {
        setIsVisible(false)
      }
    },
    [once]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    })

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [ref, threshold, rootMargin, observerCallback])

  return [ref, isVisible] as const
}
