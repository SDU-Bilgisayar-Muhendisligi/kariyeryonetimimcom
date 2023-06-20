<script>
	import { userStore } from '@/stores.js';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';

	let fileInputOpened = false;
	let files = [];

	let jobadvertsname = '';

	async function creategrouyp() {
		const formData = new FormData();

		formData.append('image', files[0]);
		formData.append('description', jobadvertsname);

		let response = await fetch(`${env.PUBLIC_API_URL}/jobadvert`, {
			method: 'POST',
			headers: {
				Authorization: `${Cookies.get('token')}`
			},
			body: formData
		});

		if (response.ok) {
			const res = await response.json();

			goto(`/jobadverts/my`);
		}
	}
</script>

<main
	class=" bg-gitcol-800 rounded-lg border border-gitcol-600 rounded-t-lg p-5 flex flex-col items-center justify-center"
>
	<h1 class="text-3xl font-bold text-white text-center mb-5">İş İlanı Oluştur</h1>
	<div class="flex space-x-5 items-center justify-center">
		<div>
			<input
				type="file"
				name="galery"
				id="fileInput"
				class="text-white bg-[#1A1D21] border border-gitcol-600 rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 sm:text-sm"
				on:change={(e) => {
					files = [...e.target.files];
				}}
			/>
		</div>

		<div class="w-96">
			<div class="w-full max-w-lg">
				<div class="flex flex-wrap -mx-3 mb-6">
					<div class="w-full px-3">
						<label
							class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
							for="grid-last-name"
						>
							ilan açıklaması
						</label>
						<input
							type="text"
							bind:value={jobadvertsname}
							name="ilanismi"
							placeholder="ilan açıklaması"
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
							required=""
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
	<button
		class="bg-gitcol-600 text-white font-semibold w-1/2 py-2 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-gitcol-500 mt-4"
		on:click={() => {
			creategrouyp();
		}}>Olustur</button
	>
</main>

<style>
	.profilepic {
		position: relative;
		width: 14rem;
		height: 14rem;
		border-radius: 50%;
		overflow: hidden;
		background-color: #111;
	}
</style>
