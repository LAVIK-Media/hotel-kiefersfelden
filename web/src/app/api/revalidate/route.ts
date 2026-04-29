/**
 * Sanity-Webhook-Endpoint für ISR.
 *
 * Wird im Sanity-Studio unter API → Webhooks konfiguriert:
 *   URL:  https://<deployed-domain>/api/revalidate
 *   Trigger: Create / Update / Delete für menu, room, page, …
 *   Headers: x-sanity-secret = <SANITY_REVALIDATE_SECRET>
 *
 * Anschließend lädt Vercel die betroffenen Routen frisch nach.
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// Cloudflare Pages / Edge Runtime (required by next-on-pages)
export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-sanity-secret')
  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  let body: { _type?: string; slug?: { current?: string } } = {}
  try {
    body = await req.json()
  } catch {
    // Sanity sendet bei manchen Webhook-Trigger leere Body — das ist OK
  }

  // Pauschale Re-Validierung der wichtigsten Routen
  revalidatePath('/', 'layout')
  revalidatePath('/[locale]', 'layout')

  // Type-spezifische Tags (sobald wir GROQ-Tags nutzen)
  if (body._type) revalidateTag(body._type)

  return NextResponse.json({ ok: true, type: body._type ?? null, time: Date.now() })
}
