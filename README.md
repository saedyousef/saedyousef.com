# Saed Yousef Personal Site

![Test](https://github.com/saedyousef/saedyousef.com/actions/workflows/test.yml/badge.svg)
![Deploy](https://github.com/saedyousef/saedyousef.com/actions/workflows/compile.yml/badge.svg)
![Update Activity](https://github.com/saedyousef/saedyousef.com/actions/workflows/update-activity.yml/badge.svg)
![Scheduled Deploy](https://github.com/saedyousef/saedyousef.com/actions/workflows/scheduled-deploy.yml/badge.svg)

This repository contains the source code for **saedyousef.com**, a static portfolio site built with HTML, CSS and TypeScript. The page loads its content from JSON files, displays a GitHub contribution calendar and supports light and dark themes.

## How It Works

- All content is stored in files under [`datasets/`](datasets/). This includes the profile, experience, education, skills and the site theme.
- The TypeScript files in [`ts/`](ts/) read these JSON files at runtime and populate the page. After compiling, the JavaScript output is placed in `dist/` and referenced from `index.html`.
- A GitHub Actions workflow (`update-activity.yml`) periodically queries the GitHub GraphQL API and commits `datasets/github_activities.json` so that your contribution graph stays up to date.
- Additional workflows run the test suite (`test.yml`) and deploy the site to the `gh-pages` branch (`compile.yml` and `scheduled-deploy.yml`).

### Theme Configuration

The file [`datasets/theme.json`](datasets/theme.json) controls the visual appearance. You can change the accent color, light and dark backgrounds, text colors and the footer background. The `profilePhoto` field lets you specify an image displayed in the header.

```json
{
  "profilePhoto": "profile.jpg",
  "colors": {
    "accent": "#4f46e5",
    "backgroundLight": "#ffffff",
    "backgroundDark": "#121212",
    "textLight": "#1f1f1f",
    "textDark": "#e0e0e0",
    "footerBg": "#222222"
  }
}
```

## Local Development

1. **Install Node.js** – version 20 or newer is recommended.
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Compile the TypeScript sources**
   ```bash
   npm run build
   ```
   The compiled JavaScript files will appear in `dist/`.
4. *(Optional)* **Run the tests**
   ```bash
   npm test
   ```
5. **Preview the site** – open `index.html` in your browser or run a static server such as:
   ```bash
   npx http-server
   ```
   and visit `http://localhost:8080`.

## Forking and Customization

1. Fork this repository on GitHub and clone your fork locally.
2. Edit the JSON files in [`datasets/`](datasets/) to replace the sample profile, experience, education and skills with your own data.
3. Tweak [`datasets/theme.json`](datasets/theme.json) to customize colors or change the profile photo.
4. Replace assets such as `profile.jpg` or add new images as desired.
5. Run `npm run build` and commit your changes.
6. Create a repository secret named `GH_CONTRIBUTION_TOKEN` with a personal access token containing the `read:user` and `public_repo` scopes if you want the activity updater workflow to function.

## Hosting on GitHub Pages

The workflows in `.github/workflows/` automatically build the site and push the result to the `gh-pages` branch. To host your fork:

1. Enable GitHub Actions on your repository.
2. Go to **Settings → Pages** and choose the **gh-pages** branch as the source.
3. After the `Compile & Deploy` workflow runs, your site will be available at `https://<your-username>.github.io/<repository>/`.

If you use a custom domain, create a `CNAME` file with the domain name and configure your DNS accordingly.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

If you enjoy this website, please consider starring the project on GitHub!
