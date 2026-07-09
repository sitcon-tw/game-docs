import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
	loader: glob({
		base: './src/content/docs',
		pattern: '**/*.mdx',
		generateId: ({ entry }) => entry.replace(/\.mdx$/, '').replace(/^\d+-/, ''),
	}),
	schema: z.object({
		order: z.number(),
		eyebrow: z.string(),
		title: z.string(),
		duration: z.string(),
		level: z.string(),
		tags: z.array(z.string()),
		summary: z.string(),
		goals: z.array(z.string()),
		checklist: z.array(z.string()),
	}),
});

export const collections = { docs };
