import { userStore } from '@/stores.js';
/** @type {import('@sveltejs/kit/types').PageLoad} */
export const load = async function ({ data }) {
	if (data.user) {
		userStore.set(data.user.user);


		return {
			user: data.user.user
		};
	} else {
		return {
			user: false
		};
	}
};
