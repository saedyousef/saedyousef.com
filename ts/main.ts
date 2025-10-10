/**
 * PORTFOLIO MAIN TYPESCRIPT FILE
 */

import type {
    ProfileData,
    Skills,
    Experience,
    Education,
    GitHubContributionCalendar,
    ContributionWeek,
    ContributionDay
} from './types.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined' && gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
}

// Global state
let profileData: ProfileData | null = null;
let skillsData: Skills | null = null;
let experiencesData: Experience[] = [];
let educationData: Education[] = [];
let githubCalendarData: GitHubContributionCalendar | null = null;

/**
 * Load all JSON data files
 */
async function loadAllData(): Promise<void> {
    try {
        // Load profile data from local file
        const profileResponse = await fetch('datasets/profile.json');
        profileData = await profileResponse.json();

        // Load experiences from local file
        const experiencesResponse = await fetch('datasets/experiences.json');
        experiencesData = await experiencesResponse.json();

        // Load education from local file
        const educationResponse = await fetch('datasets/education.json');
        educationData = await educationResponse.json();

        // Load skills from local file
        const skillsResponse = await fetch('datasets/skills.json');
        skillsData = await skillsResponse.json();

        // Load GitHub contribution calendar from local file
        const githubResponse = await fetch('datasets/github_activities.json');
        githubCalendarData = githubResponse.ok ? await githubResponse.json() : {
            totalContributions: 0,
            weeks: []
        };

        console.log('All data loaded successfully');
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback data
        profileData = {
            name: 'Saed Yousef',
            title: 'Software Engineer',
            about: ['Loading...'],
            contact: {
                email: 'me@saedyousef.com',
                github: 'https://github.com/saedyousef',
                linkedin: 'https://linkedin.com/in/saedyousef',
                website: 'https://saedyousef.com'
            }
        };
        githubCalendarData = {
            totalContributions: 0,
            weeks: []
        };
    }
}

/**
 * Initialize scroll animations with GSAP
 */
function initScrollAnimations(): void {
    // Hero section animations
    gsap.from('.hero-content > *', {
        scrollTrigger: {
            trigger: '.hero-content',
            start: 'top 80%',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2
    });

    // Section animations
    gsap.utils.toArray('section').forEach((section: any) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
            },
            opacity: 0,
            y: 50,
            duration: 0.8
        });
    });
}

/**
 * Render about section
 */
function renderAboutSection(): void {
    const aboutContent = document.getElementById('about-content');
    if (!aboutContent || !profileData) return;

    aboutContent.innerHTML = '';
    profileData.about.forEach(paragraph => {
        const p = document.createElement('p');
        p.className = 'text-slate mb-4 leading-relaxed';
        p.textContent = paragraph;
        aboutContent.appendChild(p);
    });
}

/**
 * Update page title
 */
function updatePageTitle(): void {
    if (!profileData) return;
    const titleEl = document.getElementById('page-title');
    const titleText = profileData.title
        ? `${profileData.name} | ${profileData.title}`
        : profileData.name;
    if (titleEl) {
        titleEl.textContent = titleText;
    }
    // Also update document title for browsers
    document.title = titleText;
}

/**
 * Update hero section with dynamic content
 */
function updateHeroSection(): void {
    if (!profileData) return;

    const greetingEl = document.getElementById('hero-greeting');
    const nameEl = document.getElementById('hero-name');
    const subtitleEl = document.getElementById('hero-subtitle');
    const descriptionEl = document.getElementById('hero-description');

    if (greetingEl && profileData.greeting) {
        greetingEl.textContent = profileData.greeting;
    }
    
    if (nameEl) {
        nameEl.textContent = profileData.name;
    }
    
    if (subtitleEl && profileData.subtitle) {
        subtitleEl.textContent = profileData.subtitle;
    }
    
    if (descriptionEl && profileData.about && profileData.about.length > 0) {
        descriptionEl.textContent = profileData.about[0];
    }
}

/**
 * Update social links
 */
