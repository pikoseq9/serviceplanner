import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Use vitePreprocess to automatically handle SCSS (requires 'sass' package)
  preprocess: vitePreprocess(), 
  kit: {
    adapter: adapter()
  }
};

export default config;