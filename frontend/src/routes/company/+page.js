import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch }) => {
	const response = await fetch(`${env.PUBLIC_API_URL}/company/`);

	if (response.ok) {
        let data = await response.json();
       
		return { companies: data.companies };
	}

	throw error(404, 'Not found');
};
