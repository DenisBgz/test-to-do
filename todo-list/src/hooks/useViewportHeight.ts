import { useLayoutEffect } from 'react'

export function useViewportHeight() {
  useLayoutEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const root = document.documentElement

    // Клавиатура Safari уменьшает видимую область. Ручной зум не меняет раскладку.
    function syncHeight() {
      if (viewport && viewport.scale === 1) {
        root.style.setProperty('--viewport-height', viewport.height + 'px')
        root.style.setProperty('--viewport-top', viewport.pageTop + 'px')
      }
    }

    syncHeight()
    viewport.addEventListener('resize', syncHeight)
    viewport.addEventListener('scroll', syncHeight)
    return () => {
      viewport.removeEventListener('resize', syncHeight)
      viewport.removeEventListener('scroll', syncHeight)
      root.style.removeProperty('--viewport-height')
      root.style.removeProperty('--viewport-top')
    }
  }, [])
}
