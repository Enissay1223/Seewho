// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://enissay1223.github.io',
	base: '/Seewho',
	integrations: [
		sitemap({
			filter: (page) => !page.endsWith('/impressum/') && !page.endsWith('/datenschutz/'),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
