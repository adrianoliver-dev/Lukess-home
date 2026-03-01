import * as React from 'react'

interface WelcomeNewsletterEmailProps {
    discountCode: string
}

export const WelcomeNewsletterEmail: React.FC<Readonly<WelcomeNewsletterEmailProps>> = ({
    discountCode,
}) => (
    <div style={{ margin: 0, padding: 0, backgroundColor: '#1a1a1a', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#1a1a1a', padding: '32px 16px' }}>
            <tr>
                <td align="center">
                    <table width="100%" cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', backgroundColor: '#222222', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
                        <tr>
                            <td style={{ backgroundColor: '#111111', padding: '32px 40px', textAlign: 'center', borderBottom: '3px solid #D4AF37' }}>
                                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 900, letterSpacing: '4px', color: '#D4AF37', textTransform: 'uppercase' }}>
                                    LUKESS HOME
                                </h1>
                                <p style={{ margin: '6px 0 0', color: '#888', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    Mercado Mutualista · Santa Cruz, Bolivia
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '40px 40px 20px', textAlign: 'center' }}>
                                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#f0f0f0' }}>¡Bienvenido a Lukess Home!</h2>
                                <p style={{ margin: '16px 0 0', fontSize: '15px', color: '#aaaaaa', lineHeight: '1.6' }}>
                                    Gracias por unirte a nuestra comunidad. A partir de ahora recibirás nuestras promociones exclusivas, nuevas colecciones y avisos de stock antes que nadie.
                                </p>
                                <p style={{ margin: '16px 0 0', fontSize: '15px', color: '#e0e0e0', lineHeight: '1.6', fontWeight: 600 }}>
                                    Para celebrar tu llegada, aquí tienes un 10% de descuento en tu próxima compra.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '20px 40px' }}>
                                <div style={{ backgroundColor: '#111', border: '2px dashed #D4AF37', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px' }}>Código de Descuento</p>
                                    <p style={{ margin: '12px 0 0', fontSize: '32px', fontWeight: 900, color: '#D4AF37', letterSpacing: '2px' }}>{discountCode}</p>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>* Válido por 7 días. De un solo uso.</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '20px 40px 40px', textAlign: 'center' }}>
                                <a href="https://lukess-home.vercel.app" style={{ display: 'inline-block', backgroundColor: '#D4AF37', color: '#111', fontSize: '14px', fontWeight: 900, padding: '16px 32px', borderRadius: '8px', textDecoration: 'none', letterSpacing: '0.5px' }}>
                                    Explorar la Tienda →
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '28px 40px 32px', textAlign: 'center', borderTop: '1px solid #2a2a2a' }}>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#D4AF37', letterSpacing: '2px', textTransform: 'uppercase' }}>LUKESS HOME</p>
                                <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#555' }}>Mercado Mutualista, Santa Cruz, Bolivia</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
)

export default WelcomeNewsletterEmail
