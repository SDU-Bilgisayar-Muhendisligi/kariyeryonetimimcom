import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';
import { userStore } from '@/stores.js';
/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch, cookies }) => {
	let user;
	userStore.subscribe((value) => (user = value));

	const token = cookies.get('token');

	if (!token) {
		window.location.href = '/';
	}

	if (!user.username) {
		window.location.href = '/';
	}
	const response = await fetch(`${env.PUBLIC_API_URL}/message/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${token}`
		}
	});

	if (response) {
		let data = await response.json();
		return { messages: data.messages };
	} else 

	throw error(404, 'Not found');
};
