const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

async function copyDirectory(src, dest) {
    try {
        await fsp.rm(dest, { recursive: true, force: true });
        await fsp.mkdir(path.dirname(dest), { recursive: true });
        await fsp.cp(src, dest, { recursive: true });
    } catch (error) {
        console.error(`Failed to copy ${src} to ${dest}:`, error);
        throw error;
    }
}

async function main() {
    const projectRoot = process.cwd();
    const mappings = [
        {
            from: path.join(projectRoot, 'node_modules', 'gsap'),
            to: path.join(projectRoot, 'dist', 'vendor', 'gsap')
        },
        {
            from: path.join(projectRoot, 'node_modules', 'three', 'build'),
            to: path.join(projectRoot, 'dist', 'vendor', 'three', 'build')
        }
    ];

    for (const { from, to } of mappings) {
        if (!fs.existsSync(from)) {
            throw new Error(`Source path does not exist: ${from}`);
        }
        await copyDirectory(from, to);
        console.log(`Copied ${from} -> ${to}`);
    }
}

main().catch(error => {
    console.error('Vendor copy failed:', error);
    process.exit(1);
});
