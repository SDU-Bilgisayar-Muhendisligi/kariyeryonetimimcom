/** @type {import('./$types').PageLoad} */
export const load = async ({ parent }) => {
	const { user } = await parent();

	return {
		user: user
	};
};
