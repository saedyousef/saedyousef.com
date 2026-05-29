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
        <div class="above-fold">
            <nav class="site-nav" aria-label="Primary navigation">
                <div class="nav-left">
                    <a class="nav-logo" href="#home"></a>
                    <a class="nav-logo-text site-brand" href="#home"></a>
                    <div class="nav-links"></div>
                </div>
                <div class="nav-right">
                    <a class="nav-login" href="#contact">Contact</a>
                </div>
            </nav>
            <header id="home" class="hero">
                <div class="hero-headline">
                    <p class="hero-kicker"></p>
                    <h1 class="hero-title"></h1>
                    <p class="hero-subtitle"></p>
                    <div class="hero-actions"></div>
                </div>
                <div class="term-player hero-terminal"></div>
            </header>
        </div>
        <main>
            <section class="about-section">
                <div class="section-heading"></div>
                <div class="prose-copy"></div>
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
    `;
}

function select<T extends Element = HTMLElement>(selector: string): T | null {
    return document.querySelector<T>(selector);
}

describe('portfolio datasets', () => {
    it('keeps the correct canonical domain and v2 theme metadata', () => {
        expect(siteJson.canonicalDomain).toBe('saedyousef.com');
        expect(siteJson.theme).toContain('v2 minimal');
        expect(JSON.stringify(siteJson).toLowerCase()).not.toMatch(/technical\s+resume/);
        expect(profileJson.footer.text).not.toContain('First version');
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
            expect.objectContaining({ title: 'Repository Dispatch GitHub Action', status: 'Open source · GitHub Action' }),
            expect.objectContaining({ title: 'Workflow Dispatcher', status: 'Live · workflow-dispatcher.saedyousef.com' }),
            expect.objectContaining({ title: 'SaedYousef.com Portfolio', status: 'Latest · saedyousef.com' }),
            expect.objectContaining({ title: 'SaedYousef.com Portfolio v1', status: 'Archived · v1.saedyousef.com' })
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
        expect(select('.site-brand')?.textContent).toBe(profileJson.name);
        expect(select('.nav-links')?.querySelectorAll('a')).toHaveLength(siteJson.navigation.length);
        expect(select('.hero-title')?.textContent).toBe(profileJson.name);
        expect(select('.hero-subtitle')?.textContent).toBe(profileJson.subtitle);
        expect(select('.hero-terminal')?.textContent).toContain(profileJson.name);
        expect(select('.hero-terminal')?.textContent).toContain(profileJson.title);
        expect(select('.hero-terminal')?.textContent).toContain('10+ years');
        expect(select('.hero-terminal')?.textContent).toContain('PHP n8n Client');
        expect(select('.hero-terminal')?.querySelectorAll('.tp-kv-line').length).toBeGreaterThan(0);
        expect(select('.hero-terminal')?.querySelectorAll('.tp-type').length).toBeGreaterThan(0);
        expect(select('.about-section .prose-copy')?.querySelectorAll('p')).toHaveLength(profileJson.about.length);
        expect(select('.experience-section .timeline')?.querySelectorAll('article')).toHaveLength(experiencesJson.length);
        expect(select('.experience-section .timeline')?.innerHTML).toContain('https://jordanoffers.net');
        expect(select('.experience-section .timeline')?.innerHTML).toContain('https://joshops.com');
        expect(select('.education-section .card-grid')?.querySelectorAll('article')).toHaveLength(educationJson.length);
        expect(select('.skills-section .skills-grid')?.querySelectorAll('article')).toHaveLength(Object.keys(skillsJson.skills).length);
        expect(select('.projects-section .project-grid')?.querySelectorAll('article')).toHaveLength(projectsJson.length);
        expect(select('.projects-section .project-grid')?.querySelector('.coming-soon-card')).toBeNull();
        expect(select('.projects-section .project-grid')?.textContent).toContain('PHP n8n Client');
        expect(select('.projects-section .project-grid')?.textContent).toContain('Repository Dispatch GitHub Action');
        expect(select('.projects-section .project-grid')?.textContent).toContain('Workflow Dispatcher');
        expect(select('.projects-section .project-grid')?.textContent).toContain('SaedYousef.com Portfolio');
        expect(select('.projects-section .project-grid')?.textContent).toContain('SaedYousef.com Portfolio v1');
        expect(select('.projects-section .project-grid')?.innerHTML).toContain('https://php-n8n.com');
        expect(select('.projects-section .project-grid')?.innerHTML).toContain('https://workflow-dispatcher.saedyousef.com/');
        expect(select('.projects-section .project-grid')?.innerHTML).toContain('https://github.com/saedyousef/repository-dispatch');
        expect(select('.projects-section .project-grid')?.innerHTML).toContain('https://github.com/saedyousef/saedyousef.com');
        expect(select('.projects-section .project-grid')?.innerHTML).toContain('https://v1.saedyousef.com');
        expect(select('.contact-section .contact-title')?.textContent).toBe(siteJson.contact.title);
        expect(select('.theme-toggle')).toBeNull();
        expect(select('.effects-toggle')).toBeNull();
        expect(select('.menu-toggle')).toBeNull();
        expect(select('.scroll-top-button')).toBeNull();
        expect(document.querySelectorAll('.section-number')).toHaveLength(0);
        expect(document.body.textContent?.toLowerCase()).not.toMatch(/technical\s+resume/);
        expect(document.body.textContent).not.toContain('First version designed & built by Saed Yousef | saedyousef.com');
    });

    it('renders hero actions and social links with profile URLs', async () => {
        await loadAllData();
        updateHeroSection();
        updateSocialLinks();

        const heroLinks = select('.hero .hero-actions')?.querySelectorAll('a');
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
