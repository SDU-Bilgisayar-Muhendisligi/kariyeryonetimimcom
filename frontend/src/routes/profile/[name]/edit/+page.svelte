<script>
	import { userStore } from '@/stores.js';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';

	let fileInputOpened = false;
	let files = [];

	export let data;

	async function openFileInput() {
		let input = document.getElementById('fileInput');
		input.click();
	}

	let newData = {
		...data.user,
		profilePicture: data.user ? `${env.PUBLIC_API_URL}/file/${data.user.profilePicture}` : '',
		email: $userStore.username ? $userStore.email : ''
	};

	onMount(() => {
		if ($userStore.username !== data.user.username) {
			goto(`/profile/${data.user.username}`);
		}
	});

	async function editProfile() {
		const formData = new FormData();

		if (files.length) {
			formData.append('profilePicture', files[0]);
		}

		Object.keys(newData).forEach((key) => {
			formData.append(key, newData[key]);
		});

		let response = await fetch(`${env.PUBLIC_API_URL}/user`, {
			method: 'PATCH',
			headers: {
				Authorization: `${Cookies.get('token')}`
			},
			body: formData
		});

		if (response.ok) {
			window.location.href = `/profile/${newData.username}`;
		}

		let data = await response.json();

		if (data.error) {
			alert(data.error);
		}
	}
</script>

<main class="space-x-5 bg-gitcol-800 rounded-lg border border-gitcol-600 rounded-t-lg p-5">
	<div class="flex space-x-5 items-center">
		<div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="profilepic m-4 cursor-pointer rounded-full" on:click={openFileInput}>
				<img
					class="profilepic__image h-56 w-56"
					src={files.length > 0 ? URL.createObjectURL(files[0]) : newData.profilePicture}
					alt="Profibild"
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
							username
						</label>
						<input
							type="text"
							bind:value={newData.username}
							name="username"
							placeholder={$userStore.username}
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
							required=""
						/>
					</div>
				</div>
				<div class="w-full">
					<div class="w-full">
						<label
							class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
							for="grid-last-name"
						>
							Email
						</label>
						<input
							type="email"
							bind:value={newData.email}
							name="email"
							placeholder="linustorvalds@linux.sh"
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
							required=""
						/>
					</div>
					<div class="w-full mt-2">
						<label
							class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
							for="grid-last-name"
						>
							Biyografi
						</label>
						<textarea
							type="text"
							name="biyography"
							bind:value={newData.biography}
							placeholder="lorem ipsum dolar sit amet"
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
							required=""
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
	<button
		class="
        bg-gitcol-600
        text-white
        font-semibold
        w-1/2
        py-2
        rounded-lg
        focus:ring-2
        focus:ring-offset-2
        focus:ring-gitcol-500
        mt-4"
		on:click={() => {
			editProfile();
			goto(`/profile/${data.user.username}`);
		}}>Kaydet</button
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
