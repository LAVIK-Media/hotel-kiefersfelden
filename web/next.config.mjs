import nextIntlPlugin from 'next-intl/plugin'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

// next-intl/plugin is CJS. This keeps it working across ESM/CJS interop.
const createNextIntlPlugin =
  typeof nextIntlPlugin === 'function' ? nextIntlPlugin : nextIntlPlugin?.default

const i18nRequestPath = './src/i18n/request.ts'
const withNextIntl = createNextIntlPlugin(i18nRequestPath)

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

  // Next.js 16: aliases live unter `turbopack`.
  turbopack: {
    resolveAlias: {
      'next-intl/config': i18nRequestPath,
    },
  },

  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
}

const nextConfig = withNextIntl(config)

if (nextConfig.experimental?.turbo) {
  delete nextConfig.experimental.turbo
}

if (process.env.NODE_ENV !== 'production') {
  initOpenNextCloudflareForDev()
}

export default nextConfig
