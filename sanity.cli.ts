import {defineCliConfig} from 'sanity/cli'

/**
 * Sanity CLI Configuration
 *
 * CORS Configuration:
 * To allow your frontend to access the Sanity API, you need to configure CORS origins.
 *
 * Add CORS origins:
 * - For local development: npm run cors:add-localhost
 * - For production: Update the script in package.json with your production domain
 *
 * Or manually via Sanity dashboard:
 * https://www.sanity.io/organizations/oqffWMJGe/project/tj8cgapn/api
 *
 * Common CORS origins to add:
 * - http://localhost:3000 (Next.js dev)
 * - http://localhost:3001 (alternate port)
 * - https://your-production-domain.com
 * - https://www.your-production-domain.com
 */

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID || 'tj8cgapn',
    dataset: process.env.SANITY_DATASET || 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * When enabled, the studio will automatically update to the latest version.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
    appId: 'fmls6i4gyqv09i6f0d2jidrx',
  },
  /**
   * Studio hostname configuration
   * If deploying to a custom domain, configure it here or in environment variables
   */
  studioHost: 'conflictwire',
})
