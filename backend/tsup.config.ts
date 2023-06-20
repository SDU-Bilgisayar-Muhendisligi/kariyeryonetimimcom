import { defineConfig } from 'tsup';

export default defineConfig({
    target: 'node18',
    keepNames: true,
    entryPoints: ['./src/**/*.ts'],
    clean: true,
    format: 'cjs',
    splitting: true,
    minify: true,
});