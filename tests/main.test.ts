import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    loadAllData,
    renderGitHubActivities,
    renderPortfolio,
    updateHeroSection,
    updateSocialLinks
} from '../ts/main';
import educationJson from '../datasets/education.json';
import experiencesJson from '../datasets/experiences.json';
import githubActivitiesJson from '../datasets/github_activities.json';
import profileJson from '../datasets/profile.json';
import projectsJson from '../datasets/projects.json';
import siteJson from '../datasets/site.json';
import skillsJson from '../datasets/skills.json';

const datasets: Record<string, unknown> = {
    'datasets/site.json': siteJson,
    'datasets/profile.json': profileJson,
    'datasets/experiences.json': experiencesJson,
    'datasets/education.json': educationJson,
    'datasets/skills.json': skillsJson,
    'datasets/projects.json': projectsJson,
    'datasets/github_activities.json': githubActivitiesJson
};

function mockFetch(): void {
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        const key = Object.keys(datasets).find(datasetPath => url.includes(datasetPath));

        if (!key) {
            return Promise.resolve({
                ok: false,
                status: 404,
                json: async () => ({})
            } as Response);
        }

        return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => datasets[key]
        } as Response);
    }));
}

function mountPortfolioDom(): void {
    document.body.innerHTML = `
        <a id="site-brand"></a>
        <nav id="site-nav"></nav>
        <button id="theme-toggle" type="button">
            <span id="theme-toggle-icon"></span>
            <span id="theme-toggle-label"></span>
        </button>
        <button id="effects-toggle" type="button">
            <span id="effects-toggle-icon"></span>
            <span id="effects-toggle-label"></span>
        </button>
        <aside id="social-links-left"></aside>
        <aside id="social-links-right"></aside>
        <main>
            <p id="hero-greeting"></p>
            <h1 id="hero-name"></h1>
            <p id="hero-subtitle"></p>
            <p id="hero-description"></p>
            <div id="hero-actions"></div>
            <div id="hero-meta"></div>
            <div id="about-header"></div>
            <div id="about-content"></div>
            <p id="tech-intro"></p>
            <ul id="tech-list"></ul>
            <div id="experience-header"></div>
            <div id="experience-container"></div>
            <div id="education-header"></div>
            <div id="education-container"></div>
            <div id="skills-header"></div>
            <div id="skills-container"></div>
            <div id="projects-header"></div>
            <div id="projects-container"></div>
            <div id="github-header"></div>
            <div id="github-activities-container"></div>
            <p id="contact-eyebrow"></p>
            <h2 id="contact-title"></h2>
            <p id="contact-body"></p>
            <div id="contact-actions"></div>
        </main>
        <footer>
            <p id="footer-text"></p>
            <div id="social-links-mobile"></div>
        </footer>
    `;
}

