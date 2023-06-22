export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20')
];

export const server_loads = [0];

export const dictionary = {
		"/": [2],
		"/company": [3],
		"/company/create": [4],
		"/company/[name]": [5],
		"/company/[name]/edit": [6],
		"/event": [7],
		"/event/[name]": [8],
		"/group": [9],
		"/group/create": [10],
		"/group/[name]": [11],
		"/group/[name]/edit": [12],
		"/jobadverts": [13],
		"/jobadverts/create": [14],
		"/jobadverts/my": [~15],
		"/message": [~16],
		"/message/new": [17],
		"/message/[name]": [~18],
		"/profile/[name]": [19],
		"/profile/[name]/edit": [20]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';