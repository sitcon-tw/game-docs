export const chapterKey = 'camp-docs:chapter';
export const completedKey = 'camp-docs:completed';
export const sidebarKey = 'camp-docs:sidebar';
export const completedChangeEvent = 'camp-docs:completed-change';

export type SidebarState = 'open' | 'collapsed';

export interface CompletedChangeDetail {
	completed: string[];
}

function storageAvailable() {
	return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readCompleted() {
	if (!storageAvailable()) return [];

	try {
		const value = window.localStorage.getItem(completedKey);
		const parsed: unknown = JSON.parse(value || '[]');
		return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
	} catch {
		return [];
	}
}

export function writeCompleted(completed: string[]) {
	const uniqueCompleted = [...new Set(completed)];

	if (storageAvailable()) {
		window.localStorage.setItem(completedKey, JSON.stringify(uniqueCompleted));
	}

	if (typeof window !== 'undefined') {
		window.dispatchEvent(
			new CustomEvent<CompletedChangeDetail>(completedChangeEvent, {
				detail: { completed: uniqueCompleted },
			}),
		);
	}

	return uniqueCompleted;
}

export function toggleChapterCompleted(chapterId: string) {
	const completed = readCompleted();
	const nextCompleted = completed.includes(chapterId)
		? completed.filter((id) => id !== chapterId)
		: [...completed, chapterId];

	return writeCompleted(nextCompleted);
}

export function subscribeCompleted(callback: (completed: string[]) => void) {
	if (typeof window === 'undefined') return () => undefined;

	const handleCompletedChange = (event: Event) => {
		if (event instanceof CustomEvent && Array.isArray(event.detail?.completed)) {
			callback(event.detail.completed);
			return;
		}

		callback(readCompleted());
	};

	window.addEventListener(completedChangeEvent, handleCompletedChange);
	window.addEventListener('storage', handleCompletedChange);

	return () => {
		window.removeEventListener(completedChangeEvent, handleCompletedChange);
		window.removeEventListener('storage', handleCompletedChange);
	};
}

export function rememberChapter(chapterId: string) {
	if (!storageAvailable()) return;
	window.localStorage.setItem(chapterKey, chapterId);
}

export function readSidebarState(): SidebarState {
	if (!storageAvailable()) return 'open';
	return window.localStorage.getItem(sidebarKey) === 'collapsed' ? 'collapsed' : 'open';
}

export function writeSidebarState(state: SidebarState) {
	if (!storageAvailable()) return;
	window.localStorage.setItem(sidebarKey, state);
}
