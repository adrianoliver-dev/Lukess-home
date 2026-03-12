'use client'

export default function AnnouncementBar() {
    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
          :root {
            --announcement-height: 32px;
          }
        `
            }} />
            <div
                role="banner"
                aria-label="Promotional announcement"
                className="fixed top-0 left-0 right-0 z-[60] w-full bg-gray-900 text-white
          flex items-center justify-center h-8 px-4"
            >
                <p className="text-[11px] font-medium tracking-wide uppercase text-center">
                    🚚 Envío Gratis a nivel nacional por compras mayores a Bs 150
                </p>
            </div>
        </>
    )
}
