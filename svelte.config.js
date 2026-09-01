import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

import { mdsvex } from 'mdsvex'

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html', // Required for client-side routing on reload
			precompress: false,
			strict: true
		}),
		paths: {
			// If deploying via GitHub Actions, it sets GITHUB_REPOSITORY (e.g., 'user/repo')
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH || '/photos'
		}
	}
}

export default config;
