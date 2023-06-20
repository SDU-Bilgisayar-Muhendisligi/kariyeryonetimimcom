/** @type {import('@sveltejs/kit/types').ServerLoad} */
export const load = async ({ locals }) => {
	return {
		user: locals.user
	};
};
