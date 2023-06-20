import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';
/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch, cookies }) => {
	const token = cookies.get('token');

	const response = await fetch(`${env.PUBLIC_API_URL}/jobadvert/my`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${token}`
		}
	});

	if (response) {
		let data = await response.json();
		if (data.jobadvertisements === undefined || data.jobadvertisements < 1) {
			return { jobadverts: [] };
		}

		return { jobadverts: Object.values(data.jobadvertisements) };
	} else {
		throw error(404, 'Not found');
	}
};
