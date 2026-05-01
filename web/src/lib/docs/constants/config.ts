import type { IconName } from '$data/icons';

import { icons } from '$data/icons';
import type { DocsConfig } from '$lib/docs/types';

export const docsSite = {
	title: 'Documentation',
	description: 'Product documentation.',
	url: '',
	social: {
		github: 'https://github.com/your-org/saas-template-monorepo',
		/** X (Twitter); set empty string to hide in UI */
		twitter: ''
	}
};

export const docsI18n = {
	defaultLocale: 'en',
	locales: [
		{ code: 'en', label: 'English', flag: '🇺🇸' },
		{ code: 'es', label: 'Español', flag: '🇪🇸' }
	]
} as const;

export type DocsSidebarSection = {
	label: string;
	icon?: IconName;
	autogenerate?: { directory: string };
	items?: { label: string; href: string }[];
};

export const docsSidebar: DocsSidebarSection[] = [
	{
		label: 'Getting Started',
		icon: icons.Rocket.name,
		autogenerate: { directory: 'getting-started' }
	},
	{
		label: 'Guides',
		icon: icons.BookOpen.name,
		autogenerate: { directory: 'guides' }
	}
];

export const docsConfig: DocsConfig = {
	site: docsSite,
	sidebar: docsSidebar,
	toc: {
		minDepth: 2,
		maxDepth: 3
	},
	i18n: {
		defaultLocale: docsI18n.defaultLocale,
		locales: docsI18n.locales.map((l) => ({ ...l }))
	}
};
