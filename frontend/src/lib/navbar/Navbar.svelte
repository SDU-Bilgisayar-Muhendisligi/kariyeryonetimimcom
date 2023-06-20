<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import Cookies from 'js-cookie';
	import Profile from '@/lib/navbar/Profile.svelte';
	import Notifications from '@/lib/navbar/Notifications.svelte';
	import items from '@/lib/navbar/items.js';
	import LoginModal from '@/lib/navbar/LoginModal.svelte';
	let navitems = items;
	import Icon from '@iconify/svelte';

	import { userStore } from '@/stores';
	import { sequence } from '@sveltejs/kit/hooks';

	let showModal = false;

	let users = [];
	let groups = [];
	let companies = [];
	let all = [];

	onMount(async () => {
		await fetch(`${env.PUBLIC_API_URL}/user/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((res) => {
				Object.keys(res.users).map((key) => {
					users.push({
						name: res.users[key].username,
						href: `/profile/${res.users[key].username}`
					});
				});
			});

		await fetch(`${env.PUBLIC_API_URL}/group/all`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((res) => {
				Object.keys(res.groups).map((key) => {
					groups.push({
						name: res.groups[key].username,
						href: `/group/${res.groups[key].username}`
					});
				});
			});

		await fetch(`${env.PUBLIC_API_URL}/company/all`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((res) => {
				Object.keys(res.companies).map((key) => {
					companies.push({
						name: res.companies[key].username,
						href: `/company/${res.companies[key].username}`
					});
				});
			});

		all = users.concat(groups, companies);

		
	});

	let searchQuery = '';
</script>

<nav class="navbarHead">
	<div class="container flex justify-between items-center flex-shrink-0">
		<div class="flex items-center justify-center space-x-5 relative">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<img src="/logo.png" on:click={() => goto('/')} alt="kariyer" class="h-10 cursor-pointer" />
			<div class="relative">
				<input
					type="text"
					name="searchBar"
					id="password"
					placeholder="linustorvalds"
					class="border border-gitcol-600 text-sm rounded-lg focus:ring-gitcol-600 transition-all outline-none focus:ring-1 focus:border-gitcol-600 w-56 focus:w-96 p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white hidden lg:block"
					required=""
					bind:value={searchQuery}
				/>
				{#if searchQuery.length > 1}
					<div
						class="absolute bg-[#1A1D21] border border-gitcol-600 rounded-md p-1 mt-1 w-full flex flex-col z-[999]"
					>
						{#each all.filter((x) => searchQuery !== '' && x.name
									.toLowerCase()
									.includes(searchQuery.toLowerCase())) as item}
							<a
								class="text-gitcol-100 text-sm p-2 hover:bg-gitcol-900 rounded-md"
								href={item.href}
								on:click={() => {
									searchQuery = '';
								}}>{item.name}</a
							>
						{/each}
					</div>
				{/if}
			</div>
			<div class="absolute right-0.5 rounded-lg hover:bg-gitcol-900 p-3 hidden lg:block">
				<Icon icon="ic:baseline-search" class="text-gitcol-500" />
			</div>
		</div>
		<div class="flex space-x-6 items-center">
			{#each navitems as item}
				<a
					href={item.href}
					class="text-sm lg:text-base font-medium text-gray-200 hover:text-gray-100 transition-all flex-shrink-0"
				>
					{item.name}
				</a>
			{/each}
		</div>
		{#if $userStore && $userStore.username}
			<div class="p-0 m-0 flex items-center justify-center space-x-1">
				<Notifications />
				<Profile />
			</div>
		{:else}
			<button
				on:click={() => (showModal = true)}
				class="bg-[#1A1D21] px-4 py-2 rounded-[10px] text-white text-sm"
			>
				Login
			</button>
			<LoginModal bind:showModal />
		{/if}
	</div>
</nav>
