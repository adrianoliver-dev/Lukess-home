'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function useHashScroll() {
    const pathname = usePathname()

    useEffect(() => {
        // Check if there's a hash in the URL
        const hash = window.location.hash
        if (!hash) return

        // Wait for page to fully load and elements to be in DOM
        const scrollToHash = () => {
            const element = document.querySelector(hash)
            if (element) {
                // Smooth scroll with offset for fixed navbar
                const yOffset = -80 // Adjust based on your navbar height
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
                window.scrollTo({ top: y, behavior: 'smooth' })
            }
        }

        // Try immediately
        scrollToHash()

        // Also try after a short delay (for dynamic content)
        const timeoutId = setTimeout(scrollToHash, 100)

        return () => clearTimeout(timeoutId)
    }, [pathname])
}
