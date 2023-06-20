<script>
	import { userStore } from '@/stores.js';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';

	export let data;
	let companies = data.companies.reverse();

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
		<div class="text-white text-base">Bazı Şirketler</div>
		<div class="space-y-5 mt-5">
			{#each companies as user}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					on:click={() => {
						goto('/company/' + user.username);
					}}
					class="flex items-center cursor-pointer space-x-2 transition-all hover:bg-gitcol-600 px-1 rounded-lg py-1 mx-2"
				>
					<img
						src={`${env.PUBLIC_API_URL}/file/${user.profilePicture}`}
						class="w-20 h-20 rounded-full border-2 border-gitcol-600 transition-all hover:border-gitcol-400"
						alt=""
					/>
					<div class="flex flex-col">
						<div class="text-white text-base whitespace-nowrap px-1">
							{user.username}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</main>
