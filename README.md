# SaedYousef.com Portfolio

This repository contains Saed Yousef's personal portfolio site. It is a fast static site with an exe.dev-inspired minimal UI, system light/dark color scheme, JSON-backed content, and a GitHub contribution heatmap.

## Local Development

Install dependencies:

```bash
npm ci
```

Start the Vite dev server:

```bash
npm run dev
```

Open `http://localhost:8096`.

Preview the production build locally:

```bash
npm run build
npm run preview
```

Open `http://localhost:8096`.

## Quality Checks

```bash
npm run lint
npm test
npm run typecheck
npm run build
```

## Data Files

- `datasets/profile.json`: name, title, about copy, and contact URLs
- `datasets/site.json`: navigation, section labels, CTAs, social links, and contact copy
- `datasets/experiences.json`: experience timeline
- `datasets/education.json`: education cards
- `datasets/skills.json`: grouped skills and technologies
- `datasets/projects.json`: selected project cards and links
- `datasets/github_activities.json`: local fallback contribution calendar

The current root site is v2. The v1 static snapshot is preserved in `v1/` and should not be edited.

## Deployment

The `Pages` workflow runs on pushes to `main`, manual dispatch, and every four hours. It refreshes GitHub activity data in the workflow workspace, runs checks, builds with Vite, verifies `dist/CNAME`, and publishes `dist` to the `gh-pages` branch.

The custom domain is `saedyousef.com`.

The root URL, `https://saedyousef.com`, always serves the latest build.

## Versioned Snapshots

Historical releases are stored as complete static snapshots in version folders such as `v1`, `v2`, and `v3`. The deployed site exposes them as `https://saedyousef.com/v1/`, `https://saedyousef.com/v2/`, and so on.

To create a new version from GitHub Actions:

1. Open the `Pages` workflow in GitHub Actions.
2. Choose `Run workflow` from the `main` branch.
3. Enter the next version folder name, for example `v2`, in the `version` input.
4. Run the workflow.

The workflow builds the current site, copies the generated `dist` output into the requested version folder, commits that folder back to the repository, and deploys the latest root site plus all committed version folders to `gh-pages`.

Version folders are intended to be immutable. If `v2` already exists, create `v3` instead of editing or replacing `v2`.

To create a snapshot locally:

```bash
npm run build
npm run snapshot -- v2
```

Commit the generated `v2` folder with the source changes that introduce that release.

## Path Compatibility

The Vite build uses a relative base path so generated assets are referenced as `./assets/...` instead of `/assets/...`. Source HTML, CSS font URLs, and static data fetches also use relative paths. This allows the same build output to work from both `https://saedyousef.com/` and `https://saedyousef.com/v1/` without a backend or server rewrites.

Avoid root-absolute paths in website code, including `/assets/app.js`, `/assets/style.css`, `/datasets/site.json`, and `/ts/main.ts`. Use relative paths instead.

## Version Subdomains

GitHub Pages serves version folders by path, not by subdomain. Cloudflare DNS alone cannot map `v1.saedyousef.com` directly to the `/v1` folder.

Use one of these Cloudflare options if version subdomains are needed later:

1. Redirect rule: redirect `https://v1.saedyousef.com/*` to `https://saedyousef.com/v1/*`. This is simplest and keeps GitHub Pages unchanged.
2. Worker route: proxy `v1.saedyousef.com/*` to `https://saedyousef.com/v1/*` while preserving the subdomain in the browser. Repeat the route logic for `v2`, `v3`, and later versions.

## Requirements

- Node.js `>=20.19.0`
- npm

## License

MIT
