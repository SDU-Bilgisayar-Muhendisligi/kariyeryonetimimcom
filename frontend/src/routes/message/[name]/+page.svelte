<script>
	/** @type {import('./$types').PageData} */
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import Cookies from 'js-cookie';
	import { userStore } from '@/stores';
	export let data;

	let mainUser = userStore.subscribe((value) => value);
	let users = [];
	let messages = data.messages;
	let currentUserMessages = [];
	let currentUser = {};
	let scrollElement;
	let typing = false;
	onMount(async () => {
		await Object.keys(data.messages).map(async (key) => {
			const user = await fetch(`${env.PUBLIC_API_URL}/user/${key}`).then((res) => res.json());
			users.push(user.user);
			users = users;
		});

		const height = document.querySelector('.height');
		height.style.height = `${window.innerHeight - 300}px`;
		const usersDiv = document.querySelector('.usersDiv');
		usersDiv.style.height = `${window.innerHeight - 200}px`;

		await fetch(`${env.PUBLIC_API_URL}/message/${$page.params.name}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${Cookies.get('token')}`
			}
		})
			.then((res) => res.json())
			.then(async (res) => {
				currentUserMessages = res.messages;
				setTimeout(() => {
					scrollToBottom(scrollElement);
				}, 1);
			});

		setInterval(async () => {
			await fetch(`${env.PUBLIC_API_URL}/message/${$page.params.name}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${Cookies.get('token')}`
				}
			})
				.then((res) => res.json())
				.then(async (res) => {
					currentUserMessages = res.messages;
					setTimeout(() => {
						scrollToBottom(scrollElement);
					}, 1);
				});
		}, 100);

		await fetch(`${env.PUBLIC_API_URL}/user/${$page.params.name}`, {
			method: 'GET'
		})
			.then((res) => res.json())
			.then((res) => (currentUser = res.user));
	});

	let message = '';

	async function sendMessage() {
		let res = await fetch(`${env.PUBLIC_API_URL}/message/${$page.params.name}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${Cookies.get('token')}`
			},
			body: JSON.stringify({
				message
			})
		}).then((res) => res.json());

		if (res.succes) {
			currentUserMessages.push({
				profilePicture: mainUser.profilePicture,
				author: mainUser.username,
				message: message
			});
		}

		message = '';
	}

	//scroll to bottom
	const scrollToBottom = async (node) => {
		node.scroll({ top: node.scrollHeight });
	};
</script>

<main class="container">
	<div class="bg-gitcol-800 flex rounded-lg border border-gitcol-600 space-x-3">
		<div class="w-1/3 flex flex-col gap-2 usersDiv overflow-auto m-3">
			<a class="flex items-center p-2 hover:bg-gitcol-600 rounded-lg space-x-3" href="/message/new">
				<Icon icon="zondicons:add-outline" color="#6e7681" width="40" />
				<div class=" flex flex-col justify-center">
					<h3 class="text-base">Yeni Mesaj Oluştur</h3>
				</div>
			</a>
			{#each users as user}
				<a
					class="flex items-center p-2 hover:bg-gitcol-600 rounded-lg space-x-3"
					href="/message/{user.username}"
					target="_parent"
				>
					<img
						src={`${env.PUBLIC_API_URL}/file/${user.profilePicture}`}
						class="h-10 w-10 rounded-full"
						alt=""
					/>
					<div class=" flex flex-col justify-center">
						<h3 class="text-base">{user.username}</h3>
					</div>
				</a>
			{/each}
		</div>
		<div
			class="bg-gitcol-800 flex flex-col justify-between border-x rounded-md border-gitcol-600 w-full"
		>
			<div class="border-b border-gitcol-600 p-3 flex items-center space-x-3">
				<img
					src={`${env.PUBLIC_API_URL}/file/${currentUser.profilePicture}`}
					class="h-12 w-12 rounded-full"
					alt=""
				/>
				<h3 class="text-base">{$page.params.name}</h3>
			</div>
			<div class="overflow-auto height" bind:this={scrollElement}>
				{#each currentUserMessages as message}
					<div class="flex space-x-2 p-3">
						<img
							src={`${env.PUBLIC_API_URL}/file/${message.profilePicture}`}
							class="h-10 w-10 rounded-full"
							alt=""
						/>
						<div>
							<p class="text-base">
								{message.author}
							</p>
							<p class="text-sm text-gitcol-200">{message.message}</p>
						</div>
					</div>
				{/each}
			</div>
			<form class="flex" on:submit|preventDefault={sendMessage}>
				<input
					type="text"
					class="w-full p-2 bg-gitcol-800 rounded-b-md border-t outline-none text-white border-gitcol-600"
					placeholder="Mesajınızı yazın"
					bind:value={message}
					required
					on:input={() => (typing = true)}
				/>
				<button
					type="submit"
					class="p-2 bg-gitcol-800 rounded-md border border-gitcol-600 hover:text-gitcol-200 hover:scale-105 transition-all hover:bg-gitcol-900 text-gitcol-100"
				>
					<Icon icon="iconamoon:send-fill" color="#30363d" width="30" />
				</button>
			</form>
		</div>
	</div>
</main>
