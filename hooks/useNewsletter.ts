'use client'

import { useState, useEffect } from 'react'

interface NewsletterState {
    isSubscribed: boolean
    userEmail: string | null
}

const STORAGE_KEY = 'lukess_newsletter'
const EVENT_KEY = 'lukess_newsletter_sync'

export function useNewsletter() {
    const [state, setState] = useState<NewsletterState>({
        isSubscribed: false,
        userEmail: null,
    })

    // Read initial state
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as NewsletterState
                setState(parsed)
            } catch (e) {
                console.warn('Invalid newsletter state in localStorage', e)
                localStorage.removeItem(STORAGE_KEY)
            }
        }

        // Listen for custom cross-component sync event
        const handleSync = (e: Event) => {
            const customEvent = e as CustomEvent<NewsletterState>
            if (customEvent.detail) {
                setState(customEvent.detail)
            }
        }

        window.addEventListener(EVENT_KEY, handleSync)
        return () => window.removeEventListener(EVENT_KEY, handleSync)
    }, [])

    const markAsSubscribed = (email: string) => {
        const newState: NewsletterState = {
            isSubscribed: true,
            userEmail: email,
        }

        // Update local state
        setState(newState)

        // Persist to storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))

        // Dispatch event so other components (Popup, Footer, Checkout) update instantly
        window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: newState }))
    }

    return {
        isSubscribed: state.isSubscribed,
        userEmail: state.userEmail,
        markAsSubscribed,
    }
}
