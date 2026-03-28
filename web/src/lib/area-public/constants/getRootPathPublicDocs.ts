import { base } from '$app/paths';

/** Route segment for public docs index (no leading slash). */
export function getRootPathPublicDocs(): string {
	return 'docs';
}

/** Pathname without leading `base` (for parsing docs locale / breadcrumbs). */
export function stripAppBase(pathname: string): string {
	if (!base) return pathname;
	if (pathname === base) return '/';
	if (pathname.startsWith(base + '/')) return pathname.slice(base.length);
	return pathname;
}

/** `base` + path segments for `<a href>` / `goto` (handles empty `base`). */
export function hrefAppPath(segments: string[]): string {
	const path = [base, ...segments].filter((s) => s.length > 0).join('/');
	return path.startsWith('/') ? path : `/${path}`;
}

function joinAppPath(...segments: string[]): string {
	return hrefAppPath(segments);
}

/** Resolved href for `/docs` (includes `base` when configured). */
export function hrefPublicDocsIndex(): string {
	return joinAppPath(getRootPathPublicDocs());
}

/** Resolved href for localized docs index, e.g. `/docs/es`. */
export function hrefPublicDocsLocale(locale: string): string {
	return joinAppPath(getRootPathPublicDocs(), locale);
}
