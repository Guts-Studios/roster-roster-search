import { useState, useEffect } from 'react'

/**
 * Custom hook to detect screen size and provide responsive placeholder text
 */
export function useResponsivePlaceholder() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640) // Tailwind's sm breakpoint (640px)
    }

    // Check initial screen size
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize)

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return {
    isMobile,
    getPlaceholder: (desktop: string, mobile: string) => isMobile ? mobile : desktop,
    // Predefined common placeholders
    searchPlaceholder: isMobile 
      ? "First or Last Name or Badge #"
      : "First name, last name, or badge number",
    badgeNumberPlaceholder: isMobile ? "Badge #" : "Badge Number"
  }
}