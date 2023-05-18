export const handle = async ({ event, resolve }) => {

	event.locals.user = await getUser();

	return await resolve(event);
};

async function getUser() {
	return {
		username: 'linustorvalds',
		name: 'Linus Torvalds',
		email: 'dontshawtyisthebirtday@gmail.com',
		job: 'Software Developer',
		biography: 'Hello i am Linus! I am fullstack developer',
		profilePicture:
			'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80',
		banner:
			'https://img.freepik.com/free-photo/blossom-floral-bouquet-decoration-colorful-beautiful-flowers-background-garden-flowers-plant-pattern-wallpapers-greeting-cards-postcards-design-wedding-invites_90220-1103.jpg'
	};
}
