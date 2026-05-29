import { existsSync } from 'node:fs';
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(rootDir, 'dist');
const version = process.argv[2]?.trim();

function fail(message) {
    console.error(message);
    process.exit(1);
}

if (!version || !/^v[1-9]\d*$/.test(version)) {
    fail('Usage: npm run snapshot -- v1');
}

if (!existsSync(resolve(distDir, 'index.html'))) {
    fail('Missing dist/index.html. Run npm run build before creating a snapshot.');
}

const snapshotDir = resolve(rootDir, version);
const deploySnapshotDir = resolve(distDir, version);

if (existsSync(snapshotDir)) {
    fail(`${version} already exists. Version snapshots are immutable; choose the next version.`);
}

function shouldSkipRootEntry(name) {
    return name === 'CNAME' || name === '.nojekyll' || /^v\d+$/.test(name);
}

async function copySnapshotContents(sourceDir, destinationDir) {
    const entries = await readdir(sourceDir, { withFileTypes: true });

    await Promise.all(entries.map(async entry => {
        if (sourceDir === distDir && shouldSkipRootEntry(entry.name)) {
            return;
        }

        const source = join(sourceDir, entry.name);
        const destination = join(destinationDir, entry.name);

        if (entry.isDirectory()) {
            await mkdir(destination, { recursive: true });
            await copySnapshotContents(source, destination);
            return;
        }

        await cp(source, destination, { recursive: true });
    }));
}

try {
    await mkdir(snapshotDir, { recursive: false });
    await copySnapshotContents(distDir, snapshotDir);
    await rm(deploySnapshotDir, { recursive: true, force: true });
    await cp(snapshotDir, deploySnapshotDir, { recursive: true });
    console.log(`Created ${version} from dist.`);
} catch (error) {
    await rm(snapshotDir, { recursive: true, force: true });
    throw error;
}
