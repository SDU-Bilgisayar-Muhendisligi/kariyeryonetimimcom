<script>
	import { env } from '$env/dynamic/public';
	import { userStore } from '@/stores.js';
	import Cookies from 'js-cookie';
	let username = '';

	async function createDM() {
		if (!username) return alert('Kullanıcı adı boş olamaz');
		let user = userStore.subscribe((value) => value);

		if (user.username === username) return alert('Kendinize mesaj gönderemezsiniz');

		const res = await fetch(`${env.PUBLIC_API_URL}/message/create`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${Cookies.get('token')}`
			},
			body: JSON.stringify({
				username
			})
		});

		const data = await res.json();

		if (data.succes) {
			window.location.href = `/message/${data.username}`;
		}

		if (data.error) {
			alert(data.error);
		}
	}
</script>

<main class="container">
	<!--Enter Username-->
	<form
		class="bg-gitcol-800 flex flex-col items-center justify-center space-y-5 rounded-lg border border-gitcol-600 p-3"
		on:submit|preventDefault={createDM}
	>
		<input
			type="username"
			bind:value={username}
			class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white"
			placeholder="bir kullanıcı adı giriniz"
			required=""
		/>
		<button
			type="submit"
			class="w-full p-2 bg-gitcol-800 rounded-md border border-gitcol-600 hover:text-gitcol-200 transition-all hover:bg-gitcol-900 text-gitcol-100"
		>
			Oluştur
		</button>
	</form>
</main>
