import { base } from '$app/paths';
import { hrefAppPath } from '$lib/area-public/constants/getRootPathPublicDocs';
import { eachLocaleDocPages } from '$lib/docs/content';
import { docsConfig } from '$lib/docs/config';
import { resolvePublicSiteUrl } from '$lib/docs/utils/resolve-public-site-url';
import { escapeXml } from '$lib/docs/utils/xml-escape';
import type { RequestHandler } from './$types';

function absUrl(origin: string, pathname: string): string {
	const o = origin.replace(/\/$/, '');
	const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
	return `${o}${p}`;
}

export const prerender = true;

export const GET: RequestHandler = ({ url }) => {
	const siteUrl = resolvePublicSiteUrl(url);
	const defaultLocale = docsConfig.i18n?.defaultLocale ?? 'en';
	const siteTitle = docsConfig.site.title;
	const siteDescription = docsConfig.site.description;
	const blogRssUrl = `${siteUrl}/api/v1/blog-system/rss?format=rss`;
	const channelDescription = `${siteDescription} Blog posts: ${blogRssUrl}`;

	const docsLink = absUrl(siteUrl, hrefAppPath(['docs']));
	const rssPath = `${base}/rss.xml`.replace(/\/{2,}/g, '/');
	const selfHref = absUrl(siteUrl, rssPath);

	const items: string[] = [];
	for (const { locale, localeLabel, pages } of eachLocaleDocPages()) {
		for (const doc of pages) {
			const titleSuffix = locale !== defaultLocale ? ` (${localeLabel})` : '';
			const link = `${siteUrl}${doc.href.startsWith('/') ? doc.href : `/${doc.href}`}`;
			const pub =
				doc.meta.lastUpdated != null && doc.meta.lastUpdated !== ''
					? `<pubDate>${new Date(doc.meta.lastUpdated).toUTCString()}</pubDate>`
					: '';
			items.push(`    <item>
      <title>${escapeXml(doc.meta.title + titleSuffix)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(link)}</guid>
      <description>${escapeXml(doc.meta.description)}</description>
      ${pub}
    </item>`);
		}
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)} — Docs</title>
    <link>${escapeXml(docsLink)}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>${defaultLocale}</language>
    <atom:link href="${escapeXml(selfHref)}" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
