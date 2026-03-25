"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

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

export default function MicrosoftClarity(): React.JSX.Element | null {
    const pathname = usePathname();

    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

    return (
        <>
            {clarityId && process.env.NODE_ENV === "production" && (
                <Script id="ms-clarity-script" strategy="lazyOnload">
                    {`
                        (function(c,l,a,r,i,t,y){
                            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                        })(window,document,"clarity","script","${clarityId}");
                    `}
                </Script>
            )}
        </>
    );
}
