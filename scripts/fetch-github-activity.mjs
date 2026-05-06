import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const outputPath = resolve(rootDir, 'datasets/github_activities.json');
const token = process.env.GH_CONTRIBUTION_TOKEN || process.env.GITHUB_TOKEN;
const login = process.env.GITHUB_LOGIN || 'saedyousef';

if (!token) {
    throw new Error('GH_CONTRIBUTION_TOKEN or GITHUB_TOKEN is required to refresh GitHub activity.');
}

const query = `
query ContributionCalendar($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          firstDay
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}
`;

const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'saedyousef-portfolio'
    },
    body: JSON.stringify({
        query,
        variables: { login }
    })
});

if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed with HTTP ${response.status}.`);
}

const payload = await response.json();

if (payload.errors?.length) {
    throw new Error(`GitHub GraphQL returned errors: ${JSON.stringify(payload.errors)}`);
}

const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;

if (!calendar || typeof calendar.totalContributions !== 'number' || !Array.isArray(calendar.weeks)) {
    throw new Error('GitHub contribution calendar response did not match the expected shape.');
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(calendar, null, 2)}\n`, 'utf8');
console.log(`Updated ${outputPath} for ${login}.`);
