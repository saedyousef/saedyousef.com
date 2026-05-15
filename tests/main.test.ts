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
        <a class="site-brand"></a>
        <nav class="site-nav"></nav>
        <button class="theme-toggle" type="button">
            <span class="site-theme-toggle-icon"></span>
            <span class="theme-toggle-label"></span>
        </button>
        <button class="effects-toggle" type="button">
            <span class="effects-toggle-icon"></span>
            <span class="effects-toggle-label"></span>
        </button>
        <button class="menu-toggle" type="button" aria-expanded="false"></button>
        <main>
            <section class="hero-section home-section">
                <div class="hero-copy">
                    <p class="eyebrow"></p>
                    <h1 class="hero-title"></h1>
                    <p class="hero-subtitle"></p>
                    <p class="hero-description"></p>
                    <div class="hero-actions"></div>
                </div>
                <div class="terminal-body"></div>
            </section>
            <section class="about-section">
                <div class="section-heading"></div>
                <div class="about-card">
                    <div class="prose-copy"></div>
                    <div class="tech-snapshot">
                        <p class="tech-intro"></p>
                        <ul class="tech-list"></ul>
                    </div>
                </div>
            </section>
            <section class="experience-section">
                <div class="section-heading"></div>
                <div class="timeline"></div>
            </section>
            <section class="education-section">
                <div class="section-heading"></div>
                <div class="card-grid"></div>
            </section>
            <section class="skills-section">
                <div class="section-heading"></div>
                <div class="skills-grid"></div>
            </section>
            <section class="projects-section">
                <div class="section-heading"></div>
                <div class="project-grid"></div>
            </section>
            <section class="github-section">
                <div class="section-heading"></div>
                <div class="github-card"></div>
            </section>
            <section class="contact-section">
                <p class="contact-eyebrow"></p>
                <h2 class="contact-title"></h2>
                <p class="contact-body"></p>
                <div class="contact-actions"></div>
            </section>
        </main>
        <footer>
            <div class="mobile-social"></div>
        </footer>
        <button class="scroll-top-button" type="button"></button>
    `;
}

function select<T extends Element = HTMLElement>(selector: string): T | null {
    return document.querySelector<T>(selector);
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
        expect(experiencesJson).toEqual(expect.arrayContaining([
            expect.objectContaining({ company: 'Awardit DACH', end: 'Present' }),
            expect.objectContaining({ company: 'Jordan Offers', position: 'Technical Director', url: 'https://jordanoffers.net' }),
            expect.objectContaining({ company: 'Joshops', position: 'Software Architect', url: 'https://joshops.com' })
        ]));
        expect(educationJson.length).toBeGreaterThan(0);
        expect(Object.keys(skillsJson.skills).length).toBeGreaterThan(0);
        expect(projectsJson.length).toBeGreaterThan(0);
        expect(projectsJson[0].title).toBe('PHP n8n Client');
        expect(projectsJson[0].links?.map(link => link.href)).toContain('https://php-n8n.com');
        expect(projectsJson).toEqual(expect.arrayContaining([
            expect.objectContaining({ title: 'SaedYousef.com Portfolio', status: 'Live · saedyousef.com' })
        ]));
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
        expect(select('.site-nav')?.querySelectorAll('a')).toHaveLength(siteJson.navigation.length);
        expect(select('.site-nav')?.textContent).not.toMatch(/\d{2}\./);
        expect(select('.hero-title')?.textContent).toBe(profileJson.name);
        expect(select('.hero-subtitle')?.textContent).toBe(profileJson.subtitle);
        expect(select('.terminal-body')?.textContent).not.toContain('version');
        expect(select('.terminal-body')?.textContent).toContain('9+ years');
        expect(select('.about-card .prose-copy')?.querySelectorAll('p')).toHaveLength(profileJson.about.length);
        expect(select('.experience-section .timeline')?.querySelectorAll('article')).toHaveLength(experiencesJson.length);
        expect(select('.experience-section .timeline')?.innerHTML).toContain('https://jordanoffers.net');
        expect(select('.experience-section .timeline')?.innerHTML).toContain('https://joshops.com');
        expect(select('.education-section .card-grid')?.querySelectorAll('article')).toHaveLength(educationJson.length);
        expect(select('.skills-section .skills-grid')?.querySelectorAll('article')).toHaveLength(Object.keys(skillsJson.skills).length);
        expect(select('.projects-section .project-grid')?.querySelectorAll('article')).toHaveLength(projectsJson.length);
        expect(select('.projects-section .project-grid')?.querySelector('.coming-soon-card')).toBeNull();
        expect(select('.projects-section .project-grid')?.textContent).toContain('PHP n8n Client');
        expect(select('.projects-section .project-grid')?.textContent).toContain('SaedYousef.com Portfolio');
        expect(select('.projects-section .project-grid')?.innerHTML).toContain('https://php-n8n.com');
        expect(select('.projects-section .project-grid')?.innerHTML).toContain('https://github.com/saedyousef/saedyousef.com');
        expect(select('.contact-section .contact-title')?.textContent).toBe(siteJson.contact.title);
        expect(select('.theme-toggle')).not.toBeNull();
        expect(select('.effects-toggle')).not.toBeNull();
        expect(select('.effects-toggle .effects-toggle-label')?.textContent).toBe('Effects Off');
        expect(select('.menu-toggle')).not.toBeNull();
        expect(select('.scroll-top-button')).not.toBeNull();
        expect(select('.scroll-top-button')?.getAttribute('aria-hidden')).toBe('true');
        expect(document.querySelectorAll('.section-number')).toHaveLength(0);
        expect(document.body.textContent?.toLowerCase()).not.toMatch(/portfolio v\d/);
        expect(document.body.textContent?.toLowerCase()).not.toMatch(/technical\s+resume/);
        expect(document.body.textContent).not.toContain('First version designed & built by Saed Yousef | saedyousef.com');
    });

    it('renders hero actions and social links with profile URLs', async () => {
        await loadAllData();
        updateHeroSection();
        updateSocialLinks();

        const heroLinks = select('.hero-copy .hero-actions')?.querySelectorAll('a');
        expect(heroLinks?.length).toBe(siteJson.hero.actions.length);

        const socialHtml = select('.mobile-social')?.innerHTML || '';
        expect(socialHtml).toContain(profileJson.contact.github);
        expect(socialHtml).toContain(profileJson.contact.linkedin);
        expect(socialHtml).toContain(`mailto:${profileJson.contact.email}`);
    });

    it('renders GitHub calendar cells from the activity dataset', async () => {
        await loadAllData();
        renderGitHubActivities();

        const expectedDayCount = githubActivitiesJson.weeks.reduce((sum, week) => sum + week.contributionDays.length, 0);
        expect(select('.calendar-grid')).not.toBeNull();
        expect(document.querySelectorAll('.calendar-grid .activity-day')).toHaveLength(expectedDayCount);
        expect(select('.github-section .github-card')?.textContent).toContain(
            githubActivitiesJson.totalContributions.toLocaleString()
        );
    });

    it('handles missing optional containers without throwing', async () => {
        await loadAllData();
        document.body.innerHTML = '';

        expect(() => renderPortfolio()).not.toThrow();
    });
});
