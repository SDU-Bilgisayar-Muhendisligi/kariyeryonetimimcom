<script>
	import { userStore } from '@/stores.js';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	// My flow of thought:

	let groups = [
		{
			name: 'soloyazilim',
			displayName: 'Solo Yazılım',
			profilePicture: 'https://wallpaperaccess.com/full/2472433.jpg'
		},
		{
			name: 'gencbilisimciler',
			displayName: 'Genç Bilişimciler',
			profilePicture: 'https://images.squarespace-cdn.com/content/v1/55f1f0b8e4b06fa71e7d3f58/1458684562840-OJQB7KX06ZOS3NBW0N30/earth.jpg'
		},
		{
			name: 'uzaykodlama',
			displayName: 'Uzay Kodlama',
			profilePicture: 'https://img.piri.net/resim/upload/2015/09/29/3b9bmarsviking.jpg'
		}
	];

	function formatNumber(num) {
		if (num >= 1000000000) {
			return (num / 1000000000).toFixed(1) + 'B';
		} else if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		} else {
			return num.toString();
		}
	}
</script>

<main class="flex space-x-5">
	<!--suggest-->
	<div class="bg-gitcol-800 rounded-lg border border-gitcol-600 p-5 rounded-t-lg w-full">
		<div class="text-white text-base">Önerilen Gruplar</div>
		<div class="space-y-5 mt-5">
			{#each groups as group}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					on:click={() => {
						goto('/group/' + group.name);
					}}
					class="flex items-center cursor-pointer space-x-2 transition-all hover:bg-gitcol-600 px-1 rounded-lg py-1 mx-2"
				>
					<img
						src={group.profilePicture}
						class="w-20 h-20 rounded-full border-2 border-gitcol-600 transition-all hover:border-gitcol-400"
						alt=""
					/>
					<div class="flex flex-col">
						<div class="text-white text-base whitespace-nowrap px-1">
							{group.name}
						</div>
						<div class="text-gray-300 text-xs whitespace-nowrap px-1">
							{group.displayName}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</main>
