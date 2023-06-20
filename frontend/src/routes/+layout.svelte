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
		
	</div>
</main>
