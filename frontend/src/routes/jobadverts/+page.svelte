<script>
	import { userStore } from '@/stores.js';
	import Icon from '@iconify/svelte';
	import { env } from '$env/dynamic/public';
	import Cookies from 'js-cookie';
	export let data;

	let searchQuery = '';
</script>

<div class="bg-gitcol-800 rounded-lg border border-gitcol-600 rounded-t-lg py-5 px-5 mb-5 gap-3 flex flex-col">
	<h3>Senin İşine Yarayabilecek İlanlar</h3>
	<div class="relative">
		<input
			type="text"
			name="searchBar"
			id="password"
			placeholder="linustorvalds"
			class="border border-gitcol-600 text-sm rounded-lg focus:ring-gitcol-600 transition-all outline-none focus:ring-1 focus:border-gitcol-600 w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white hidden lg:block"
			required=""
			bind:value={searchQuery}
		/>
		{#if searchQuery.length > 1}
			<div
				class="absolute bg-[#1A1D21] border border-gitcol-600 rounded-md p-1 mt-1 w-full flex flex-col z-[999]"
			>
				{#each data.ads.filter((x) => searchQuery !== '' && x.description
							.toLowerCase()
							.includes(searchQuery.toLowerCase())) as item}
					<button
						class="text-gitcol-100 text-sm p-2 hover:bg-gitcol-900 rounded-md text-left"
						on:click={async () => {
							searchQuery = '';
							const res = await fetch(`${env.PUBLIC_API_URL}/message/create`, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									Authorization: `${Cookies.get('token')}`
								},
								body: JSON.stringify({
									username: item.author
								})
							});
							if (res.status === 200) {
								alert('Mesaj gönderildi');
								window.location.href = `/message/${item.author}`;
							} else {
								alert('Bir hata oluştu');
								const data = await res.json();
								alert(data.error);
							}
						}}>{item.description}</button
					>
				{/each}
			</div>
		{/if}
	</div>
</div>

<main class="flex space-x-5">
	<div>
		<!--post-->
		<div class="flex flex-wrap gap-4">
			{#each data.ads as flow}
				<div class="bg-gitcol-800 rounded-lg border border-gitcol-600 rounded-t-lg">
					<div class="publisher p-4 border-b border-gitcol-600">
						<div class="flex items-center space-x-2">
							<a href={`/company/${flow.author}`}>
								<img
									src={`${env.PUBLIC_API_URL}/file/${flow.userProfilePicture}`}
									class="w-10 h-10 rounded-full border-2 border-gitcol-600 transition-all hover:scale-110 hover:border-gitcol-400"
									alt=""
								/>
							</a>
							<div class="flex flex-col">
								<div class="text-white text-base">
									{flow.author}
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
						<img src={`${env.PUBLIC_API_URL}/file/${flow.image}`} class="h-96" alt="" />
					</div>
					<div
						class="commentsizeandlikesize
						flex justify-between items-center p-4 text-gray-300 text-xs"
					>
						<div class="flex space-x-5 items-center">
							<button
								class="mr-2 flex items-center space-x-1 justify-center bg-gitcol-600 p-2 rounded-lg transition-all hover:bg-gitcol-400"
								on:click={async () => {
									const res = await fetch(`${env.PUBLIC_API_URL}/message/create`, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
											Authorization: `${Cookies.get('token')}`
										},
										body: JSON.stringify({
											username: flow.author
										})
									});
									if (res.status === 200) {
										alert('Mesaj gönderildi');
										window.location.href = `/message/${flow.author}`;
									} else {
										alert('Bir hata oluştu');
										const data = await res.json();
										alert(data.error);
									}
								}}
							>
								<span> İlan sahibiyle iletişime geç </span>
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</main>
