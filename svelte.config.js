import adapter from '@sveltejs/adapter-static';
import autoprefixer from 'autoprefixer';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: {
			plugins: [autoprefixer()],
		},
	}),

	kit: {
		adapter: adapter(),
		alias: {
			$styles: "src/styles",
		},
	},
};

export default config;
