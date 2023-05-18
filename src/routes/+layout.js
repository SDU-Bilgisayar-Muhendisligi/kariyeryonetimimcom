import { userStore } from '@/stores.js';

/** @type {import('@sveltejs/kit/types').PageLoad} */
export const load = async function ({ data }) {
	if (data.user) {
		userStore.set(data.user);
		return {
			user: data.user
		};
	} else {
		return {
			user: false
		};
	}
};
