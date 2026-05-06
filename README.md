# SaedYousef.com Portfolio

This repository contains Saed Yousef's personal portfolio site. It is a fast static site with a dark-by-default Nitro-inspired UI, a light theme option, JSON-backed content, and a GitHub contribution heatmap.

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
- `datasets/projects.json`: project cards, currently empty to show the coming-soon state
- `datasets/github_activities.json`: local fallback contribution calendar

## Deployment

The `Pages` workflow runs on pushes to `main`, manual dispatch, and every four hours. It refreshes GitHub activity data in the workflow workspace, runs checks, builds with Vite, verifies `dist/CNAME`, and publishes `dist` to the `gh-pages` branch.

The custom domain is `saedyousef.com`.

## Requirements

- Node.js `>=20.19.0`
- npm

## License

MIT
