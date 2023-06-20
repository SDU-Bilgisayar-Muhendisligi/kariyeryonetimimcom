<script>
	import { userStore } from '@/stores.js';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';

	let profilePicture = 'https://wallpaperaccess.com/full/2472433.jpg';

	let fileInputOpened = false;
	let files = [];

	export let data;

	async function openFileInput() {
		let input = document.getElementById('fileInput');
		input.click();
	}

	let newData = {
		newCompanyname: data.company ? data.company.companyname : '',
		profilePicture: data.company ? `${env.PUBLIC_API_URL}/file/${data.company.profilePicture}` : ''
	};

	onMount(() => {
		if ($userStore.username) {
			const finduser = data.company.users.find(
				(user) => user.username === $userStore.username && user.role
			);

			if (!finduser) {
				goto(`/company/${data.company.companyname}`);
			}
		} else {
			goto(`/profile/${data.company.companyname}`);
		}
	});

	async function editCompany() {
		const formData = new FormData();
		
		if (files.length) {
			formData.append('profilePicture', files[0]);
		}

		formData.append('newCompanyname', newData.newCompanyname);

		let response = await fetch(`${env.PUBLIC_API_URL}/company/${data.company.companyname}`, {
			method: 'PATCH',
			headers: {
				Authorization: `${Cookies.get('token')}`
			},
			body: formData
		});


		if (response.ok) {
			goto(`/company/${newData.newCompanyname}`);
		}
	}

	let newUser = '';

	async function addUser() {
		if (newUser === '') {
			return alert('Kullanıcı adı boş olamaz!');
		}

		let response = await fetch(`${env.PUBLIC_API_URL}/company/${data.company.companyname}/user`, {
			method: 'POST',
			headers: {
				Authorization: `${Cookies.get('token')}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: newUser,
				role: 0
			})
		});

		if (response.ok) {
			goto(`/company/${data.company.companyname}`);
		}
	}

	let exUser = '';

	async function deleteUser() {
		let response = await fetch(`${env.PUBLIC_API_URL}/company/${data.company.companyname}/user`, {
			method: 'DELETE',
			headers: {
				Authorization: `${Cookies.get('token')}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: exUser
			})
		});

		if (response.ok) {
			goto(`/company/${data.company.companyname}`);
		}
	}

	let patchedUser = {
		username: '',
		role: 0
	};

	async function patchUser() {
		if (patchedUser.username === '' || patchUser.role === '') {
			return alert('Kullanıcı adı veya rol boş olamaz!');
		}

		const formData = new FormData();
		formData.append('username', patchedUser.username);
		formData.append('role', patchedUser.role);

		let response = await fetch(`${env.PUBLIC_API_URL}/company/${data.company.companyname}/user`, {
			method: 'PATCH',
			headers: {
				Authorization: `${Cookies.get('token')}`
			},
			body: formData
		});

		if (response.ok) {
			goto(`/company/${data.company.companyname}`);
		}
		if (response.status === 404) {
			alert('Kullanıcı bulunamadı!');
		}
	}
</script>

<main
	class="space-x-5 bg-gitcol-800 rounded-lg border border-gitcol-600 rounded-t-lg p-5 space-y-5"
>
	<div class="flex space-x-5 items-center flex-col">
		<div class="flex space-x-5 items-center">
			<div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="profilepic m-4 cursor-pointer rounded-full" on:click={openFileInput}>
					<img
						class="profilepic__image h-56 w-56"
						src={files.length > 0 ? URL.createObjectURL(files[0]) : newData.profilePicture}
						alt="Profibild"
					/>
					<div class="profilepic__content">
						<span class="profilepic__icon"><i class="fas fa-camera" /></span>
						<span class="profilepic__text">Edit Company</span>
					</div>
				</div>
				<input
					type="file"
					name="galery"
					class="hidden"
					id="fileInput"
					on:change={(e) => {
						files = [...e.target.files];
					}}
				/>
			</div>

			<div class="w-96">
				<div class="w-full max-w-lg">
					<div class="flex flex-wrap -mx-3 mb-6">
						<div class="w-full px-3 mb-6 md:mb-0">
							<label
								class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
								for="grid-first-name"
							>
								şirket ismi
							</label>
							<input
								type="text"
								bind:value={newData.newCompanyname}
								name="companyname"
								placeholder={data.company.companyname}
								class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
								required=""
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<button
			class="bg-gitcol-600 text-white font-semibold w-1/2 py-2 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-gitcol-500 mt-4"
			on:click={() => editCompany()}>Kaydet</button
		>
	</div>
	<div class="">
		<div class="flex space-x-5 items-center">
			<div class="w-96">
				<div class="w-full max-w-lg">
					<div class="flex flex-wrap -mx-3 mb-6">
						<div class="w-full px-3 mb-6 md:mb-0">
							<label
								class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
								for="grid-first-name"
							>
								Kullanıcı Ekle
							</label>
							<input
								type="text"
								name="companyname"
								bind:value={newUser}
								placeholder="linustorvalds"
								class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
								required=""
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<button
			class="bg-gitcol-600 text-white font-semibold w-1/2 py-2 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-gitcol-500 mt-4"
			on:click={() => addUser()}>Ekle</button
		>
	</div>
	<div class="">
		<div class="flex space-x-5 items-center">
			<div class="w-96">
				<div class="w-full max-w-lg">
					<div class="flex flex-wrap -mx-3 mb-6">
						<div class="w-full px-3 mb-6 md:mb-0">
							<label
								class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
								for="grid-first-name"
							>
								Kullanıcı Çıkart
							</label>
							<input
								type="text"
								name="companyname"
								bind:value={exUser}
								placeholder="linustorvalds"
								class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
								required=""
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<button
			class="bg-gitcol-600 text-white font-semibold w-1/2 py-2 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-gitcol-500 mt-4"
			on:click={() => deleteUser()}>Çıkart</button
		>
	</div>
	<div class="">
		<div class="flex space-x-5 items-center">
			<div class="w-96">
				<div class="w-full max-w-lg">
					<div class="flex flex-wrap -mx-3 mb-6">
						<div class="w-full px-3 mb-6 md:mb-0">
							<label
								class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
								for="grid-first-name"
							>
								Kullanıcı Rolü Düzenle
							</label>
							<input
								type="text"
								name="companyname"
								bind:value={patchedUser.username}
								placeholder="linustorvalds"
								class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
								required=""
							/>
							<input
								type="text"
								name="companyname"
								bind:value={patchedUser.role}
								placeholder="0 veya 1 (1: admin, 0: user)"
								class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
								required=""
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<button
			class="bg-gitcol-600 text-white font-semibold w-1/2 py-2 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-gitcol-500 mt-4"
			on:click={() => patchUser()}>Düzenle</button
		>
	</div>
</main>

<style>
	.profilepic {
		position: relative;
		width: 14rem;
		height: 14rem;
		border-radius: 50%;
		overflow: hidden;
		background-color: #111;
	}

	.profilepic:hover .profilepic__content {
		opacity: 1;
	}

	.profilepic:hover .profilepic__image {
		opacity: 0.5;
	}

	.profilepic__image {
		object-fit: cover;
		opacity: 1;
		transition: opacity 0.2s ease-in-out;
	}

	.profilepic__content {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: white;
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
	}

	.profilepic__icon {
		color: white;
		padding-bottom: 8px;
	}

	.fas {
		font-size: 20px;
	}

	.profilepic__text {
		text-transform: uppercase;
		font-size: 12px;
		width: 50%;
		text-align: center;
	}
</style>
