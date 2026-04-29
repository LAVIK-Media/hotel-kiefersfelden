import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { internationalizedArray } from '@sanity/internationalized-array'

import { schemaTypes } from './schemas'
import { deskStructure } from './lib/deskStructure'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './lib/i18n'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'REPLACE_WITH_PROJECT_ID'
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

export default defineConfig({
  name: 'hotel-zur-post',
  title: 'Hotel zur Post Kiefersfelden',

  projectId,
  dataset,

  plugins: [
    structureTool({ structure: deskStructure }),
    internationalizedArray({
      languages: SUPPORTED_LANGUAGES,
      defaultLanguages: [DEFAULT_LANGUAGE],
      fieldTypes: ['string', 'text'],
    }),
    visionTool({
      defaultApiVersion: '2024-10-01',
    }),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => schemaType !== 'siteSettings' && schemaType !== 'navigation'),
  },

  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter(
          (item) => item.templateId !== 'siteSettings' && item.templateId !== 'navigation',
        )
      }
      return prev
    },
    actions: (prev, { schemaType }) => {
      if (schemaType === 'siteSettings' || schemaType === 'navigation') {
        return prev.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
      }
      return prev
    },
  },
})
