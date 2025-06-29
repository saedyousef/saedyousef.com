const { execSync } = require('child_process');
const fs = require('fs');

try {
    const html = execSync('curl -L https://github.com/users/saedyousef/contributions', { encoding: 'utf8' });
    fs.writeFileSync('github_activites.json', JSON.stringify({ html }));
    console.log('Updated github_activites.json');
} catch (err) {
    console.error('Failed to fetch activity', err);
    process.exit(1);
}
