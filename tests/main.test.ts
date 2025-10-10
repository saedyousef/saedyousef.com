/**
 * Tests for main portfolio functionality
 * Tests are data-driven and work with any valid profile.json
 */

import { 
    loadAllData, 
    renderAboutSection, 
    renderGitHubActivities,
    updatePageTitle,
    updateHeroSection,
    updateSocialLinks,
    updateFooter
} from '../ts/main';
import profileJson from '../datasets/profile.json';
import experiencesJson from '../datasets/experiences.json';
import educationJson from '../datasets/education.json';
import githubActivitiesJson from '../datasets/github_activities.json';

// Mock fetch to return actual JSON files
global.fetch = jest.fn();

describe('Portfolio Main Functions', () => {
    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        
        // Reset DOM
        document.body.innerHTML = '';
        
        // Mock fetch to return actual data from JSON files
        (global.fetch as jest.Mock).mockImplementation((url: string) => {
            if (url.includes('profile.json')) {
                return Promise.resolve({
                    json: async () => profileJson
                } as Response);
            }
            if (url.includes('experiences.json')) {
                return Promise.resolve({
                    json: async () => experiencesJson
                } as Response);
            }
            if (url.includes('education.json')) {
                return Promise.resolve({
                    json: async () => educationJson
                } as Response);
            }
            if (url.includes('skills.json')) {
                return Promise.resolve({
                    json: async () => ({ skills: {} })
                } as Response);
            }
            if (url.includes('github_activities.json')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => githubActivitiesJson
                } as Response);
            }
            return Promise.reject(new Error('Not found'));
        });
    });

    describe('Profile Data Validation', () => {
        it('should have valid profile structure', () => {
            expect(profileJson).toHaveProperty('name');
            expect(profileJson).toHaveProperty('contact');
            expect(profileJson.contact).toHaveProperty('email');
            expect(profileJson.contact).toHaveProperty('github');
            expect(profileJson.contact).toHaveProperty('linkedin');
            expect(profileJson.contact).toHaveProperty('website');
        });

        it('should have valid email format', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            expect(profileJson.contact.email).toMatch(emailRegex);
        });

        it('should have valid URLs', () => {
            const urlRegex = /^https?:\/\/.+/;
            expect(profileJson.contact.github).toMatch(urlRegex);
            expect(profileJson.contact.linkedin).toMatch(urlRegex);
            expect(profileJson.contact.website).toMatch(urlRegex);
        });

        it('should have about section as array', () => {
            expect(Array.isArray(profileJson.about)).toBe(true);
            expect(profileJson.about.length).toBeGreaterThan(0);
        });
    });

    describe('Experiences Data Validation', () => {
        it('should have valid experiences structure', () => {
            expect(Array.isArray(experiencesJson)).toBe(true);
            expect(experiencesJson.length).toBeGreaterThan(0);
        });

        it('should have required fields in each experience', () => {
            experiencesJson.forEach((exp) => {
                expect(exp).toHaveProperty('company');
                expect(exp).toHaveProperty('position');
                expect(exp).toHaveProperty('start');
                expect(exp).toHaveProperty('description');
            });
        });
    });

    describe('Education Data Validation', () => {
        it('should have valid education structure', () => {
            expect(Array.isArray(educationJson)).toBe(true);
            expect(educationJson.length).toBeGreaterThan(0);
        });

        it('should have required fields in each education entry', () => {
            educationJson.forEach((edu) => {
                expect(edu).toHaveProperty('institution');
                expect(edu).toHaveProperty('degree');
                expect(edu).toHaveProperty('field');
                expect(edu).toHaveProperty('start');
                expect(edu).toHaveProperty('end');
            });
        });
    });

    describe('GitHub Contribution Data Validation', () => {
        it('should expose total contributions and weekly breakdown', () => {
            expect(githubActivitiesJson).toHaveProperty('totalContributions');
            expect(typeof githubActivitiesJson.totalContributions).toBe('number');
            expect(Array.isArray(githubActivitiesJson.weeks)).toBe(true);
            expect(githubActivitiesJson.weeks.length).toBeGreaterThan(0);
        });

        it('should have valid week and day structures', () => {
            githubActivitiesJson.weeks.forEach((week: any) => {
                expect(week).toHaveProperty('firstDay');
                expect(typeof week.firstDay).toBe('string');
                expect(Array.isArray(week.contributionDays)).toBe(true);
                expect(week.contributionDays.length).toBeGreaterThan(0);

                week.contributionDays.forEach((day: any) => {
                    expect(day).toHaveProperty('date');
                    expect(day).toHaveProperty('contributionCount');
                    expect(day).toHaveProperty('contributionLevel');
                    expect(typeof day.date).toBe('string');
                    expect(typeof day.contributionCount).toBe('number');
                    expect(typeof day.contributionLevel).toBe('string');
                });
            });
        });
    });

    describe('loadAllData', () => {
        it('should load all data files successfully', async () => {
            await loadAllData();
            
            expect(global.fetch).toHaveBeenCalledWith('datasets/profile.json');
            expect(global.fetch).toHaveBeenCalledWith('datasets/experiences.json');
            expect(global.fetch).toHaveBeenCalledWith('datasets/education.json');
            expect(global.fetch).toHaveBeenCalledWith('datasets/github_activities.json');
        });

        it('should handle fetch errors gracefully', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

            await loadAllData();
            
            // Should not throw
            expect(true).toBe(true);
        });
    });

    describe('updatePageTitle', () => {
        beforeEach(async () => {
            document.body.innerHTML = '<title id="page-title">Initial Title</title>';
            await loadAllData();
        });

        it('should update page title with profile name', () => {
            updatePageTitle();
            
            const titleEl = document.getElementById('page-title');
            expect(titleEl?.textContent).toContain(profileJson.name);
            if (profileJson.title) {
                expect(titleEl?.textContent).toContain(profileJson.title);
            }
            expect(titleEl?.textContent).not.toContain('Portfolio');
        });

        it('should update document.title', () => {
            updatePageTitle();
            
            expect(document.title).toContain(profileJson.name);
            if (profileJson.title) {
                expect(document.title).toContain(profileJson.title);
            }
            expect(document.title).not.toContain('Portfolio');
        });

        it('should handle missing title element gracefully', () => {
            document.body.innerHTML = '';
            expect(() => updatePageTitle()).not.toThrow();
        });
    });

    describe('updateHeroSection', () => {
        beforeEach(async () => {
            document.body.innerHTML = `
                <div id="hero-greeting"></div>
                <div id="hero-name"></div>
                <div id="hero-subtitle"></div>
                <div id="hero-description"></div>
            `;
            await loadAllData();
        });

        it('should populate hero section with profile data', () => {
            updateHeroSection();
            
            const nameEl = document.getElementById('hero-name');
            expect(nameEl?.textContent).toBe(profileJson.name);
            
            const descEl = document.getElementById('hero-description');
            expect(descEl?.textContent).toBe(profileJson.about[0]);
        });

        it('should populate greeting if provided', () => {
            updateHeroSection();
            
            const greetingEl = document.getElementById('hero-greeting');
            if (profileJson.greeting) {
                expect(greetingEl?.textContent).toBe(profileJson.greeting);
            }
        });

        it('should populate subtitle if provided', () => {
            updateHeroSection();
            
            const subtitleEl = document.getElementById('hero-subtitle');
            if (profileJson.subtitle) {
                expect(subtitleEl?.textContent).toBe(profileJson.subtitle);
            }
        });

        it('should handle missing elements gracefully', () => {
            document.body.innerHTML = '';
            expect(() => updateHeroSection()).not.toThrow();
        });
    });

    describe('updateSocialLinks', () => {
        beforeEach(async () => {
            document.body.innerHTML = `
                <div id="social-links-left"></div>
                <div id="social-links-right"></div>
                <a id="contact-email-btn" href="#"></a>
            `;
            await loadAllData();
        });

        it('should populate social links with profile data', () => {
            updateSocialLinks();
            
            const leftSidebar = document.getElementById('social-links-left');
            expect(leftSidebar?.innerHTML).toContain(profileJson.contact.github);
            expect(leftSidebar?.innerHTML).toContain(profileJson.contact.linkedin);
            expect(leftSidebar?.innerHTML).toContain(profileJson.contact.email);
        });

        it('should populate right sidebar with email', () => {
            updateSocialLinks();
            
            const rightSidebar = document.getElementById('social-links-right');
            expect(rightSidebar?.innerHTML).toContain(profileJson.contact.email);
        });

        it('should update contact button href', () => {
            updateSocialLinks();
            
            const contactBtn = document.getElementById('contact-email-btn') as HTMLAnchorElement;
            expect(contactBtn?.href).toContain(`mailto:${profileJson.contact.email}`);
        });

        it('should create clickable links', () => {
            updateSocialLinks();
            
            const leftSidebar = document.getElementById('social-links-left');
            const links = leftSidebar?.querySelectorAll('a');
            expect(links!.length).toBeGreaterThan(0);
        });

        it('should handle missing elements gracefully', () => {
            document.body.innerHTML = '';
            expect(() => updateSocialLinks()).not.toThrow();
        });
    });

    describe('updateFooter', () => {
        beforeEach(async () => {
            document.body.innerHTML = '<div id="footer-text"></div>';
            await loadAllData();
        });

        it('should populate footer with profile data', () => {
            updateFooter();
            
            const footerEl = document.getElementById('footer-text');
            expect(footerEl?.innerHTML).toContain(profileJson.contact.website.replace(/^https?:\/\//, ''));
        });

        it('should include name if footer.showName is true', () => {
            updateFooter();
            
            const footerEl = document.getElementById('footer-text');
            if (profileJson.footer && profileJson.footer.showName) {
                expect(footerEl?.innerHTML).toContain(profileJson.name);
            }
        });

        it('should create website link', () => {
            updateFooter();
            
            const footerEl = document.getElementById('footer-text');
            const link = footerEl?.querySelector('a');
            // Compare without trailing slash to handle browser normalization
            expect(link?.href.replace(/\/$/, '')).toBe(profileJson.contact.website.replace(/\/$/, ''));
        });

        it('should handle missing footer config', () => {
            updateFooter();
            
            const footerEl = document.getElementById('footer-text');
            expect(footerEl?.innerHTML.length).toBeGreaterThan(0);
        });

        it('should handle missing element gracefully', () => {
            document.body.innerHTML = '';
            expect(() => updateFooter()).not.toThrow();
        });
    });

    describe('renderAboutSection', () => {
        beforeEach(async () => {
            document.body.innerHTML = '<div id="about-content"></div>';
            await loadAllData();
        });

        it('should render all about paragraphs from profile', () => {
            renderAboutSection();

            const container = document.getElementById('about-content');
            expect(container?.children.length).toBe(profileJson.about.length);
        });

        it('should create paragraph elements', () => {
            renderAboutSection();

            const container = document.getElementById('about-content');
            const paragraphs = container?.querySelectorAll('p');
            expect(paragraphs!.length).toBe(profileJson.about.length);
        });

        it('should populate paragraphs with correct content', () => {
            renderAboutSection();

            const container = document.getElementById('about-content');
            const paragraphs = container?.querySelectorAll('p');
            
            paragraphs?.forEach((p, index) => {
                expect(p.textContent).toBe(profileJson.about[index]);
            });
        });

        it('should handle missing container gracefully', () => {
            document.body.innerHTML = '';
            
            expect(() => renderAboutSection()).not.toThrow();
        });
    });

    describe('Integration Tests', () => {
        it('should load and render complete profile', async () => {
            document.body.innerHTML = `
                <title id="page-title">Portfolio</title>
                <div id="hero-greeting"></div>
                <div id="hero-name"></div>
                <div id="hero-subtitle"></div>
                <div id="hero-description"></div>
                <div id="social-links-left"></div>
                <div id="social-links-right"></div>
                <a id="contact-email-btn" href="#"></a>
                <div id="footer-text"></div>
                <div id="about-content"></div>
                <div id="github-activities-container"></div>
            `;

            await loadAllData();
            updatePageTitle();
            updateHeroSection();
            updateSocialLinks();
            updateFooter();
            renderAboutSection();
            renderGitHubActivities();

            // Verify all sections are populated
            expect(document.getElementById('page-title')?.textContent).toContain(profileJson.name);
            expect(document.getElementById('hero-name')?.textContent).toBe(profileJson.name);
            expect(document.getElementById('about-content')?.children.length).toBe(profileJson.about.length);
            expect(document.getElementById('footer-text')?.innerHTML.length).toBeGreaterThan(0);
            const grid = document.querySelector('[data-role="github-calendar-grid"]');
            expect(grid).not.toBeNull();
            const dayCells = document.querySelectorAll('[data-activity-day]');
            const expectedDayCount = githubActivitiesJson.weeks.reduce((sum: number, week: any) => sum + week.contributionDays.length, 0);
            expect(dayCells.length).toBe(expectedDayCount);
        });
    });

    describe('renderGitHubActivities', () => {
        beforeEach(async () => {
            document.body.innerHTML = '<div id="github-activities-container"></div>';
            await loadAllData();
        });

        it('should render GitHub activities cards', () => {
            renderGitHubActivities();

            const container = document.getElementById('github-activities-container');
            const dayCells = container?.querySelectorAll('[data-activity-day]');
            const expectedDayCount = githubActivitiesJson.weeks.reduce((sum: number, week: any) => sum + week.contributionDays.length, 0);
            expect(dayCells?.length).toBe(expectedDayCount);
            const summaryText = container?.querySelector('span.text-lightest-slate')?.textContent;
            expect(summaryText).toBeDefined();
            expect(summaryText).toContain(githubActivitiesJson.totalContributions.toLocaleString());
        });

        it('should handle missing container gracefully', () => {
            document.body.innerHTML = '';
            expect(() => renderGitHubActivities()).not.toThrow();
        });
    });
});
