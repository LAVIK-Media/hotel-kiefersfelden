import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Sanity-Asset-CDN (sobald Sanity live ist)
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },

  experimental: {
    // Reduziert Re-Compiles bei Tailwind-v4-Setups
    optimizePackageImports: ['framer-motion'],
  },
}

export default withNextIntl(config)
