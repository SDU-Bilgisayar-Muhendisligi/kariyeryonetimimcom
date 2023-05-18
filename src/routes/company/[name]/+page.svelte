<script>
	import { userStore } from '@/stores.js';
	import { goto } from '$app/navigation';
    let company = {
		username: 'github',
		name: 'GitHub',
		profilePicture: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
		name: 'GitHub',
		job: 'Where the world builds software'
	};

	let sharedContents = [
		{
			publisher: {
				username: company.username,
				profilePicture: company.profilePicture,
				name: company.name,
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
				username: company.username,
				profilePicture: company.profilePicture,
				name: company.name,
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
				username: company.username,
				profilePicture: company.profilePicture,
				name: company.name,
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
				username: company.username,
				profilePicture: company.profilePicture,
				name: company.name,
				job: 'Where the world builds software'
			},
			content: {
				description:
					'GitHub is where over 65 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and features, power your CI/CD and DevOps workflows, and secure code before you commit it.',
				images: ['https://github.githubassets.com/images/modules/open_graph/github-octocat.png']
			},
			likes: 1297379,
			comments: 891327891
		}
	];

	let users = [
		{
			name: 'linustorvalds',
			displayName: 'Linus Torvalds',
			profilePicture:
				'https://media.newyorker.com/photos/5ba177da9eb2f7420aadeb98/1:1/w_1003,h_1003,c_limit/Cohen-Linus-Torvalds.jpg'
		},
		{
			name: 'billgates',
			displayName: 'Bill Gates',
			profilePicture:
				'https://pbs.twimg.com/profile_images/1564398871996174336/M-hffw5a_400x400.jpg'
		}
	];

	

	let fileInputOpened = false;
	let files = [];

	$: if (files.length > 0) {
		fileInputOpened = true;
	}

	async function openFileInput() {
		fileInputOpened = true;
		let input = document.getElementById('fileInput');
		input.click();
	}
</script>

<main class="bg-gitcol-800 rounded-lg border border-gitcol-600 rounded-t-lg p-4 flex space-x-4">
	<div class="w-1/3">
		<div class="bg-gitcol-900 rounded-lg w-full py-2 space-y-2 flex flex-col items-center">
			<img
				class="h-52 w-52 rounded-full border-2 border-gitcol-600 transition-all"
				src={company.profilePicture}
				alt={company.name}
			/>
			<div class="text-white text-2xl whitespace-nowrap px-1 w-fit">{company.name}</div>
			<div class="text-gray-400 text-xs whitespace-nowrap px-1 w-fit">{company.job}</div>
			<button
				class="bg-gitcol-600 rounded-lg w-2/3 py-2 transition-all hover:bg-gitcol-500 text-white text-sm whitespace-nowrap"
				on:click={() => {
					goto('/company/' + company.username + '/edit');
				}}
			>
				Profili Düzenle
			</button>
		</div>
		<div class="bg-gitcol-900 rounded-lg w-full py-2 space-y-2 mt-5">
			<h4 class="text-lg mx-3 my-2">Üyeler</h4>
			{#each users as user}
				<button
					class="flex w-[95%] items-center space-x-2 transition-all hover:bg-gitcol-600 pl-1 pr-3 rounded-lg py-1 mx-2"
					on:click={() => goto('/profile/' + user.name)}
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
					</div>
				</button>
			{/each}
		</div>
	</div>
	<div class="flex w-full">
		<div class="space-y-2 w-4/5">
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
				/>

				<div class="flex space-x-2">
					<button
						class="bg-gitcol-600 rounded-lg w-1/2 py-2 transition-all hover:bg-gitcol-500 text-white text-sm whitespace-nowrap"
					>
						Gönder
					</button>
					<input
						type="file"
						name="galery"
						class="hidden"
						id="fileInput"
						on:change={(e) => {
							files = [...e.target.files];
						}}
					/>
					<button
						on:click={() => {
							openFileInput();
						}}
						class="bg-gitcol-600 rounded-lg w-1/2 py-2 transition-all hover:bg-gitcol-500 text-white text-sm whitespace-nowrap"
					>
						Resim Ekle
					</button>
				</div>
			</div>

			{#each sharedContents as content}
				<div class="bg-gitcol-900 rounded-lg p-4 space-y-2 flex flex-col">
					<div class="text-white text-lg whitespace-nowrap px-1 w-fit flex space-x-1 items-center">
						<img src={content.publisher.profilePicture} class="h-8 w-8 rounded-full" alt="" />
						<span>{content.publisher.name}</span>
					</div>

					<div class="text-gray-300 text-sm px-1">
						{content.content.description}
					</div>
					<div class="flex space-x-2">
						{#each content.content.images as image}
							<img
								class="rounded-lg border-2 border-gitcol-600 transition-all"
								src={image}
								alt=""
							/>
						{/each}
					</div>
					<div class="flex space-x-2">
						<div class="text-gray-400 text-xs whitespace-nowrap px-1 w-fit">
							{content.likes} Beğeni
						</div>
						<div class="text-gray-400 text-xs whitespace-nowrap px-1 w-fit">
							{content.comments} Yorum
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</main>
