<script>
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import { userStore } from '@/stores.js';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { each } from 'svelte/internal';
	let show = false; // menu state
	let menu = null; // menu wrapper DOM reference

	let notifications = [
		{
			image: 'https://wallpaperaccess.com/full/2472433.jpg',
			event: 'Solo Yazılım Grubuna Katıldın.'
		},
		{
			image: 'https://wallpaperaccess.com/full/2472433.jpg',
			event: 'Solo Yazılım Grubundan Atıldın.'
		},
		{
			image: 'https://images.squarespace-cdn.com/content/v1/55f1f0b8e4b06fa71e7d3f58/1458684562840-OJQB7KX06ZOS3NBW0N30/earth.jpg',
			event: 'Solo Yazılım Seni Takip Etti.'
		},
		{
			image: 'https://wallpaperaccess.com/full/2472433.jpg',
			event: 'Solo Yazılım Grubundan Atıldın.'
		},
		{
			image: 'https://images.squarespace-cdn.com/content/v1/55f1f0b8e4b06fa71e7d3f58/1458684562840-OJQB7KX06ZOS3NBW0N30/earth.jpg',
			event: 'Solo Yazılım Seni Takip Etti.'
		}
	];

	onMount(() => {
		const handleOutsideClick = (event) => {
			if (show && !menu.contains(event.target)) {
				show = false;
			}
		};

		const handleEscape = (event) => {
			if (show && event.key === 'Escape') {
				show = false;
			}
		};

		// add events when element is added to the DOM
		document.addEventListener('click', handleOutsideClick, false);
		document.addEventListener('keyup', handleEscape, false);

		// remove events when element is removed from the DOM
		return () => {
			document.removeEventListener('click', handleOutsideClick, false);
			document.removeEventListener('keyup', handleEscape, false);
		};
	});
</script>

<div class="relative" bind:this={menu}>
	<div>
		<button
			on:click={() => (show = !show)}
			class="h-10 w-10 bg-gitcol-900 flex items-center justify-center text-xl rounded-full"
		>
			<Icon icon="mdi:bell-notification" color="white" />
		</button>

		{#if show}
			<div
				in:scale={{ duration: 200, start: 0.95 }}
				out:scale={{ duration: 175, start: 0.95 }}
				class="origin-top-right absolute right-0 w-64 h-80 overflow-y-auto mt-4 bg-gitcol-800 rounded-lg shadow-md border border-gitcol-600"
			>
				<div>
					{#each notifications as notification}
						<div>
							<div class="flex items-center px-4 py-3 border-b border-gitcol-600">
								<div class="flex-shrink-0">
									<img class="h-10 w-10 rounded-full" src={notification.image} alt="" />
								</div>
								<div class="ml-3">
									<p class="text-sm leading-5 font-medium text-white">
										{notification.event}
									</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
