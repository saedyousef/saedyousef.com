import { existsSync } from 'node:fs';
import { cp, copyFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const rootDir = dirname(fileURLToPath(import.meta.url));

function copyStaticSiteFiles(): Plugin {
    const entries = ['assets/icons', 'datasets', 'CNAME'];

    return {
        name: 'copy-static-site-files',
        apply: 'build',
        async closeBundle() {
            const outDir = resolve(rootDir, 'dist');
            const versionEntries = (await readdir(rootDir, { withFileTypes: true }))
                .filter(entry => entry.isDirectory() && /^v\d+$/.test(entry.name))
                .map(entry => entry.name);

            await Promise.all([...entries, ...versionEntries].map(async entry => {
                const source = resolve(rootDir, entry);
                const destination = resolve(outDir, entry);

                if (!existsSync(source)) {
                    return;
                }

                if (entry.includes('.')) {
                    await mkdir(dirname(destination), { recursive: true });
                    await copyFile(source, destination);
                    return;
                }

                await cp(source, destination, { recursive: true });
            }));
        }
    };
}

export default defineConfig({
    base: './',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false
    },
    plugins: [copyStaticSiteFiles()]
});
