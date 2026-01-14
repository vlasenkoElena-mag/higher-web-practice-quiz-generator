import { resolve } from 'path';
import { defineConfig } from 'vite';

const src = resolve(__dirname, 'src');

export default defineConfig({
	base: './',
	resolve: {
		alias: {
			'@': src,
			'@models': resolve(src, 'components/models'),
			'@view': resolve(src, 'components/view'),
			'@presenters': resolve(src, 'components/presenters'),
		}
	},
	server: {
		port: 3001,
		open: true
	},
	build: {
		outDir: resolve(__dirname, 'dist'),
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				quizzes: resolve(__dirname, 'quizzes.html'),
				quiz: resolve(__dirname, 'quiz.html')
			}
		}
	},
	optimizeDeps: {
		include: ['zod', 'idb', 'uuid']
	}
});