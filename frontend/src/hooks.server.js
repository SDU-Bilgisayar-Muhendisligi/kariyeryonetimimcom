import { env } from '$env/dynamic/public';

export const handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');

	if (!token) {
		return await resolve(event);
	} else {
		event.locals.user = await getUser(token);

		return await resolve(event);
	}
};

async function getUser(token) {
	const response = await fetch(`${env.PUBLIC_API_URL}/auth/verify`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			token
		})
	});

	let data = await response.json();

	return {
		user: data.success ? data.user : null
	};
}
