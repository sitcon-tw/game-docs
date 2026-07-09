<script lang="ts">
	import {
		readCompleted,
		readSidebarState,
		rememberChapter,
		subscribeCompleted,
		writeSidebarState,
	} from '../../lib/docs-progress';

	interface Chapter {
		id: string;
		eyebrow: string;
		title: string;
		duration: string;
		level: string;
		tags: string[];
		summary: string;
		href: string;
	}

	interface Props {
		chapters: Chapter[];
		currentId: string;
	}

	let { chapters, currentId }: Props = $props();
	let completed = $state<string[]>([]);
	let collapsed = $state(false);
	let sidebarOpen = $state(false);
	let isMobile = $state(false);

	function setSidebar(open: boolean) {
		if (isMobile) {
			sidebarOpen = open;
			return;
		}

		collapsed = !open;
		writeSidebarState(open ? 'open' : 'collapsed');
	}

	function closeMobileSidebar() {
		if (isMobile) {
			sidebarOpen = false;
		}
	}

	function displayIndex(chapter: Chapter) {
		if (completed.includes(chapter.id)) return '✓';

		const index = chapters.findIndex((item) => item.id === chapter.id) + 1;
		return String(index).padStart(2, '0');
	}

	$effect(() => {
		if (typeof window === 'undefined') return;

		rememberChapter(currentId);
		completed = readCompleted();
		collapsed = readSidebarState() === 'collapsed';

		const mediaQuery = window.matchMedia('(max-width: 820px)');
		const syncMediaState = () => {
			isMobile = mediaQuery.matches;
			if (!isMobile) sidebarOpen = false;
		};
		const openButton = document.getElementById('openSidebar');
		const scrim = document.getElementById('scrim');
		const openSidebar = () => setSidebar(true);
		const closeSidebar = () => {
			sidebarOpen = false;
		};

		syncMediaState();

		const unsubscribeCompleted = subscribeCompleted((completedIds) => {
			completed = completedIds;
		});

		mediaQuery.addEventListener('change', syncMediaState);
		openButton?.addEventListener('click', openSidebar);
		scrim?.addEventListener('click', closeSidebar);

		return () => {
			unsubscribeCompleted();
			mediaQuery.removeEventListener('change', syncMediaState);
			openButton?.removeEventListener('click', openSidebar);
			scrim?.removeEventListener('click', closeSidebar);
		};
	});

	$effect(() => {
		if (typeof document === 'undefined') return;

		document.body.classList.toggle('sidebar-collapsed', collapsed && !isMobile);
		document.body.classList.toggle('sidebar-open', sidebarOpen && isMobile);
	});
</script>

<aside class="sidebar" id="sidebar" aria-label="章節目錄">
	<div class="brand-row">
		<div class="mark">SC</div>
		<div>
			<p class="brand-title">Camp Docs</p>
			<p class="brand-subtitle">高中前端教學手冊</p>
		</div>
		<button class="icon-button" type="button" aria-label="收合章節目錄" onclick={() => setSidebar(false)}>
			<span class="ui-icon i-lucide-chevron-left" aria-hidden="true"></span>
		</button>
	</div>

	<div class="sidebar-search">
		<slot name="search" />
	</div>

	<nav class="chapter-list" aria-label="所有章節">
		{#each chapters as chapter}
			<a
				class="chapter-button"
				href={chapter.href}
				aria-current={chapter.id === currentId ? 'true' : 'false'}
				onclick={closeMobileSidebar}
			>
				<span class="chapter-index">{displayIndex(chapter)}</span>
				<span>
					<span class="chapter-name">{chapter.title}</span>
					<span class="chapter-meta">{chapter.duration} · {chapter.level}</span>
				</span>
			</a>
		{/each}
	</nav>

	<p class="sidebar-note">
		閱讀順序可以照章節往下，也可以直接搜尋「安全」、「Svelte」或「小專題」。完成狀態會存在這台瀏覽器。
	</p>
</aside>
