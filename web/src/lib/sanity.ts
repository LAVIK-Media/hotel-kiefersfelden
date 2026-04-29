/**
 * Sanity-Client – nur initialisiert, wenn Project-ID gesetzt ist.
 *
 * In der aktuellen Phase ist Sanity noch nicht deployed → der Client ist
 * `null`, und `lib/content.ts` fällt automatisch auf `lib/data.ts` (Mock
 * aus dem Phase-2-Seed) zurück.
 *
 * Sobald `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local` gesetzt ist,
 * wird das echte Dataset abgefragt – ohne Code-Änderung.
 */

import { createClient, type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01'

export const sanityEnabled = Boolean(projectId)

export const sanityClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
      perspective: 'published',
    })
  : null

export const sanityImage = sanityClient ? imageUrlBuilder(sanityClient) : null
