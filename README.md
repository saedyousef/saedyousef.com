# SaedYousef.com Portfolio

This repository contains the source code for Saed Yousef's personal portfolio site. The site showcases experience, education, skills, and GitHub activity with a polished, animated presentation.

## Key Features

- Self hosted Inter typography and Font Awesome icons (no external CDNs)
- Responsive hero, experience, education, skills, and contact sections powered by Tailwind CSS
- Animated scroll interactions driven by GSAP and ScrollTrigger
- GitHub contribution heatmap rendered from `datasets/github_activities.json`
- TypeScript data loading layer with Jest tests for content validation
- Automated CI pipeline: Tests -> Compile -> Deploy to GitHub Pages

## Tech Stack

- TypeScript + Vite style module structure (no framework)
- Tailwind CSS with PostCSS build pipeline
- GSAP and Three.js for animations and 3D background effects
- Jest with jsdom environment for unit and integration tests

## Project Structure

```
├─ index.html               # Main page template referencing dist assets
├─ ts/                      # TypeScript source files
├─ css/                     # Tailwind input CSS and custom styles
├─ dist/                    # Compiled JS and CSS outputs
├─ datasets/                # JSON data powering site content
├─ tests/                   # Jest test suite
├─ assets/                  # Fonts, icons, and supporting assets
└─ .github/workflows/       # CI pipelines (Test, Compile, Deploy)
```

## Getting Started

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Build TypeScript and CSS:
   ```bash
   npm run build
   ```
   Outputs are written to `dist/`.
3. Run the development server (simple static server):
   ```bash
   npm run serve
   ```
   Visit `http://localhost:8096` in the browser.

## Test Suite

Run all Jest tests:
```bash
npm test
```
Additional scripts:
- `npm run test:watch` for interactive watch mode
- `npm run test:coverage` for coverage reporting

## Continuous Integration

GitHub Actions workflows automate quality gates and deployments:
- `Test` runs on pushes and pull requests against `main`.
- `Compile` runs only after a successful `Test` workflow on the `main` branch. It builds the project and uploads the site bundle as an artifact.
- `Deploy` triggers after a successful `Compile`, downloading the artifact and publishing it to the `gh-pages` branch.

## Deployment

The site is deployed via GitHub Pages from the compiled artifact produced by the CI pipeline. Manual deployment can be replicated locally by running `npm run build` and publishing the resulting static files in `dist/`, along with `index.html`, `assets/`, `css/`, and `datasets/`.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
