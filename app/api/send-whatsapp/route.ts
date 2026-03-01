import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { to, templateName, variables, headerImage } = await req.json() as {
      to: string
      templateName: string
      variables: string[]
      headerImage?: string
    }

    console.log('[WhatsApp API] Incoming request:', { to, templateName, variables, headerImage })

    const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!
    const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!
    const LANG = 'es'
    const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v21.0'

    const bodyComponent = {
      type: 'body',
      parameters: variables.map((v) => ({ type: 'text', text: v })),
    }

    const components: object[] = []
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
    console.log('[WhatsApp API] Meta response:', { status: res.status, data: responseData })

    if (!res.ok) {
      console.error('[WhatsApp API] Meta Error:', responseData)
      return NextResponse.json({ error: responseData }, { status: res.status })
    }

    return NextResponse.json({ ok: true, data: responseData })
  } catch (error) {
    console.error('[WhatsApp API] Internal crash:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
