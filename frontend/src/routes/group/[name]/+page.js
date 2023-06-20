import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export const load = async ({ params, fetch }) => {
	const name = params.name;

	const response = await fetch(`${env.PUBLIC_API_URL}/group/${name}`).then((r) => r.json());

	if (response.success) {
		return { group: response.group };
	}

	throw error(404, 'Not found');
};
