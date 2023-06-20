<script>
	import { userStore } from '@/stores.js';
	import Icon from '@iconify/svelte';
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';

	export let data;

	let flows = [];
	let posts = data.posts;

	let suggestUsers = data.companies.splice(0, 3).reverse();

	function formatNumber(num) {
		if (num >= 1000000000) {
			return (num / 1000000000).toFixed(1) + 'B';
		} else if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		} else {
			return num.toString();
		}
	}
</script>

<main class="flex space-x-5">
	<div class="flex flex-col space-y-2">
		<!--Profile-->
		{#if $userStore && $userStore.username}
			<div
				class="bg-gitcol-800 flex flex-col rounded-lg border border-gitcol-600 py-4 px-16 bg-center bg-no-repeat bg-cover transition-all"
				style="background-image: url('https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg');"
			>
				<div class="flex flex-col items-center bg-gitcol-900 rounded-lg px-10 py-2">
					<img
						src={`${env.PUBLIC_API_URL}/file/${$userStore.profilePicture}`}
						class="w-16 h-16 rounded-full border-2 border-gitcol-600 transition-all hover:scale-110 hover:border-gitcol-400"
						alt=""
					/>
					<div class="flex flex-col mt-2 items-center pb-2">
						<div class="text-white text-base whitespace-nowrap px-1">
							{$userStore.username}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<div class="space-y-5 w-full">
			{#each posts as flow}
				<div class="bg-gitcol-800 rounded-lg border border-gitcol-600 rounded-t-lg">
					<div class="publisher p-4 border-b border-gitcol-600">
						<div class="flex items-center space-x-2">
							<a href={`/company/${flow.publisher.username}`}>
								<img
									src={`${env.PUBLIC_API_URL}/file/${flow.publisher.profilePicture}`}
									class="w-10 h-10 rounded-full border-2 border-gitcol-600 transition-all hover:scale-110 hover:border-gitcol-400"
									alt=""
								/>
							</a>
							<div class="flex flex-col">
								<div class="text-white text-base">
									{flow.publisher.username}
								</div>
							</div>
						</div>
					</div>
					<div class="content">
						<div class="text-gitcol-100 text-sm w-[90%] p-4">
							{flow.description.size > 200
								? flow.description.slice(0, 200) + '...'
								: flow.description}
						</div>
						<img src={`${env.PUBLIC_API_URL}/file/${flow.image}`} class="w-full" alt="" />
					</div>
					<div
						class="commentsizeandlikesize
						flex justify-between items-center p-4 text-gray-300 text-xs"
					>
						<div class="flex space-x-5 items-center">
							<div class="mr-2 flex items-center space-x-1">
								<Icon icon="solar:like-bold" class="text-2xl" />
								<div />
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div>
		<!--suggest-->
		<div class="bg-gitcol-800 rounded-lg border border-gitcol-600 p-5 rounded-t-lg w-96">
			<div class="text-white text-base">Beğenebileceğin Şirketler</div>
			<div class="space-y-5 mt-5">
				{#each suggestUsers as user}
					<a
						href={`/company/${user.username}`}
						class="flex items-center cursor-pointer space-x-2 hover:scale-110 transition-all hover:bg-gitcol-600 px-1 rounded-lg py-1 mx-2"
					>
						<img
							src={`${env.PUBLIC_API_URL}/file/${user.profilePicture}`}
							class="w-10 h-10 rounded-full border-2 border-gitcol-600 transition-all hover:border-gitcol-400"
							alt=""
						/>
						<div class="flex flex-col">
							<div class="text-white text-base whitespace-nowrap px-1">
								{user.username}
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>

	<div class="messagebox fixed right-0 bottom-0">
		<div class="">
			<div />
		</div>
	</div>
</main>
