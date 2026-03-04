"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Official Clarity global type declaration — no `any`
declare global {
    interface Window {
        clarity: (
            command: "set" | "identify" | "consent" | "event" | "upgrade",
            key: string,
            value?: string
        ) => void;
    }
}

export default function MicrosoftClarity(): null {
    const pathname = usePathname();

    useEffect(() => {
        // Only initialize in production and when the ID is present
        if (
            process.env.NODE_ENV !== "production" ||
            !process.env.NEXT_PUBLIC_CLARITY_ID
        ) {
            return;
        }

        const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

        // Inject the official Clarity inline snippet only once
        if (!document.getElementById("ms-clarity-script")) {
            const script = document.createElement("script");
            script.id = "ms-clarity-script";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window,document,"clarity","script","${clarityId}");
      `;
            document.head.appendChild(script);
        }
    }, []); // Runs once on mount

    // Track route changes after initial load
    useEffect(() => {
        if (
            process.env.NODE_ENV !== "production" ||
            !process.env.NEXT_PUBLIC_CLARITY_ID ||
            typeof window.clarity !== "function"
        ) {
            return;
        }

        window.clarity("set", "page", pathname);
    }, [pathname]);

    return null;
}
