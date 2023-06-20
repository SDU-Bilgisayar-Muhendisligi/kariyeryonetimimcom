import { env } from '$env/dynamic/public';

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch, parent }) => {
	const { user } = await parent();

	const response = await fetch(`${env.PUBLIC_API_URL}/company/`);

	let posts = [];

	if (response.ok) {
		let data = await response.json();

		await data.companies.map((company) => {
			Object.values(company.contents).map((post) => {
				posts.push({
					publisher: {
						username: company.username,
						profilePicture: company.profilePicture,
						users: company.users
					},
					description: post.description,
					image: post.image,
					author: post.author,
					postID: Object.keys(company.contents).find((key) => company.contents[key] === post)
				});
			});
		});


		return { posts: posts, companies: data.companies, user: user };
	}

	return {
		user: user
	};
};