function updateSocialLinks(): void {
    if (!profileData) return;

    const { contact } = profileData;
    
    // Left sidebar social links
    const leftSidebar = document.getElementById('social-links-left');
    if (leftSidebar) {
        leftSidebar.innerHTML = `
            <a href="${contact.github}" target="_blank" class="text-slate hover:text-green hover:-translate-y-1 transition-all duration-300">
                <i class="fab fa-github text-xl"></i>
            </a>
            <a href="${contact.linkedin}" target="_blank" class="text-slate hover:text-green hover:-translate-y-1 transition-all duration-300">
                <i class="fab fa-linkedin text-xl"></i>
            </a>
            <a href="mailto:${contact.email}" class="text-slate hover:text-green hover:-translate-y-1 transition-all duration-300">
                <i class="fas fa-envelope text-xl"></i>
            </a>
            <div class="w-px h-24 bg-slate"></div>
        `;
    }
    
    // Right sidebar email
    const rightSidebar = document.getElementById('social-links-right');
    if (rightSidebar) {
        rightSidebar.innerHTML = `
            <a href="mailto:${contact.email}" class="text-slate hover:text-green hover:-translate-y-1 transition-all duration-300 font-mono text-xs tracking-wider mb-28" style="writing-mode: vertical-rl;">
                ${contact.email}
            </a>
            <div class="w-px h-24 bg-slate"></div>
        `;
    }
    
    // Contact button
    const contactBtn = document.getElementById('contact-email-btn');
    if (contactBtn) {
        contactBtn.setAttribute('href', `mailto:${contact.email}`);
    }
}

/**
 * Update footer
 */
function updateFooter(): void {
    if (!profileData) return;

    const footerEl = document.getElementById('footer-text');
    if (!footerEl) return;

    const footer = profileData.footer || { text: 'Designed & Built by', showName: true };
    const websiteLink = profileData.contact.website;
    const websiteDomain = websiteLink.replace(/^https?:\/\//, '');

    let footerHTML = footer.text;
    if (footer.showName) {
        footerHTML += ` ${profileData.name}`;
    }
    footerHTML += ` | <a href="${websiteLink}" target="_blank" class="text-green hover:underline">${websiteDomain}</a>`;

    footerEl.innerHTML = footerHTML;
}


/**
 * Render experience section
 */
function renderExperienceSection(): void {
    const container = document.getElementById('experience-container');
    if (!container || !experiencesData.length) return;

    container.innerHTML = '';

    experiencesData.forEach((exp, index) => {
        const expDiv = document.createElement('div');
        expDiv.className = 'relative pl-8 pb-12 border-l-2 border-green/30 last:pb-0';

        const dot = document.createElement('div');
        dot.className = 'absolute left-[-9px] top-0 w-4 h-4 bg-green rounded-full border-4 border-navy';
        expDiv.appendChild(dot);

        const dateSpan = document.createElement('span');
        dateSpan.className = 'text-sm text-green font-mono mb-2 block';
        dateSpan.textContent = `${exp.start} — ${exp.end || 'Present'}`;
        expDiv.appendChild(dateSpan);

        const title = document.createElement('h3');
        title.className = 'text-xl font-bold text-lightest-slate mb-1';
        title.textContent = exp.position;
        expDiv.appendChild(title);

        const company = document.createElement('div');
        company.className = 'text-light-slate mb-2';
        company.innerHTML = `${exp.company} ${exp.location ? `· ${exp.location}` : ''} ${exp.workType ? `· <span class="text-green">${exp.workType}</span>` : ''}`;
        expDiv.appendChild(company);

        const desc = document.createElement('p');
        desc.className = 'text-slate mb-4';
        desc.textContent = exp.description;
        expDiv.appendChild(desc);

        if (exp.responsibilities?.length) {
            const ul = document.createElement('ul');
            ul.className = 'list-disc list-inside space-y-2 text-slate';
            exp.responsibilities.forEach(resp => {
                const li = document.createElement('li');
                li.textContent = resp;
                ul.appendChild(li);
            });
            expDiv.appendChild(ul);
        }

        container.appendChild(expDiv);

        // Animate on scroll
        gsap.from(expDiv, {
            scrollTrigger: {
                trigger: expDiv,
                start: 'top 85%'
            },
            opacity: 0,
            x: -30,
            duration: 0.6,
            delay: index * 0.1
        });
    });
}

/**
 * Render education section
 */
function renderEducationSection(): void {
    const container = document.getElementById('education-container');
    if (!container || !educationData.length) return;

    container.innerHTML = '';

    educationData.forEach((edu, index) => {
        const card = document.createElement('div');
        card.className = 'bg-light-navy/30 border border-green/20 rounded-lg p-6 hover:border-green/50 transition-all duration-300';

        const icon = document.createElement('div');
        icon.className = 'flex items-center gap-3 mb-4';
        icon.innerHTML = `
            <svg class="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
            </svg>
            <h3 class="text-xl font-bold text-lightest-slate">${edu.institution}</h3>
        `;
        card.appendChild(icon);

        const degree = document.createElement('p');
        degree.className = 'text-light-slate mb-2';
        degree.innerHTML = `<strong>${edu.degree}</strong> in ${edu.field}`;
        card.appendChild(degree);

        const period = document.createElement('p');
        period.className = 'text-slate text-sm';
        period.textContent = `${edu.start} — ${edu.end} · ${edu.location}`;
        card.appendChild(period);

        container.appendChild(card);

        // Animate on scroll
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1
        });
    });
}

