<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		getRootPathPublicDocs,
		hrefAppPath,
		stripAppBase
	} from '$lib/area-public/constants/getRootPathPublicDocs';
	import { docsConfig } from '$lib/docs/constants/config';
	import { icons } from '$data/icon';

	import * as DropdownMenu from '$lib/ui/dropdown-menu/index.js';
	import AbstractIcon from '$lib/ui/icons/AbstractIcon.svelte';
	import { cn } from '$lib/ui/helpers/common';

	let { variant = 'header' }: { variant?: 'header' | 'sidebar' } = $props();

	let i18n = docsConfig.i18n;

	function parseDocsPath(pathname: string): { locale: string; slugParts: string[] } {
		const path = stripAppBase(pathname);
		const parts = path.split('/').filter(Boolean);
		const docsSeg = getRootPathPublicDocs();
		if (parts[0] !== docsSeg) {
			return { locale: i18n?.defaultLocale ?? 'en', slugParts: [] };
		}
		const rest = parts.slice(1);
		if (
			rest.length > 0 &&
			i18n?.locales.some((l) => l.code === rest[0] && rest[0] !== i18n.defaultLocale)
		) {
			return { locale: rest[0]!, slugParts: rest.slice(1) };
		}
		return { locale: i18n?.defaultLocale ?? 'en', slugParts: rest };
	}

	function getCurrentLocale(): string {
		if (!i18n) return 'en';
		return parseDocsPath(page.url.pathname).locale;
	}

	function switchLocale(code: string) {
		if (!i18n) return;
		const { slugParts } = parseDocsPath(page.url.pathname);
		if (code === i18n.defaultLocale) {
			goto(hrefAppPath(['docs', ...slugParts]));
		} else {
			goto(hrefAppPath(['docs', code, ...slugParts]));
		}
	}
</script>

{#if i18n && i18n.locales.length > 1}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			aria-label="Switch language"
			class={cn(
				variant === 'header' &&
					'text-base-content/70 hover:bg-base-200 inline-flex size-10 shrink-0 items-center justify-center rounded-md transition-colors outline-none',
				variant === 'sidebar' &&
					'border-base-300 bg-base-100 text-base-content hover:bg-base-200 flex w-full items-center justify-center gap-2 rounded-md border px-2 py-1.5 text-xs font-medium'
			)}
		>
			<AbstractIcon
				name={icons.Languages.name}
				class={variant === 'header' ? 'size-4' : 'size-3.5'}
				width={variant === 'header' ? '16' : '14'}
				height={variant === 'header' ? '16' : '14'}
			/>
			{#if variant === 'sidebar'}
				<span>Language</span>
			{/if}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align={variant === 'header' ? 'end' : 'start'} class="min-w-40">
			{#each i18n.locales as locale (locale.code)}
				<DropdownMenu.Item onclick={() => switchLocale(locale.code)}>
					{#if locale.flag}
						<span>{locale.flag}</span>
					{/if}
					{locale.label}
					{#if getCurrentLocale() === locale.code}
						<AbstractIcon name={icons.Check.name} class="ms-auto size-4" width="16" height="16" />
					{/if}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
