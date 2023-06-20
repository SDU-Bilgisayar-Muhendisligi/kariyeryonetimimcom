import { env } from '$env/dynamic/public';

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch, parent }) => {
	const { user } = await parent();

	const response = await fetch(`${env.PUBLIC_API_URL}/jobadvert/`);

	let posts = [];

	if (response) {
		let data = await response.json();

		await Object.values(data.jobadvertisements).map((user) => {
			Object.values(user.advertisement).map((ads) => {
				posts.push({
					author: ads.author,
					userProfilePicture: ads.userProfilePicture,
					description: ads.description,
					image: ads.image,
					postid: ads.postid
				});
			});
		});

		return { ads: posts.reverse(), user: user };
	}

	return {
		user: user
	};
};