describe('portfolio datasets', () => {
    it('keeps the correct canonical domain without visible version branding', () => {
        expect(siteJson.canonicalDomain).toBe('saedyousef.com');
        expect(JSON.stringify(siteJson).toLowerCase()).not.toMatch(/portfolio v\d|\bv\d\b/);
        expect(JSON.stringify(siteJson).toLowerCase()).not.toMatch(/technical\s+resume/);
    });

    it('contains the required profile contact URLs', () => {
        expect(profileJson.name).toBeTruthy();
        expect(profileJson.title).toBeTruthy();
        expect(profileJson.contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        expect(profileJson.contact.github).toMatch(/^https:\/\//);
        expect(profileJson.contact.linkedin).toMatch(/^https:\/\//);
        expect(profileJson.contact.website).toBe('https://saedyousef.com');
    });

    it('has structured resume sections', () => {
        expect(experiencesJson.length).toBeGreaterThan(0);
        expect(educationJson.length).toBeGreaterThan(0);
        expect(Object.keys(skillsJson.skills).length).toBeGreaterThan(0);
        expect(projectsJson).toHaveLength(0);
        expect(skillsJson.skills['Development Tools & Frameworks']).toContain('PHP');
        expect(skillsJson.skills['Development Tools & Frameworks']).toContain('TypeScript');
        expect(skillsJson.skills['Development Tools & Frameworks']).toContain('Nuxt');
        expect(skillsJson.skills['Development Tools & Frameworks']).toContain('Go');
        expect(skillsJson.skills['Development Tools & Frameworks']).not.toContain('CakePHP');
        expect(skillsJson.skills['Development Tools & Frameworks'].join(' ')).not.toContain('Lumen');
    });

    it('has a valid GitHub contribution calendar fallback', () => {
        expect(typeof githubActivitiesJson.totalContributions).toBe('number');
        expect(githubActivitiesJson.weeks.length).toBeGreaterThan(0);
        githubActivitiesJson.weeks.forEach(week => {
            expect(typeof week.firstDay).toBe('string');
            expect(week.contributionDays.length).toBeGreaterThan(0);
        });
    });
});

describe('portfolio renderer', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        mockFetch();
        mountPortfolioDom();
    });

    it('loads all JSON datasets', async () => {
        await loadAllData();

        Object.keys(datasets).forEach(datasetPath => {
            expect(fetch).toHaveBeenCalledWith(datasetPath);
        });
    });

    it('renders the complete portfolio from datasets', async () => {
        await loadAllData();
        renderPortfolio();

        expect(document.title).toContain(profileJson.name);
        expect(document.getElementById('site-nav')?.querySelectorAll('a')).toHaveLength(siteJson.navigation.length);
        expect(document.getElementById('site-nav')?.textContent).not.toMatch(/\d{2}\./);
        expect(document.getElementById('hero-name')?.textContent).toBe(profileJson.name);
        expect(document.getElementById('hero-subtitle')?.textContent).toBe(profileJson.subtitle);
        expect(document.getElementById('hero-meta')?.textContent).not.toContain('version');
        expect(document.getElementById('hero-meta')?.textContent).toContain('9+ years');
        expect(document.getElementById('about-content')?.querySelectorAll('p')).toHaveLength(profileJson.about.length);
        expect(document.getElementById('experience-container')?.querySelectorAll('article')).toHaveLength(experiencesJson.length);
        expect(document.getElementById('education-container')?.querySelectorAll('article')).toHaveLength(educationJson.length);
        expect(document.getElementById('skills-container')?.querySelectorAll('article')).toHaveLength(Object.keys(skillsJson.skills).length);
        expect(document.getElementById('projects-container')?.querySelectorAll('article')).toHaveLength(1);
        expect(document.getElementById('projects-container')?.textContent).toContain('Coming soon..');
        expect(document.getElementById('contact-title')?.textContent).toBe(siteJson.contact.title);
        expect(document.getElementById('theme-toggle')).not.toBeNull();
        expect(document.getElementById('effects-toggle')).not.toBeNull();
        expect(document.getElementById('effects-toggle-label')?.textContent).toBe('Effects Off');
        expect(document.body.textContent?.toLowerCase()).not.toMatch(/portfolio v\d|\bv\d\b/);
        expect(document.body.textContent?.toLowerCase()).not.toMatch(/technical\s+resume/);
        expect(document.getElementById('footer-text')?.textContent).toContain('First version');
    });

    it('renders hero actions and social links with profile URLs', async () => {
        await loadAllData();
        updateHeroSection();
        updateSocialLinks();

        const heroLinks = document.getElementById('hero-actions')?.querySelectorAll('a');
        expect(heroLinks?.length).toBe(siteJson.hero.actions.length);

        const socialHtml = document.getElementById('social-links-left')?.innerHTML || '';
        expect(socialHtml).toContain(profileJson.contact.github);
        expect(socialHtml).toContain(profileJson.contact.linkedin);
        expect(socialHtml).toContain(`mailto:${profileJson.contact.email}`);
    });

    it('renders GitHub calendar cells from the activity dataset', async () => {
        await loadAllData();
        renderGitHubActivities();

        const expectedDayCount = githubActivitiesJson.weeks.reduce((sum, week) => sum + week.contributionDays.length, 0);
        expect(document.querySelector('[data-role="github-calendar-grid"]')).not.toBeNull();
        expect(document.querySelectorAll('[data-activity-day]')).toHaveLength(expectedDayCount);
        expect(document.getElementById('github-activities-container')?.textContent).toContain(
            githubActivitiesJson.totalContributions.toLocaleString()
        );
    });

    it('handles missing optional containers without throwing', async () => {
        await loadAllData();
        document.body.innerHTML = '';

        expect(() => renderPortfolio()).not.toThrow();
    });
});
