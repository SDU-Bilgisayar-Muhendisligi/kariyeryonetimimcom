<script>
	import { userStore } from '@/stores.js';
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import Cookies from 'js-cookie';
	export let data;
	let group = data.group;

	let sharedContents = Object.entries(group.contents).reverse();

	let fileInputOpened = false;
	let files = [];
	let contentDescription = '';

	$: if (files.length > 0) {
		fileInputOpened = true;
	}

	async function openFileInput() {
		
		fileInputOpened = true;
		let input = document.getElementById('fileInput');
		input.click();
	}

	async function newContent() {
		if (contentDescription === '') {
			return alert('Açıklama boş olamaz!');
		}

		const formData = new FormData();
		formData.append('groupname', group.username);
		formData.append('content', contentDescription);
		formData.append('image', files[0]);

		const res = await fetch(`${env.PUBLIC_API_URL}/group/content`, {
			method: 'POST',
			headers: {
				Authorization: `${Cookies.get('token')}`
			},
			body: formData
		});

		if (res.status === 200) {
			window.location.reload();
		}
	}

	async function deleteContent(a) {
		const res = await fetch(
			`${env.PUBLIC_API_URL}/group/content/${group.username}/${a}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `${Cookies.get('token')}`
				}
			}
		);

		if (res.status === 200) {
			window.location.reload();
		}
	}
</script>

<main class="bg-gitcol-800 rounded-lg border border-gitcol-600 rounded-t-lg p-4 flex space-x-4">
	<div class="w-1/3">
		<div class="bg-gitcol-900 rounded-lg w-full py-2 space-y-2 flex flex-col items-center">
			<img
				class="h-52 w-52 rounded-full border-2 border-gitcol-600 transition-all"
				src={`${env.PUBLIC_API_URL}/file/${group.profilePicture}`}
				alt={group.username}
			/>
			<div class="text-white text-2xl whitespace-nowrap px-1 w-fit">{group.username}</div>
			<button
				class="bg-gitcol-600 rounded-lg w-2/3 py-2 transition-all hover:bg-gitcol-500 text-white text-sm whitespace-nowrap"
				on:click={() => {
					goto('/group/' + data.group.username + '/edit');
				}}
			>
				Grubu Düzenle
			</button>
		</div>
		<div class="bg-gitcol-900 rounded-lg w-full py-2 space-y-2 mt-5 h-52 overflow-y-auto">
			<h4 class="text-lg mx-3 my-2">Üyeler</h4>
			{#each group.users as user}
				<button
					class="flex w-[95%] items-center space-x-2 transition-all hover:bg-gitcol-600 pl-1 pr-3 rounded-lg py-1 mx-2"
					on:click={() => goto('/profile/' + user.username)}
				>
					<img
						src={`${env.PUBLIC_API_URL}/file/${user.profilePicture}`}
						class="w-10 h-10 rounded-full border-2 border-gitcol-600 transition-all hover:border-gitcol-400"
						alt=""
					/>
					<div class="flex flex-col">
						<div class="text-white text-base whitespace-nowrap px-1">
							{user.username}
							{#if user.role === 1} (Yönetici) {/if}
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>
	<div class="flex w-full">
		<div class="space-y-2 w-4/5">
			{#if group.users.find((user) => user.username === $userStore.username && user.role === 1)}
				<div class="bg-gitcol-900 rounded-lg p-4 space-y-2 flex flex-col">
					<h4>Yeni Gönderi</h4>
					{#key files}
						{#if files.length > 0}
							{#each files as file}
								<img src={URL.createObjectURL(file)} class="w-2/3" alt={file.name} />
							{/each}
						{/if}
					{/key}
					<textarea
						class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
						rows="5"
						placeholder="Bir şeyler yaz..."
						bind:value={contentDescription}
					/>

					<div class="flex space-x-2">
						<button
							class="bg-gitcol-600 rounded-lg w-1/2 py-2 transition-all hover:bg-gitcol-500 text-white text-sm whitespace-nowrap"
							on:click={() => newContent()}
						>
							Gönder
						</button>
						<input
							type="file"
							accept="image/*"
							name="galery"
							class="hidden"
							id="fileInput"
							on:change={(e) => {
								files = [...e.target.files];
							}}
						/>
						<button
							on:click={() => openFileInput()}
							class="bg-gitcol-600 rounded-lg w-1/2 py-2 transition-all hover:bg-gitcol-500 text-white text-sm whitespace-nowrap"
						>
							Resim Ekle
						</button>
					</div>
				</div>
			{/if}

			{#each sharedContents as [id, content]}
				<div class="bg-gitcol-900 rounded-lg p-4 space-y-2 flex flex-col relative">
					<div class="text-white text-lg whitespace-nowrap px-1 w-fit flex space-x-1 items-center">
						<img
							src={`${env.PUBLIC_API_URL}/file/${content.userProfilePicture}`}
							class="h-8 w-8 rounded-full"
							alt=""
						/>
						<span>{content.author}</span>
					</div>

					<div class="text-gray-300 text-sm px-1">
						{content.description}
					</div>
					<div class="flex space-x-2">
						<img
							class="rounded-lg border-2 border-gitcol-600 transition-all"
							src={`${env.PUBLIC_API_URL}/file/${content.image}`}
							alt=""
						/>
					</div>
					{#if group.users.find((user) => user.username === $userStore.username && user.role === 1)}
						<button
							class="absolute right-4 font-extrabold text-xl top-2 text-gitcol-300"
							on:click={() => {
								deleteContent(id);
							}}>x</button
						>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</main>
