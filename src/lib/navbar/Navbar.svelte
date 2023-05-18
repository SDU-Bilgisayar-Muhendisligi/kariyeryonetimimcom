<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Profile from '@/lib/navbar/Profile.svelte';
	import items from '@/lib/navbar/items.js';
	let navitems = items;
	import Icon from '@iconify/svelte';


	let loginedUser = false;

	onMount(() => {
		let storage = localStorage.getItem('logined');

		loginedUser = storage ? true : false;
	});
</script>

<nav class="navbarHead">
	<div class="container flex justify-between items-center flex-shrink-0">
		<div class="flex items-center justify-center space-x-5 relative">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<img src="/logo.png" on:click={() => goto('/')} alt="kariyer" class="h-10 cursor-pointer" />
			<input
				type="text"
				name="searchBar"
				id="password"
				placeholder="Yazılım Uzmanı..."
				class="border border-gitcol-600 text-sm rounded-lg focus:ring-gitcol-600 transition-all outline-none focus:ring-1 focus:border-gitcol-600 block w-56 focus:w-96 p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white"
				required=""
			/>
			<div class="absolute right-0.5 rounded-lg hover:bg-gitcol-900 p-3">
				<Icon icon="ic:baseline-search" class="text-gitcol-500" />
			</div>
		</div>
		<div class="flex space-x-6 items-center">
			{#each navitems as item}
				<a
					href={item.href}
					class="text-base font-medium text-gray-200 hover:text-gray-100 transition-all flex-shrink-0"
				>
					{item.name}
				</a>
			{/each}
		</div>

		{#if loginedUser}
			<div class="p-0 m-0 flex items-center justify-center space-x-1">
				<Profile />
			</div>
		{:else}
			<button
				class="bg-[#1A1D21] px-4 py-2 rounded-[10px] text-white text-sm"
			>
				Login
			</button>
		{/if}
	</div>
</nav>
