// @ts-check

import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';
import UnoCSS from '@unocss/astro';
import pagefind from 'astro-pagefind';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.sitcon.party',
	integrations: [mdx(), svelte(), UnoCSS(), pagefind()],
	server: {
		host: true,
		port: 4321,
		allowedHosts: ['docs.sitcon.party'],
	},
});