/**
 * Render skills section
 */
function renderSkillsSection(): void {
    const container = document.getElementById('skills-container');
    if (!container) return;
    
    // Use data from saedyousef.com/datasets/skills.json
    const skillsObj = skillsData?.skills || {};
    
    if (Object.keys(skillsObj).length === 0) {
        container.innerHTML = '<p class="text-slate text-center col-span-3">Skills data will be loaded here.</p>';
        return;
    }
    
    // Convert the skills object to array format for rendering
    const skillCategories = Object.entries(skillsObj).map(([category, items]) => ({
        category: category,
        items: items
    }));
    
    renderSkillCategories(container, skillCategories);
}

function renderGitHubActivities(): void {
    const container = document.getElementById('github-activities-container');
    if (!container) return;

    container.innerHTML = '';
    container.className = 'flex flex-col gap-8';

    if (!githubCalendarData || githubCalendarData.weeks.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-slate">GitHub activity will appear here once available.</p>';
        return;
    }

    const { totalContributions, weeks } = githubCalendarData;

    const lastWeek = weeks[weeks.length - 1];
    const lastDay = lastWeek?.contributionDays[lastWeek.contributionDays.length - 1];
    const lastUpdatedDate = lastDay ? new Date(`${lastDay.date}T00:00:00`) : new Date();

    const summary = document.createElement('div');
    summary.className = 'flex flex-wrap items-center justify-between mb-6 gap-4';
    summary.innerHTML = `
        <div>
            <span class="text-lightest-slate text-xl font-semibold">${totalContributions.toLocaleString()}</span>
            <span class="text-slate text-sm ml-2">contributions in the last year</span>
        </div>
    <div class="text-sm text-slate">Updated ${lastUpdatedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    `;
    container.appendChild(summary);

    const calendarWrapper = document.createElement('div');
    calendarWrapper.className = 'overflow-x-auto pb-4 w-full';

    const calendarInner = document.createElement('div');
    calendarInner.className = 'inline-block min-w-full';

    const monthsRow = document.createElement('div');
    monthsRow.className = 'grid grid-flow-col auto-cols-max text-xs text-slate mb-2 ml-8 gap-1';

    const monthLabels: string[] = [];
    weeks.forEach((week, index) => {
        const currentDate = new Date(`${week.firstDay}T00:00:00`);
        const label = currentDate.toLocaleString(undefined, { month: 'short' });
        if (index === 0) {
            monthLabels.push(label);
            return;
        }

        const previousDate = new Date(`${weeks[index - 1].firstDay}T00:00:00`);
        if (currentDate.getMonth() !== previousDate.getMonth()) {
            monthLabels.push(label);
        } else {
            monthLabels.push('');
        }
    });

    monthLabels.forEach((label) => {
        const cell = document.createElement('div');
        cell.className = 'flex items-center justify-center h-4';
        cell.style.width = '0.75rem';
        cell.textContent = label;
        monthsRow.appendChild(cell);
    });

    const gridLayout = document.createElement('div');
    gridLayout.className = 'flex gap-3';

    const dayLabels = document.createElement('div');
    dayLabels.className = 'flex flex-col justify-between text-xs text-slate pt-4 pb-3';
    ['Mon', 'Wed', 'Fri'].forEach((label) => {
        const span = document.createElement('span');
        span.textContent = label;
        dayLabels.appendChild(span);
    });

    const weeksGrid = document.createElement('div');
    weeksGrid.className = 'grid grid-flow-col auto-cols-max gap-1';
    weeksGrid.setAttribute('data-role', 'github-calendar-grid');

    const levelColorMap: Record<string, string> = {
        NONE: '#112240',
        FIRST_QUARTILE: '#1b6a5d',
        SECOND_QUARTILE: '#239b7f',
        THIRD_QUARTILE: '#2dc6a3',
        FOURTH_QUARTILE: '#64ffda'
    };

    weeks.forEach((week: ContributionWeek) => {
        const column = document.createElement('div');
        column.className = 'flex flex-col gap-1';

        week.contributionDays.forEach((day: ContributionDay) => {
            const block = document.createElement('div');
            block.className = 'w-3 h-3 rounded-sm transition-transform duration-150 ease-out hover:scale-110';
            block.style.backgroundColor = levelColorMap[day.contributionLevel] || levelColorMap.NONE;
            block.setAttribute('data-activity-day', day.date);
            block.style.border = '1px solid rgba(17, 34, 64, 0.4)';

            const contributionText = `${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'} on ${new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`;
            block.setAttribute('title', contributionText);
            block.setAttribute('aria-label', contributionText);

            column.appendChild(block);
        });

        weeksGrid.appendChild(column);
    });

    gridLayout.appendChild(dayLabels);
    gridLayout.appendChild(weeksGrid);

    calendarInner.appendChild(monthsRow);
    calendarInner.appendChild(gridLayout);
    calendarWrapper.appendChild(calendarInner);
    container.appendChild(calendarWrapper);

    const legend = document.createElement('div');
    legend.className = 'flex items-center gap-3 text-xs text-slate';
    const legendColors = [
        levelColorMap.NONE,
        levelColorMap.FIRST_QUARTILE,
        levelColorMap.SECOND_QUARTILE,
        levelColorMap.THIRD_QUARTILE,
        levelColorMap.FOURTH_QUARTILE
    ];

    legend.innerHTML = `
        <span>Less</span>
        <div class="flex items-center gap-1">
            ${legendColors.map((color) => `
                <span class="w-3 h-3 rounded-sm" style="background-color: ${color}; border: 1px solid rgba(17, 34, 64, 0.4);"></span>
            `).join('')}
        </div>
        <span>More</span>
    `;
    container.appendChild(legend);

    gsap.from(weeksGrid.children, {
        scrollTrigger: {
            trigger: container,
            start: 'top 85%'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.01
    });
}

function renderSkillCategories(container: HTMLElement, skillsData: Array<{category: string, items: string[]}>): void {
    container.innerHTML = '';
    
    // Map categories to appropriate icons
    const iconMap: Record<string, string> = {
        'Skills': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>',
        'Development Tools & Frameworks': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>',
        'Databases & Search': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>',
        'IDEs & Text Editors': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>',
        'Cloud Providers': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>',
        'Web & Front-End Technologies': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>',
        'Operating Systems & Environments': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>',
        'Software Methodologies': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>',
        'Project & Task Management': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>'
    };
    
    // Default icon for categories not in the map
    const defaultIcon = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>';
    
    skillsData.forEach((category, index) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'bg-light-navy/30 border border-green/20 rounded-lg p-6 hover:border-green/50 hover:bg-light-navy/50 transition-all duration-300';
        
        const iconPath = iconMap[category.category] || defaultIcon;
        
        categoryDiv.innerHTML = `
            <div class="flex items-center gap-3 mb-4">
                <svg class="w-6 h-6 text-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    ${iconPath}
                </svg>
                <h3 class="text-lg font-bold text-lightest-slate">${category.category}</h3>
            </div>
            <div class="flex flex-wrap gap-2">
                ${category.items.map(skill => `
                    <span class="px-3 py-1 bg-navy border border-green/30 text-slate rounded text-sm font-mono hover:border-green hover:text-green transition-all duration-300">
                        ${skill}
                    </span>
                `).join('')}
            </div>
        `;
        
        container.appendChild(categoryDiv);
        
        // Animate on scroll
        gsap.from(categoryDiv, {
            scrollTrigger: {
                trigger: categoryDiv,
                start: 'top 85%'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1
        });
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Portfolio initializing...');
    
    await loadAllData();
    
    // Update dynamic content
    updatePageTitle();
    updateHeroSection();
    updateSocialLinks();
    updateFooter();
    
    // Render sections
    initScrollAnimations();
    renderAboutSection();
    renderExperienceSection();
    renderEducationSection();
    renderSkillsSection();
    renderGitHubActivities();
    
    console.log('Portfolio ready!');
});

// Export for testing
export {
    loadAllData,
    initScrollAnimations,
    renderAboutSection,
    renderExperienceSection,
    renderEducationSection,
    renderSkillsSection,
    renderGitHubActivities,
    updatePageTitle,
    updateHeroSection,
    updateSocialLinks,
    updateFooter
};
