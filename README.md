# Saed Yousef Personal Site

![Test](https://github.com/saedyousef/saedyousef.com/actions/workflows/test.yml/badge.svg)
![Deploy](https://github.com/saedyousef/saedyousef.com/actions/workflows/compile.yml/badge.svg)
![Update Activity](https://github.com/saedyousef/saedyousef.com/actions/workflows/update-activity.yml/badge.svg)
![Scheduled Deploy](https://github.com/saedyousef/saedyousef.com/actions/workflows/scheduled-deploy.yml/badge.svg)

This repository contains the source code for **saedyousef.com**, a simple static website built with HTML, CSS and TypeScript.  It showcases Saed Yousef's professional experience, fetches GitHub activity, and includes a dark mode toggle.

## Features
- Dark mode toggle
- Typing effect in about section
- Animated timeline for experience
- Data-driven content via JSON files in the `datasets` directory
- GitHub contributions calendar rendered from `datasets/github_activities.json`


## Development

Install dependencies with `npm install` and run `npm run build` to compile the TypeScript sources. Tests can be executed with `npm test`. Once built, open `index.html` in your browser or serve the files using any static HTTP server.

## Deployment

Push updates to the repository's `main` branch or your preferred branch and host the files on any static hosting service (e.g. GitHub Pages). The domain `saedyousef.com` is configured via the `CNAME` file.

## Forking and Customization

1. **Fork** this repository on GitHub.
2. Clone your fork locally and install the dependencies with `npm install`.
3. Edit the JSON files in [`datasets`](datasets/) to replace the sample profile, experience, education and skills with your own data.
4. Update assets like `profile.jpg` or add new images as needed.
5. Run `npm run build` to compile the TypeScript sources and then commit your changes.

The included GitHub Actions workflows will automatically run the tests and deploy the site to GitHub Pages whenever changes are pushed to your `main` branch.
An additional workflow, `update-activity.yml`, periodically queries the GitHub GraphQL API and commits the results to `datasets/github_activities.json` so the site can display your latest contributions.
To enable it on your fork, create a repository secret named `GH_CONTRIBUTION_TOKEN` containing a personal access token with the `read:user` and `public_repo` scopes.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

If you enjoy this website, please consider **starring** the project on GitHub!
