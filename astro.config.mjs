// @ts-check

import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';
import UnoCSS from '@unocss/astro';
import pagefind from 'astro-pagefind';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), svelte(), UnoCSS(), pagefind()],
	vite: {
		server: {
			allowedHosts: ['docs.sitcon.party'],
		},
	},
});
