import type { MetadataRoute } from 'next'
import { artigos } from '@/lib/artigos'

const BASE_URL = 'https://auditcredito.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const artigoEntries: MetadataRoute.Sitemap = artigos.map((artigo) => ({
    url: `${BASE_URL}/blog/${artigo.slug}`,
    lastModified: new Date(artigo.dataPublicacao),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/auditoria`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...artigoEntries,
  ]
}
