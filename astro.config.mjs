// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const isVercel = process.env.VERCEL === '1';
const site = isVercel && process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: 'https://enissay1223.github.io';

// https://astro.build/config
export default defineConfig({
	site,
	base: isVercel ? '/' : '/Seewho',
	integrations: [
		sitemap({
			filter: (page) => !page.endsWith('/impressum/') && !page.endsWith('/datenschutz/'),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
