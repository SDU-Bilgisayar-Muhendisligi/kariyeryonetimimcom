import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export const load = async ({ params, fetch }) => {
	const userid = params.name;

	const response = await fetch(`${env.PUBLIC_API_URL}/user/${userid}`).then((r) => r.json());

	if (response.success) {
		return { user: response.user };
	}

	throw error(404, 'Not found');
};
