<script lang="ts">
	import { page } from '$app/state';
	import { docsConfig } from '$lib/docs/constants/config';

	let {
		title,
		description
	}: {
		title: string;
		description?: string;
	} = $props();

	let siteTitle = docsConfig.site.title;
	let fullTitle = $derived(title === siteTitle ? title : `${title} — ${siteTitle}`);
	/**
	 * Prerendering cannot depend on query strings; avoid accessing `page.url.href/search`.
	 * Canonical is always origin + pathname.
	 *
	 * Note: During prerender, SvelteKit disallows reading `page.url.search/searchParams`.
	 * Some URL properties may be implemented via getters; keep usage minimal and avoid `page.url.origin`.
	 */
	let url = $derived.by(() => {
		const fromConfig = docsConfig.site.url?.trim();
		const fromEnv =
			(typeof process !== 'undefined' && (process.env.VITE_PUBLIC_SITE_URL || process.env.SITE_URL)) || '';

		const origin = (fromConfig || fromEnv).replace(/\/$/, '');
		const path = page.url.pathname;
		return origin ? `${origin}${path}` : path;
	});

	let breadcrumbItems = $derived.by(() => {
		const parts = page.url.pathname.split('/').filter(Boolean);
		const baseUrl = docsConfig.site.url ?? '';
		return parts.map((part, i) => ({
			'@type': 'ListItem' as const,
			position: i + 1,
			name: part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
			item: `${baseUrl}/${parts.slice(0, i + 1).join('/')}`
		}));
	});

	let jsonLd = $derived(
		JSON.stringify([
			{
				'@context': 'https://schema.org',
				'@type': 'TechArticle',
				headline: title,
				description: description ?? '',
				url,
				isPartOf: {
					'@type': 'WebSite',
					name: siteTitle,
					url: docsConfig.site.url ?? ''
				}
			},
			{
				'@context': 'https://schema.org',
				'@type': 'BreadcrumbList',
				itemListElement: breadcrumbItems
			}
		])
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}

	<meta property="og:type" content="article" />
	<meta property="og:title" content={fullTitle} />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
	<meta property="og:url" content={url} />
	{#if docsConfig.site.title}
		<meta property="og:site_name" content={docsConfig.site.title} />
	{/if}

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={fullTitle} />
	{#if description}
		<meta name="twitter:description" content={description} />
	{/if}

	<link rel="canonical" href={url} />

	{@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>
