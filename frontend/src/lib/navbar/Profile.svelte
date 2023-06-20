<script>
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import { userStore } from '@/stores.js';
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import Cookies from 'js-cookie';
	let show = false; // menu state
	let menu = null; // menu wrapper DOM reference

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

<div class="relative flex-shrink-0" bind:this={menu}>
	<div>
		<button on:click={() => (show = !show)} class="menu focus:outline-none focus:shadow-solid">
			<img
				class="w-10 h-10 rounded-full"
				src={`${env.PUBLIC_API_URL}/file/${$userStore.profilePicture}`}
				alt={$userStore.name}
			/>
		</button>

		{#if show}
			<div
				in:scale={{ duration: 200, start: 0.95 }}
				out:scale={{ duration: 175, start: 0.95 }}
				class="origin-top-right absolute right-0 w-64 mt-4 bg-gitcol-800 rounded-lg shadow-md border border-gitcol-600 z-50"
			>
				<div class="">
					<div class="flex items-center border-b-[calc(1rem-15.5px)] border-gitcol-600 px-3 py-2">
						<img
							src={`${env.PUBLIC_API_URL}/file/${$userStore.profilePicture}`}
							class="w-14 h-14 rounded-full"
							alt=""
						/>
						<div class="mx-auto space-y-1">
							<p class="text-base font-medium leading-none text-gray-200">{$userStore.username}</p>
							<button
								on:click={() => {
									show = false;
									goto('/profile/' + $userStore.username);
								}}
								class="text-sm leading-none text-gitcol-400 hover:text-gitcol-300 transition-all cursor-pointer"
							>
								Profili Görüntüle
							</button>
						</div>
					</div>
					<div class="border-b-[calc(1rem-15.5px)] border-gitcol-600 px-3 py-2">
						<div class="uppercase text-sm font-medium text-gitcol-200">Hesap</div>
						<div
							class="text-gitcol-400 hover:text-gitcol-300 text-sm transition-all cursor-pointer mt-0.5 w-fit"
						>
							Şirketlerim
						</div>
						<a	
							href="/jobadverts/my"
							class="text-gitcol-400 hover:text-gitcol-300 text-sm transition-all cursor-pointer w-fit"
						>
							İlanlarım
						</a>
					</div>
					<div class="border-b-[calc(1rem-15.5px)] border-gitcol-600 px-3 py-2 flex flex-col">
						<div class="uppercase text-sm font-medium text-gitcol-200">Yönet</div>
						<a
							href="/company/create"
							class="text-gitcol-400 hover:text-gitcol-300 text-sm transition-all cursor-pointer mt-0.5 w-fit"
						>
							Şirket Oluştur
						</a>
						<a
							class="text-gitcol-400 hover:text-gitcol-300 text-sm transition-all cursor-pointer w-fit"
							href="/group/create"
						>
							Grup Oluştur
						</a>
						<a
							class="text-gitcol-400 hover:text-gitcol-300 text-sm transition-all cursor-pointer w-fit"
							href="/jobadverts/create"
						>
							İş İlanı Oluştur
						</a>
					</div>
					<div class=" px-3 py-2">
						<button
							class="uppercase text-sm font-medium text-gitcol-200 cursor-pointer hover:text-gitcol-200"
							on:click={() => {
								Cookies.remove('token');
								window.location.reload();
							}}>Oturumu Kapat</button
						>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
