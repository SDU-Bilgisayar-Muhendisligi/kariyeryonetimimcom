<script>
	import { userStore } from '@/stores.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	// My event of thought:

	const myEvents = [
		{
			publisher: {
				username: 'github',
				profilePicture: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
				name: 'GitHub',
				job: 'Where the world builds software'
			},
			content: {
				name: 'Github Student',
				description:
					'GitHub is where over 65 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and features, power your CI/CD and DevOps workevents, and secure code before you commit it.',
				images: ['https://github.githubassets.com/images/modules/site/social-cards/actions.png']
			},
			likes: 1297379,
			comments: 891327891
		},
		{
			publisher: {
				username: 'github',
				profilePicture: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
				name: 'GitHub',
				job: 'Where the world builds software'
			},
			content: {
				name: 'Github Student',
				description:
					'GitHub is where over 65 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and features, power your CI/CD and DevOps workevents, and secure code before you commit it.',
				images: ['https://github.githubassets.com/images/modules/site/social-cards/actions.png']
			},
			likes: 1000000000,
			comments: 10000
		},
		{
			publisher: {
				username: 'github',
				profilePicture: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
				name: 'GitHub',
				job: 'Where the world builds software'
			},
			content: {
				name: 'Github Student',
				description:
					'GitHub is where over 65 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and features, power your CI/CD and DevOps workevents, and secure code before you commit it.',
				images: ['https://github.githubassets.com/images/modules/site/social-cards/actions.png']
			},
			likes: 1200000000,
			comments: 10000
		}
	];

	let openedComment = '';

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

<main class="flex flex-col space-y-4 items-center">
	<div class="bg-gitcol-800 rounded-lg border border-gitcol-600 rounded-t-lg p-5 w-full">
		<h3>Beğenebileceğiniz Etkinlikler</h3>
	</div>
	<div class="w-3/4 flex justify-center">
		<!--post-->
		<div class="space-y-5">
			{#each myEvents as event}
				<div class="bg-gitcol-800 rounded-lg border border-gitcol-600 rounded-t-lg">
					<div class="publisher p-4 border-b border-gitcol-600">
						<div class="flex items-center space-x-2">
							<img
								src={event.publisher.profilePicture}
								class="w-10 h-10 rounded-full border-2 border-gitcol-600 transition-all hover:scale-110 hover:border-gitcol-400"
								alt=""
							/>
							<div class="flex flex-col">
								<div class="text-white text-base">
									{event.publisher.name}
								</div>
								<div class="text-gray-300 text-xs">
									{event.publisher.job}
								</div>
							</div>
						</div>
					</div>
					<div class="content">
						<div
							class="
						text-gitcol-100
						 text-sm w-[90%] p-4"
						>
							{event.content.description.size > 200
								? event.content.description.slice(0, 200) + '...'
								: event.content.description}
						</div>
						<img src={event.content.images[0]} class="w-full" alt="" />
					</div>
					<div
						class="commentsizeandlikesize
						flex justify-between items-center p-4 text-gray-300 text-xs"
					>
						<div class="flex space-x-5 items-center">
							<button
								class="bg-gitcol-600 rounded-lg px-8 py-2 transition-all hover:bg-gitcol-500 text-white text-sm whitespace-nowrap"
								on:click={() =>
									goto('/event/' + event.content.name.replaceAll(' ', '-').toLowerCase())}
							>
								Katıl
							</button>
							<div class="mr-2 flex items-center space-x-1">
								<Icon icon="solar:like-bold" class="text-2xl" />
								<div>{formatNumber(event.likes)}</div>
							</div>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div class="mr-2 flex items-center space-x-1">
								<Icon icon="ic:outline-insert-comment" class="text-2xl" />
								<div>
									{formatNumber(event.comments)}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="messagebox fixed right-0 bottom-0">
		<div class="">
			<div />
		</div>
	</div>
</main>
