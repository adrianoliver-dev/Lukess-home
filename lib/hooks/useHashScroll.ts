'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function useHashScroll() {
    const pathname = usePathname()

    useEffect(() => {
        const hash = window.location.hash
        if (!hash) return

        const NAVBAR_OFFSET = 80
        let attempts = 0
        const MAX_ATTEMPTS = 30 // 30 * 150ms = 4.5 seconds max wait

        const scrollToElement = () => {
            const element = document.querySelector(hash)
            if (element) {
                const y = element.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET
                window.scrollTo({ top: y, behavior: 'smooth' })
                return true
            }
            return false
        }

        const tryWithRetry = () => {
            if (scrollToElement()) return
            attempts++
            if (attempts < MAX_ATTEMPTS) {
                setTimeout(tryWithRetry, 150)
            }
        }

        // Start trying after a short initial delay
        const initialTimeout = setTimeout(tryWithRetry, 150)

        return () => clearTimeout(initialTimeout)
    }, [pathname])
}
