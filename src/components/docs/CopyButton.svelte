<script lang="ts">
	let label = $state('複製');
	let resetTimer = $state<number | undefined>();

	async function copyCode(event: MouseEvent) {
		const button = event.currentTarget;
		if (!(button instanceof HTMLElement)) return;

		const code = button.closest('.code-block')?.querySelector('pre')?.textContent?.replace(/\n$/, '') || '';
		const originalLabel = '複製';

		try {
			await navigator.clipboard.writeText(code);
			label = '已複製';
		} catch {
			label = '請手動複製';
		}

		window.clearTimeout(resetTimer);
		resetTimer = window.setTimeout(() => {
			label = originalLabel;
		}, 1400);
	}

	$effect(() => {
		return () => {
			window.clearTimeout(resetTimer);
		};
	});
</script>

<button class="copy-button" type="button" onclick={copyCode}>{label}</button>
