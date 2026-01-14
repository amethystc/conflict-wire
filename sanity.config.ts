import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { schemaTypes } from './schemaTypes'
import { structure } from './sanity.structure'

export default defineConfig({
  name: 'conflict-wire',
  title: 'Conflict Wire Studio',

  projectId: process.env.SANITY_PROJECT_ID || 'meyoc37a',
  dataset: process.env.SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
    media(),
  ],

  schema: {
    types: schemaTypes,
  },
})
