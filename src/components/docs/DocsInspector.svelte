<script lang="ts">
	import { readCompleted, subscribeCompleted, toggleChapterCompleted } from '../../lib/docs-progress';

	interface Props {
		chapterId: string;
		goals: string[];
		checklist: string[];
	}

	let { chapterId, goals, checklist }: Props = $props();
	let progress = $state(0);
	let completed = $state(false);

	function updateProgress() {
		const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
		progress =
			documentHeight > 0
				? Math.min(100, Math.max(0, Math.round((window.scrollY / documentHeight) * 100)))
				: 0;
	}

	function toggleCompleted() {
		const completedIds = toggleChapterCompleted(chapterId);
		completed = completedIds.includes(chapterId);
	}

	$effect(() => {
		if (typeof window === 'undefined') return;

		const syncCompleted = (completedIds: string[]) => {
			completed = completedIds.includes(chapterId);
		};

		syncCompleted(readCompleted());
		updateProgress();

		const unsubscribeCompleted = subscribeCompleted(syncCompleted);
		window.addEventListener('scroll', updateProgress, { passive: true });
		window.addEventListener('resize', updateProgress);

		return () => {
			unsubscribeCompleted();
			window.removeEventListener('scroll', updateProgress);
			window.removeEventListener('resize', updateProgress);
		};
	});
</script>

<aside class="inspector" aria-label="閱讀輔助">
	<section class="inspector-card">
		<h2 class="inspector-title">閱讀進度</h2>
		<div class="progress-rail" aria-hidden="true">
			<span class="progress-fill" style={`width: ${progress}%`}></span>
		</div>
		<p class="progress-text">本章 {progress}% 已閱讀</p>
		<button
			class={completed ? 'complete-button is-done' : 'complete-button'}
			type="button"
			onclick={toggleCompleted}
		>
			{completed ? '本章已完成' : '標記本章完成'}
		</button>
	</section>

	<section class="inspector-card">
		<h2 class="inspector-title">本章目標</h2>
		<ul class="goal-list">
			{#each goals as goal}
				<li class="check-list-item"><span class="dot" aria-hidden="true"></span><span>{goal}</span></li>
			{/each}
		</ul>
	</section>

	<section class="inspector-card">
		<h2 class="inspector-title">課後檢查</h2>
		<ul class="todo-list">
			{#each checklist as item, index}
				<li class="check-list-item">
					<input class="todo-checkbox" type="checkbox" id={`todo-${chapterId}-${index}`} />
					<label for={`todo-${chapterId}-${index}`}>{item}</label>
				</li>
			{/each}
		</ul>
	</section>
</aside>
