<script>
	import { userStore } from '@/stores.js';
	import Icon from '@iconify/svelte';
	// My flow of thought:
	const myFlows = [
		{
			publisher: {
				username: 'github',
				profilePicture: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
				name: 'GitHub',
				job: 'Where the world builds software'
			},
			content: {
				description:
					'GitHub is where over 65 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and features, power your CI/CD and DevOps workflows, and secure code before you commit it.',
				images: ['https://github.githubassets.com/images/modules/open_graph/github-octocat.png']
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
				description:
					'GitHub is where over 65 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and features, power your CI/CD and DevOps workflows, and secure code before you commit it.',
				images: ['https://github.githubassets.com/images/modules/open_graph/github-octocat.png']
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
				description:
					'GitHub is where over 65 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and features, power your CI/CD and DevOps workflows, and secure code before you commit it.',
				images: ['https://github.githubassets.com/images/modules/open_graph/github-octocat.png']
			},
			likes: 1200000000,
			comments: 10000
		}
	];

	let suggestUsers = [
		{
			username: 'github',
			profilePicture: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
			name: 'GitHub',
			job: 'Where the world builds software'
		},
		{
			username: 'github',
			profilePicture: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
			name: 'GitHub',
			job: 'Where the world builds software'
		},
		{
			username: 'github',
			profilePicture: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
			name: 'GitHub',
			job: 'Where the world builds software'
		}
	];

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
		<div
			class="bg-gitcol-800 flex flex-col rounded-lg border border-gitcol-600 py-4 px-16 rounded-t-lg bg-center bg-no-repeat bg-cover transition-all"
			style="background-image: url('{$userStore.banner}');"
		>
			<div class="flex flex-col items-center bg-gitcol-900 rounded-lg px-10 py-2">
				<img
					src={$userStore.profilePicture}
					class="w-16 h-16 rounded-full border-2 border-gitcol-600 transition-all hover:scale-110 hover:border-gitcol-400"
					alt=""
				/>
				<div class="flex flex-col mt-2 items-center pb-2">
					<div class="text-white text-base whitespace-nowrap px-1">
						{$userStore.name}
					</div>
					<div class="text-gray-300 text-xs whitespace-nowrap px-1">{$userStore.job}</div>
				</div>
			</div>
		</div>
	</div>

	<div>
		<!--post-->
		<div class="space-y-5">
			{#each myFlows as flow}
				<div
					class="bg-gitcol-800 rounded-lg border border-gitcol-600 rounded-t-lg"
				>
					<div class="publisher p-4 border-b border-gitcol-600">
						<div class="flex items-center space-x-2">
							<img
								src={flow.publisher.profilePicture}
								class="w-10 h-10 rounded-full border-2 border-gitcol-600 transition-all hover:scale-110 hover:border-gitcol-400"
								alt=""
							/>
							<div class="flex flex-col">
								<div class="text-white text-base">
									{flow.publisher.name}
								</div>
								<div class="text-gray-300 text-xs">
									{flow.publisher.job}
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
							{flow.content.description.size > 200
								? flow.content.description.slice(0, 200) + '...'
								: flow.content.description}
						</div>
						<img src={flow.content.images[0]} class="w-full" alt="" />
					</div>
					<div
						class="commentsizeandlikesize
						flex justify-between items-center p-4 text-gray-300 text-xs"
					>
						<div class="flex space-x-5 items-center">
							<div class="mr-2 flex items-center space-x-1">
								<Icon icon="solar:like-bold" class="text-2xl" />
								<div>{formatNumber(flow.likes)}</div>
							</div>
							<div class="mr-2 flex items-center space-x-1">
								<Icon icon="ic:outline-insert-comment" class="text-2xl" />
								<div>
									{formatNumber(flow.comments)}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div>
		<!--suggest-->
		<div
			class="bg-gitcol-800 rounded-lg border border-gitcol-600 p-5 rounded-t-lg w-96"
		>
			<div class="text-white text-base">You might like</div>
			<div class="space-y-5 mt-5">
				{#each suggestUsers as user}
					<div
						class="flex items-center cursor-pointer space-x-2 hover:scale-110 transition-all hover:bg-gitcol-600 px-1 rounded-lg py-1 mx-2"
					>
						<img
							src={user.profilePicture}
							class="w-10 h-10 rounded-full border-2 border-gitcol-600 transition-all hover:border-gitcol-400"
							alt=""
						/>
						<div class="flex flex-col">
							<div class="text-white text-base whitespace-nowrap px-1">
								{user.name}
							</div>
							<div class="text-gray-300 text-xs whitespace-nowrap px-1">
								{user.job}
							</div>
						</div>
					</div>
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
