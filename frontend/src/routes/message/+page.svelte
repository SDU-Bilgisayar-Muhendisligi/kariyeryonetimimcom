<script>
	/** @type {import('./$types').PageData} */
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
	export let data;

	let users = [];
	let messages = data.messages;
	onMount(async () => {
		await Object.keys(data.messages).map(async (key) => {
			const user = await fetch(`${env.PUBLIC_API_URL}/user/${key}`).then((res) => res.json());
			users.push(user.user);
			users = users;
		});

		

		const usersDiv = document.querySelector('.usersDiv');
		usersDiv.style.height = `${window.innerHeight - 200}px`;
	});
</script>

<main class="container">
	<div class="bg-gitcol-800 flex rounded-lg border border-gitcol-600 p-3 space-x-3">
		<div class="w-full flex flex-col gap-2 usersDiv overflow-auto">
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
	</div>
</main>
