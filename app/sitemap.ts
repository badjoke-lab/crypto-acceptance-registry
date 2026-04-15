import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.cryptopaymap.com'

  return [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/public`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/public-stats`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/public-checks`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/public-cutover`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/public-status`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/public-methodology`, changeFrequency: 'weekly', priority: 0.6 },
  ]
}
