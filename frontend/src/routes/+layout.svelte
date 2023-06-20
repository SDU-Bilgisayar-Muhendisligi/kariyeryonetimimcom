<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import Navbar from '@/lib/navbar/Navbar.svelte';
	import { userStore } from '@/stores.js';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
</script>

<main class="flex flex-col items-center">
	<Navbar />
	<div class="container mt-5">
		<slot />
		{#if !$page.url.pathname.includes('message') && $userStore && $userStore.username}
			<a
				class="fixed bottom-0 right-0 m-5 bg-gitcol-800 p-3 rounded-full hover:scale-150 hover:bg-gitcol-800 transition-all border border-gitcol-600"
				href="/message"
			>
				<Icon icon="uiw:message" color="white" width="40" />
			</a>
		{/if}
	</div>
</main>
