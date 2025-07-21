
export const generateSitemap = () => {
  const baseUrl = 'https://standardplaybook.com';
  const routes = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/app', priority: '0.8', changefreq: 'weekly' },
    { path: '/boardroom', priority: '0.8', changefreq: 'weekly' },
    { path: '/directive', priority: '0.8', changefreq: 'weekly' },
    { path: '/partnership', priority: '0.8', changefreq: 'weekly' },
    { path: '/sales-experience', priority: '0.8', changefreq: 'weekly' },
    { path: '/producer-power-up', priority: '0.8', changefreq: 'weekly' },
    { path: '/owner-challenge', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.6', changefreq: 'monthly' },
    { path: '/contact', priority: '0.6', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { path: '/terms', priority: '0.3', changefreq: 'yearly' }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};
