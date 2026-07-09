import { getCollection, type CollectionEntry } from 'astro:content';

export type DocsEntry = CollectionEntry<'docs'>;

export interface DocsChapter {
	id: string;
	eyebrow: string;
	title: string;
	duration: string;
	level: string;
	tags: string[];
	summary: string;
	goals: string[];
	checklist: string[];
	href: string;
}

export async function getSortedDocsEntries() {
	return (await getCollection('docs')).sort((a, b) => a.data.order - b.data.order);
}

export function toDocsChapters(entries: DocsEntry[]): DocsChapter[] {
	return entries.map((entry, index) => ({
		id: entry.id,
		eyebrow: entry.data.eyebrow,
		title: entry.data.title,
		duration: entry.data.duration,
		level: entry.data.level,
		tags: entry.data.tags,
		summary: entry.data.summary,
		goals: entry.data.goals,
		checklist: entry.data.checklist,
		href: index === 0 ? '/' : `/${entry.id}`,
	}));
}
