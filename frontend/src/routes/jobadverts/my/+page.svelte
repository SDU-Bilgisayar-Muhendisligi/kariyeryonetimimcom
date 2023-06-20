<script>
	import { env } from '$env/dynamic/public';
	import { userStore } from '@/stores.js';

	export let data;
</script>

<main>
	<div>
		<h1>İş İlanlarım</h1>
		<div class="flex flex-wrap gap-3 py-3">
			{#if data.jobadverts.length > 0}
				{#each data.jobadverts.reverse() as advert}
					<div
						class="bg-gitcol-800 rounded-lg flex-shrink-0 border border-gitcol-600 rounded-t-lg w-fit px-3"
					>
						<div class="publisher p-4 border-b border-gitcol-600">
							<div class="flex items-center space-x-2">
								<img
									src={`${env.PUBLIC_API_URL}/file/${$userStore.profilePicture}`}
									class="w-10 h-10 rounded-full border-2 border-gitcol-600 transition-all hover:scale-110 hover:border-gitcol-400"
									alt=""
								/>
								<div class="flex flex-col">
									<div class="text-white text-base">
										{$userStore.username}
									</div>
								</div>
							</div>
						</div>
						<div class="content">
							<div class="text-gitcol-100 text-sm w-[90%] p-4">
								{advert.description.size > 200
									? advert.description.slice(0, 200) + '...'
									: advert.description}
							</div>
							<img src={`${env.PUBLIC_API_URL}/file/${advert.image}`} class="h-96" alt="" />
						</div>
						<div
							class="commentsizeandlikesize
            flex justify-between items-center p-4 text-gray-300 text-xs"
						/>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</main>
