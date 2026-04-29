/**
 * Sanity-Client für Server-seitige Verwendung (Seed-Script, Next.js-Frontend).
 * Im Studio selbst NICHT importieren — das Studio bringt seinen eigenen Client mit.
 */

import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET ?? process.env.SANITY_DATASET ?? 'production'

if (!projectId) {
  throw new Error('SANITY_STUDIO_PROJECT_ID (oder SANITY_PROJECT_ID) muss gesetzt sein.')
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})
