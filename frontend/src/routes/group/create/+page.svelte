<script>
	import { userStore } from '@/stores.js';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';

	let fileInputOpened = false;
	let files = [];

	async function openFileInput() {
		let input = document.getElementById('fileInput');
		input.click();
	}

	let groupname = '';
	$: {
	}

	async function creategrouyp() {
		const formData = new FormData();

		formData.append('profilePicture', files[0]);
		formData.append('groupname', groupname);

		let response = await fetch(`${env.PUBLIC_API_URL}/group`, {
			method: 'POST',
			headers: {
				Authorization: `${Cookies.get('token')}`
			},
			body: formData
		});

		if (response.status == 200) {
			goto(`/group/${groupname}`);
		}
	}
</script>

<main
	class=" bg-gitcol-800 rounded-lg border border-gitcol-600 rounded-t-lg p-5 flex flex-col items-center justify-center"
>
	<h1 class="text-3xl font-bold text-white text-center mb-5">Group Oluştur</h1>
	<div class="flex space-x-5 items-center justify-center">
		<div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="profilepic m-4 cursor-pointer rounded-full" on:click={openFileInput}>
				<img
					class="profilepic__image h-56 w-56"
					src={files.length > 0
						? URL.createObjectURL(files[0])
						: `${env.PUBLIC_API_URL}/file/def.avif`}
					alt="sitelogo"
				/>
				<div class="profilepic__content">
					<span class="profilepic__icon"><i class="fas fa-camera" /></span>
					<span class="profilepic__text cursor-pointer">Edit Profile</span>
				</div>
			</div>
			<input
				type="file"
				name="galery"
				class="hidden"
				id="fileInput"
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
							group name
						</label>
						<input
							type="text"
							bind:value={groupname}
							name="groupname"
							placeholder="group name"
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

	.profilepic:hover .profilepic__content {
		opacity: 1;
	}

	.profilepic:hover .profilepic__image {
		opacity: 0.5;
	}

	.profilepic__image {
		object-fit: cover;
		opacity: 1;
		transition: opacity 0.2s ease-in-out;
	}

	.profilepic__content {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: white;
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
	}

	.profilepic__icon {
		color: white;
		padding-bottom: 8px;
	}

	.fas {
		font-size: 20px;
	}

	.profilepic__text {
		text-transform: uppercase;
		font-size: 12px;
		width: 50%;
		text-align: center;
	}
</style>
