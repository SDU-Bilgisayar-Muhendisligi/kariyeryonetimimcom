<script>
	let profilePicture =
		'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80';
</script>

<main class="space-x-5 bg-gitcol-800 rounded-lg border border-gitcol-600 rounded-t-lg p-5">
	<div class="flex space-x-5 items-center">
		<div>
			<div class="profilepic m-4">
				<img class="profilepic__image h-56 w-56" src={profilePicture} alt="Profibild" />
				<div class="profilepic__content">
					<span class="profilepic__icon"><i class="fas fa-camera" /></span>
					<span class="profilepic__text">Edit Profile</span>
				</div>
			</div>
		</div>
		<div class="">
			<div class="w-full max-w-lg">
				<div class="flex flex-wrap -mx-3 mb-6">
					<div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
						<label
							class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
							for="grid-first-name"
						>
							İsim
						</label>
						<input
							type="password"
							name="password"
							placeholder="Bill"
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
							required=""
						/>
					</div>
					<div class="w-full md:w-1/2 px-3">
						<label
							class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
							for="grid-last-name"
						>
							Soyisim
						</label>
						<input
							type="password"
							name="password"
							placeholder="Gates"
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
							required=""
						/>
					</div>
				</div>
				<div class="w-full">
					<div class="w-full">
						<label
							class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
							for="grid-last-name"
						>
							Email
						</label>
						<input
							type="password"
							name="password"
							placeholder="linustorvalds@linux.sh"
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
							required=""
						/>
					</div>
					<div class="w-full mt-2">
						<label
							class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
							for="grid-last-name"
						>
							Biyografi
						</label>
						<textarea
							type="password"
							name="password"
							placeholder="lorem ipsum dolar sit amet"
							class="border border-gitcol-600 sm:text-sm rounded-lg focus:ring-gitcol-600 outline-none focus:ring-1 focus:border-gitcol-600 block w-full p-2.5 bg-[#1A1D21] placeholder-gray-400 text-white mt-2"
							required=""
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
	<button
		class="
        bg-gitcol-600
        text-white
        font-semibold
        w-1/2
        py-2
        rounded-lg
        focus:ring-2
        focus:ring-offset-2
        focus:ring-gitcol-500
        mt-4
    
    ">Kaydet</button
	>
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
