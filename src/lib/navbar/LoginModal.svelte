<script>
	export let showModal; // boolean
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let dialog; // HTMLDialogElement
	let registerDialog;
	let overflowVisible;

	let showRegisterModal = false;

	$: if (dialog && showModal) dialog.showModal();
	$: if (registerDialog && showRegisterModal) registerDialog.showModal();

	let loginData = {
		email: '',
		password: '',
		remindMe: false
	};

	let registerData = {
		email: '',
		password: '',
		username: ''
	};

	$: {
		console.log(loginData);
	}

	async function login() {}
	async function register() {}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	class="p-0 z-50 overflow-y-auto rounded-xl bg-[#131619] backdrop:backdrop-blur-sm"
	bind:this={dialog}
	on:close={() => ((showModal = false), (showRegisterModal = false))}
	on:click|self={() => {
		dialog.close();
		showModal = false;
		overflowVisible = !overflowVisible;
	}}
	in:fade={{ duration: 900 }}
	out:fade={{ duration: 900 }}
>
	<div class="bg-[#131619]">
		<div class="w-full rounded-xl shadow-md bg-[#131619] border border-gitcol-600">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<img src="/logo.png" class="w-96" alt="" />
				<form class="space-y-4 md:space-y-6" action="#">
					<div>
						<label for="email" class="block mb-2 text-sm font-medium text-white"
							>E-Posta Adresiniz</label
						>
						<input
							type="email"
							bind:value={loginData.email}
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white"
							placeholder="name@company.com"
							required=""
						/>
					</div>
					<div>
						<label for="password" class="block mb-2 text-sm font-medium text-white">Şifreniz</label>
						<input
							type="password"
							bind:value={loginData.password}
							placeholder="••••••••"
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white"
							required=""
						/>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-start">
							<div class="flex items-center h-5">
								<input
									id="link-checkbox"
									type="checkbox"
									bind:checked={loginData.remindMe}
									value=""
									class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
								/>
							</div>
							<div class="ml-3 text-sm">
								<label for="remember" class="text-gray-500 dark:text-gray-300">Beni Hatırla</label>
							</div>
						</div>
						<a href="#about" class="font-medium text-sm text-gitcol-200 hover:underline"
							>Şifreni mi Unuttun?</a
						>
					</div>
					<button
						type="submit"
						class="w-full bg-gitcol-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium"
						on:click|preventDefault={login()}>Giriş yap</button
					>
					<p class="text-sm font-light text-gray-400">
						Hesabın yok mu? <button
							class="font-medium text-gitcol-200 hover:underline text-sm ml-1"
							on:click|preventDefault={() => {
								showRegisterModal = true;
								dialog.close();
							}}>Kayıt ol</button
						>
					</p>
				</form>
			</div>
		</div>
	</div>
</dialog>

<!-- svelte-ignore a11y-click-events-have-key-events -->

<dialog
	class="p-0 z-50 overflow-y-auto rounded-xl bg-[#131619] backdrop:backdrop-blur-sm"
	bind:this={registerDialog}
	on:close={() => ((showModal = false), (showRegisterModal = false))}
	on:click|self={() => {
		registerDialog.close();
		showRegisterModal = false;
	}}
	in:fade={{ duration: 900 }}
	out:fade={{ duration: 900 }}
>
	<div class="bg-[#131619]">
		<div class="w-full rounded-xl shadow-md bg-[#131619] border border-gitcol-600">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<img src="/logo.png" class="w-96" alt="" />
				<form class="space-y-4" action="#">
					<div>
						<label for="email" class="block mb-2 text-sm font-medium text-white"
							>Kullanıcı Adı</label
						>
						<input
							type="text"
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white"
							placeholder="linustorvalds"
							required=""
						/>
					</div>
					<div>
						<label for="email" class="block mb-2 text-sm font-medium text-white"
							>E-Posta Adresi</label
						>
						<input
							type="email"
							name="email"
							id="email"
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white"
							placeholder="name@company.com"
							required=""
						/>
					</div>
					<div>
						<label for="password" class="block mb-2 text-sm font-medium text-white">Şifre</label>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="••••••••"
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white"
							required=""
						/>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="Şifrenizi Tekrar Girin"
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
							required=""
						/>
					</div>

					<button
						type="submit"
						on:click|preventDefault={register()}
						class="w-full bg-gitcol-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium"
						>Kayıt Ol</button
					>
					<p class="text-sm font-light text-gray-400">
						Hesabın var mı? <button
							class="font-medium text-gitcol-200 hover:underline text-sm ml-1"
							on:click|preventDefault={() => {
								showModal = true;
								registerDialog.close();
							}}>Giriş Yap</button
						>
					</p>
				</form>
			</div>
		</div>
	</div>
</dialog>
