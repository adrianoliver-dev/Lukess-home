export async function sendWhatsAppMessage(params: {
    to: string
    templateName: string
    variables: string[]
    headerImage?: string
}) {
    const { to, templateName, variables, headerImage } = params

    console.log('[WhatsApp] Sending message:', { to, templateName, variables, headerImage })

    const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!
    const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!
    const LANG = 'es'
    const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v21.0'

    const bodyComponent = {
        type: 'body',
        parameters: variables.map((v) => ({ type: 'text', text: v })),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const components: any[] = []
    if (headerImage) {
        components.push({
            type: 'header',
            parameters: [{ type: 'image', image: { link: headerImage } }],
        })
    }
    components.push(bodyComponent)

    const payload = {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
            name: templateName,
            language: { code: LANG },
            components,
        },
    }

    const res = await fetch(
        `https://graph.facebook.com/${API_VERSION}/${PHONE_ID}/messages`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }
    )

    const responseData = await res.json()
    console.log('[WhatsApp] Meta response:', { status: res.status, data: responseData })

    if (!res.ok) {
        console.error('[WhatsApp] Meta Error:', responseData)
        throw new Error(`WhatsApp API Error: ${JSON.stringify(responseData)}`)
    }

    return responseData
}
