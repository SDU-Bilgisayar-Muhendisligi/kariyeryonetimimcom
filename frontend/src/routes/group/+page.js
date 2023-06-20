import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch }) => {
	const response = await fetch(`${env.PUBLIC_API_URL}/group/`);

	if (response.ok) {
		let data = await response.json();
		
		return { groups: data.groups };
	}

	throw error(404, 'Not found');
};
