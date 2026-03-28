import { getAllDocs, getDoc, getPrevNext, getRawContent } from '$lib/docs/index';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = true;

export function entries() {
	return getAllDocs()
		.filter((d) => d.slug)
		.map((d) => ({ slug: d.slug }));
}

export const load: PageLoad = ({ params }) => {
	const doc = getDoc(params.slug);
	if (!doc) throw error(404, `Page not found: ${params.slug}`);

	const { prev, next } = getPrevNext(params.slug);

	return {
		meta: doc.meta,
		slug: params.slug,
		prev,
		next,
		rawContent: getRawContent(params.slug)
	};
};
