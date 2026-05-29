import '../css/main.css';
import type {
    ContributionDay,
    ContributionWeek,
    Education,
    Experience,
    GitHubContributionCalendar,
    ProfileData,
    Project,
    SiteData,
    SiteLink,
    SiteSection,
    Skills,
    SocialLink
} from './types';

let profileData: ProfileData | null = null;
let siteData: SiteData | null = null;
let skillsData: Skills | null = null;
let experiencesData: Experience[] = [];
let educationData: Education[] = [];
let projectsData: Project[] = [];
let githubCalendarData: GitHubContributionCalendar | null = null;

const selectors = {
    siteBrand: '.site-brand',
    siteLogo: '.nav-logo',
    siteNav: '.nav-links',
    heroGreeting: '.hero-kicker',
    heroName: '.hero-title',
    heroSubtitle: '.hero-subtitle',
    heroActions: '.hero .hero-actions',
    heroMeta: '.hero-terminal',
    socialLinks: '.mobile-social',
    footerText: '.footer-text',
    aboutHeader: '.about-section .section-heading',
    aboutContent: '.about-section .prose-copy',
    experienceHeader: '.experience-section .section-heading',
    experienceContainer: '.experience-section .timeline',
    educationHeader: '.education-section .section-heading',
    educationContainer: '.education-section .card-grid',
    skillsHeader: '.skills-section .section-heading',
    skillsContainer: '.skills-section .skills-grid',
    projectsHeader: '.projects-section .section-heading',
    projectsContainer: '.projects-section .project-grid',
    githubHeader: '.github-section .section-heading',
    githubContainer: '.github-section .github-card',
    contactEyebrow: '.contact-section .contact-eyebrow',
    contactTitle: '.contact-section .contact-title',
    contactBody: '.contact-section .contact-body',
    contactActions: '.contact-section .contact-actions'
} as const;

const fallbackProfileData: ProfileData = {
    name: 'Saed Yousef',
    title: 'Software Engineer',
    subtitle: 'I build reliable backend systems.',
    greeting: 'Hi, my name is',
    about: ['Profile data is currently unavailable.'],
    contact: {
        email: 'me@saedyousef.com',
        github: 'https://github.com/saedyousef',
        linkedin: 'https://www.linkedin.com/in/saedyousef',
        website: 'https://saedyousef.com'
    },
    footer: {
        text: 'Designed and built by',
        showName: true
    }
};

const fallbackSiteData: SiteData = {
    canonicalDomain: 'saedyousef.com',
    sourceRepository: 'https://github.com/saedyousef/saedyousef.com',
    theme: 'v2 minimal portfolio',
    navigation: [
        { label: 'about', target: 'about' },
        { label: 'experience', target: 'experience' },
        { label: 'work', target: 'projects' },
        { label: 'contact', target: 'contact' }
    ],
    hero: {
        eyebrow: 'Backend systems / infrastructure / automation',
        terminalTitle: 'saedyousef.com',
        actions: [
            { label: 'View experience', href: '#experience', variant: 'primary' },
            { label: 'Say hello', urlKey: 'email', variant: 'secondary' }
        ]
    },
    sections: {
        about: { number: '01', title: 'About', eyebrow: 'It is just software that has to work' },
        experience: { number: '02', title: 'Experience', eyebrow: 'Production work' },
        education: { number: '03', title: 'Education', eyebrow: 'Foundation' },
        skills: { number: '04', title: 'Skills', eyebrow: 'Toolbox' },
        projects: { number: '05', title: 'Selected Work', eyebrow: 'Projects and open source' },
        github: { number: '06', title: 'Contributions', eyebrow: 'GitHub activity' }
    },
    socialLinks: [
        { id: 'github', label: 'GitHub', urlKey: 'github', icon: 'github' },
        { id: 'linkedin', label: 'LinkedIn', urlKey: 'linkedin', icon: 'linkedin' },
        { id: 'email', label: 'Email', urlKey: 'email', icon: 'email' }
    ],
    contact: {
        eyebrow: 'Available for focused technical conversations',
        title: 'Let us build reliable systems.',
        body: 'Send a message and I will get back to you.',
        actions: [
            { label: 'Say hello', urlKey: 'email', variant: 'primary' }
        ]
    }
};

async function fetchJson<T>(path: string): Promise<T> {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`Failed to load ${path}: ${response.status}`);
    }

    return await response.json() as T;
}

async function loadJsonOrDefault<T>(path: string, fallback: T): Promise<T> {
    try {
        return await fetchJson<T>(path);
    } catch (error) {
        console.error(error);
        return fallback;
    }
}

async function loadAllData(): Promise<void> {
    const [site, profile, experiences, education, skills, projects, github] = await Promise.all([
        loadJsonOrDefault<SiteData>('datasets/site.json', fallbackSiteData),
        loadJsonOrDefault<ProfileData>('datasets/profile.json', fallbackProfileData),
        loadJsonOrDefault<Experience[]>('datasets/experiences.json', []),
        loadJsonOrDefault<Education[]>('datasets/education.json', []),
        loadJsonOrDefault<Skills>('datasets/skills.json', { skills: {} }),
        loadJsonOrDefault<Project[]>('datasets/projects.json', []),
        loadJsonOrDefault<GitHubContributionCalendar>('datasets/github_activities.json', {
            totalContributions: 0,
            weeks: []
        })
    ]);

    siteData = site;
    profileData = profile;
    experiencesData = experiences;
    educationData = education;
    skillsData = skills;
    projectsData = projects;
    githubCalendarData = github;
}

function selectElement<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T | null {
    return root.querySelector<T>(selector);
}

function clearElement(element: HTMLElement): void {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function setText(selector: string, value: string): void {
    const element = selectElement<HTMLElement>(selector);

    if (element) {
        element.textContent = value;
    }
}

function setOptionalText(selector: string, value: string): void {
    const element = selectElement<HTMLElement>(selector);

    if (!element) {
        return;
    }

    element.textContent = value;
    element.hidden = value.trim().length === 0;
}

function appendTextElement<K extends keyof HTMLElementTagNameMap>(
    parent: HTMLElement,
    tagName: K,
    className: string,
    text: string
): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    parent.appendChild(element);
    return element;
}

function resolveLinkUrl(link: SiteLink | SocialLink): string {
    if ('href' in link && link.href) {
        return link.href;
    }

    if (link.url) {
        return link.url;
    }

    if (!profileData || !link.urlKey) {
        return '#';
    }

    const value = profileData.contact[link.urlKey];
    return link.urlKey === 'email' ? `mailto:${value}` : value;
}

function createAnchor(label: string, href: string, className = ''): HTMLAnchorElement {
    const anchor = document.createElement('a');
    anchor.className = className;
    anchor.href = href;
    anchor.textContent = label;

    if (href.startsWith('http')) {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
    }

    return anchor;
}

function renderSectionHeader(headerSelector: string, section?: SiteSection): void {
    const container = selectElement<HTMLElement>(headerSelector);

    if (!container || !section) {
        return;
    }

    clearElement(container);
    appendTextElement(container, 'p', 'section-kicker', section.eyebrow);
    appendTextElement(container, 'h2', 'section-title', section.title);

    if (section.summary) {
        appendTextElement(container, 'p', 'section-summary', section.summary);
    }
}

function updatePageTitle(): void {
    if (!profileData) {
        return;
    }

    document.title = profileData.title ? `${profileData.name} - ${profileData.title}` : profileData.name;
}

function renderNavigation(): void {
    const nav = selectElement<HTMLElement>(selectors.siteNav);
    const brand = selectElement<HTMLAnchorElement>(selectors.siteBrand);
    const logo = selectElement<HTMLAnchorElement>(selectors.siteLogo);

    if (brand && profileData) {
        brand.textContent = profileData.name;
    }

    if (logo && profileData) {
        logo.textContent = profileData.name
            .split(' ')
            .map(part => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    }

    if (!nav || !siteData) {
        return;
    }

    clearElement(nav);
    siteData.navigation.forEach(item => nav.appendChild(createAnchor(item.label, `#${item.target}`, 'nav-link')));
}

function updateHeroSection(): void {
    if (!profileData || !siteData) {
        return;
    }

    setOptionalText(selectors.heroGreeting, siteData.hero.eyebrow || profileData.greeting || '');
    setText(selectors.heroName, profileData.name);
    setText(selectors.heroSubtitle, profileData.subtitle || profileData.title);

    const actions = selectElement<HTMLElement>(selectors.heroActions);
    if (actions) {
        clearElement(actions);
        siteData.hero.actions.forEach(action => {
            const href = resolveLinkUrl(action);
            const className = action.variant === 'primary' ? 'button-link primary' : 'button-link';
            actions.appendChild(createAnchor(action.label, href, className));
        });
    }

    renderHeroTerminal();
}

function renderHeroTerminal(): void {
    const terminal = selectElement<HTMLElement>(selectors.heroMeta);

    if (!terminal || !profileData || !siteData) {
        return;
    }

    const currentRoles = experiencesData
        .filter(experience => experience.end === 'Present')
        .map(experience => experience.company)
        .slice(0, 3);
    const highlightedProjects = projectsData.slice(0, 3).map(project => project.title);
    const skillBuckets = Object.values(skillsData?.skills || {});
    const focusItems = skillBuckets.flat().filter(skill => [
        'PHP',
        'TypeScript',
        'AWS',
        'Docker',
        'Kubernetes',
        'GitHub Actions',
        'n8n'
    ].includes(skill));

    clearElement(terminal);

    const titlebar = document.createElement('div');
    titlebar.className = 'tp-titlebar';
    const dots = document.createElement('div');
    dots.className = 'tp-dots';
    ['close', 'min', 'max'].forEach(name => {
        const dot = document.createElement('span');
        dot.className = `tp-dot tp-dot-${name}`;
        dots.appendChild(dot);
    });
    appendTextElement(titlebar, 'span', 'tp-title', siteData.hero.terminalTitle || siteData.canonicalDomain);
    titlebar.prepend(dots);
    terminal.appendChild(titlebar);

    const tabs = document.createElement('div');
    tabs.className = 'tp-tabs';
    ['profile', 'work', 'contact'].forEach((label, index) => {
        const tab = document.createElement('button');
        tab.className = index === 0 ? 'tp-tab active' : 'tp-tab';
        tab.type = 'button';
        tab.textContent = label;
        tabs.appendChild(tab);
    });
    terminal.appendChild(tabs);

    const screen = document.createElement('div');
    screen.className = 'tp-screen';
    const lines = document.createElement('div');
    lines.className = 'tp-lines';
    screen.appendChild(lines);
    terminal.appendChild(screen);

    let lineIndex = 0;
    lineIndex = appendTerminalCommand(lines, `ssh ${siteData.canonicalDomain}`, lineIndex);
    lineIndex = appendTerminalStatus(lines, `connected to ${profileData.name}`, lineIndex);
    lineIndex = appendTerminalKeyValue(lines, 'role', profileData.title, lineIndex);
    lineIndex = appendTerminalKeyValue(lines, 'experience', '10+ years', lineIndex);
    lineIndex = appendTerminalKeyValue(lines, 'current', currentRoles.join(' / ') || 'Available for focused systems work', lineIndex);
    lineIndex = appendTerminalKeyValue(lines, 'focus', focusItems.slice(0, 7).join(', ') || 'backend systems, infrastructure, automation', lineIndex);
    lineIndex = appendTerminalKeyValue(lines, 'projects', highlightedProjects.join(' / ') || 'Selected work loading', lineIndex);
    lineIndex = appendTerminalKeyValue(lines, 'email', profileData.contact.email, lineIndex);

    const cursorLine = document.createElement('div');
    cursorLine.className = 'tp-line tp-command-line tp-cursor-line';
    cursorLine.style.setProperty('--delay', `${lineIndex * 160}ms`);
    cursorLine.appendChild(createTerminalSpan('$ ', 'tp-prompt-text'));
    cursorLine.appendChild(createTerminalSpan('', 'tp-cursor'));
    lines.appendChild(cursorLine);
}

function appendTerminalCommand(parent: HTMLElement, command: string, index: number): number {
    const line = document.createElement('div');
    line.className = 'tp-line tp-command-line';
    line.appendChild(createTerminalSpan('$ ', 'tp-prompt-text'));
    line.appendChild(createTypingSpan(command, 'tp-cmd-text', index));
    parent.appendChild(line);
    return index + 1;
}

function appendTerminalStatus(parent: HTMLElement, text: string, index: number): number {
    const line = document.createElement('div');
    line.className = 'tp-line tp-status-line';
    line.appendChild(createTypingSpan(text, 'tp-cmd-text tp-bold', index));
    parent.appendChild(line);
    return index + 1;
}

function appendTerminalKeyValue(parent: HTMLElement, key: string, value: string, index: number): number {
    const line = document.createElement('div');
    line.className = 'tp-line tp-kv-line';
    line.appendChild(createTerminalSpan(key, 'tp-label'));
    line.appendChild(createTypingSpan(value, 'tp-output-text', index));
    parent.appendChild(line);
    return index + 1;
}

function createTerminalSpan(text: string, className: string): HTMLSpanElement {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    return span;
}

function createTypingSpan(text: string, className: string, index: number): HTMLSpanElement {
    const span = createTerminalSpan(text, `${className} tp-type`);
    span.style.setProperty('--chars', `${Math.max(text.length, 1)}`);
    span.style.setProperty('--delay', `${index * 160}ms`);
    span.style.setProperty('--duration', `${Math.min(Math.max(text.length * 24, 340), 1400)}ms`);
    return span;
}

function updateSocialLinks(): void {
    if (!profileData || !siteData) {
        return;
    }

    const container = selectElement<HTMLElement>(selectors.socialLinks);

    if (!container) {
        return;
    }

    clearElement(container);
    siteData.socialLinks.forEach(link => container.appendChild(createAnchor(link.label, resolveLinkUrl(link), 'footer-link')));
}

function updateFooter(): void {
    const footer = selectElement<HTMLElement>(selectors.footerText);

    if (footer) {
        clearElement(footer);
    }
}

function renderAboutSection(): void {
    const aboutContent = selectElement<HTMLElement>(selectors.aboutContent);

    renderSectionHeader(selectors.aboutHeader, siteData?.sections.about);

    if (!aboutContent || !profileData) {
        return;
    }

    clearElement(aboutContent);
    profileData.about.forEach(paragraph => appendTextElement(aboutContent, 'p', '', paragraph));
}

function renderExperienceSection(): void {
    const container = selectElement<HTMLElement>(selectors.experienceContainer);

    renderSectionHeader(selectors.experienceHeader, siteData?.sections.experience);

    if (!container) {
        return;
    }

    clearElement(container);
    experiencesData.forEach(experience => {
        const item = document.createElement('article');
        item.className = 'timeline-item content-card';

        const heading = document.createElement('div');
        heading.className = 'item-heading';
        appendTextElement(heading, 'h3', '', experience.position);
        appendTextElement(heading, 'p', 'item-date', `${experience.start} - ${experience.end || 'Present'}`);
        item.appendChild(heading);

        const meta = document.createElement('p');
        meta.className = 'item-meta';
        meta.appendChild(createAnchor(experience.company, experience.url || '#', 'inline-link'));
        meta.append(` / ${experience.location} / ${experience.workType}`);
        item.appendChild(meta);

        appendTextElement(item, 'p', 'item-description', experience.description);

        if (experience.responsibilities.length > 0) {
            const list = document.createElement('ul');
            list.className = 'bullet-list';
            experience.responsibilities.forEach(responsibility => appendTextElement(list, 'li', '', responsibility));
            item.appendChild(list);
        }

        container.appendChild(item);
    });
}

function renderEducationSection(): void {
    const container = selectElement<HTMLElement>(selectors.educationContainer);

    renderSectionHeader(selectors.educationHeader, siteData?.sections.education);
    if (!container) {
        return;
    }

    clearElement(container);
    educationData.forEach(education => {
        const card = document.createElement('article');
        card.className = 'content-card info-card';
        appendTextElement(card, 'h3', '', education.institution);
        appendTextElement(card, 'p', 'item-meta', `${education.degree} / ${education.field}`);
        appendTextElement(card, 'p', 'item-description', `${education.start} - ${education.end} / ${education.location}`);
        container.appendChild(card);
    });
}

function renderSkillsSection(): void {
    const container = selectElement<HTMLElement>(selectors.skillsContainer);

    renderSectionHeader(selectors.skillsHeader, siteData?.sections.skills);
    if (!container) {
        return;
    }

    clearElement(container);

    const skillBuckets = skillsData?.skills || {};
    Object.entries(skillBuckets).forEach(([category, skills]) => {
        const card = document.createElement('article');
        card.className = 'content-card skill-card';
        appendTextElement(card, 'h3', '', category);
        card.appendChild(createTagList(skills));
        container.appendChild(card);
    });

    if (Object.keys(skillBuckets).length === 0) {
        appendTextElement(container, 'p', 'section-summary', 'Skills data will be available soon.');
    }
}

function renderProjectsSection(): void {
    const container = selectElement<HTMLElement>(selectors.projectsContainer);

    renderSectionHeader(selectors.projectsHeader, siteData?.sections.projects);
    if (!container) {
        return;
    }

    clearElement(container);

    if (projectsData.length === 0) {
        const card = document.createElement('div');
        card.className = 'coming-soon-card content-card';
        appendTextElement(card, 'p', 'coming-soon-title', 'Coming soon.');
        container.appendChild(card);
        return;
    }

    projectsData.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card content-card';
        appendTextElement(card, 'p', 'project-status', project.status || 'Project');
        appendTextElement(card, 'h3', '', project.title);
        appendTextElement(card, 'p', 'project-description', project.description);
        card.appendChild(createTagList(project.technologies));

        if (project.links && project.links.length > 0) {
            const links = document.createElement('div');
            links.className = 'card-actions';
            project.links.forEach(link => links.appendChild(createAnchor(link.label, link.href, 'button-link')));
            card.appendChild(links);
        }

        container.appendChild(card);
    });
}

function createTagList(items: string[]): HTMLUListElement {
    const tags = document.createElement('ul');
    tags.className = 'tag-list';
    items.forEach(item => appendTextElement(tags, 'li', 'tag-pill', item));
    return tags;
}

function renderGitHubActivities(): void {
    const container = selectElement<HTMLElement>(selectors.githubContainer);

    renderSectionHeader(selectors.githubHeader, siteData?.sections.github);
    if (!container) {
        return;
    }

    clearElement(container);

    if (!githubCalendarData || githubCalendarData.weeks.length === 0) {
        appendTextElement(container, 'p', 'section-summary', 'Contributions will appear here once available.');
        return;
    }

    const { totalContributions, weeks } = githubCalendarData;
    const latestDay = [...weeks].reverse().flatMap(week => [...week.contributionDays].reverse())[0];
    const latestDate = latestDay ? formatDate(latestDay.date) : 'Unknown';

    const summary = document.createElement('div');
    summary.className = 'github-summary';
    appendTextElement(summary, 'div', 'github-total', totalContributions.toLocaleString());
    appendTextElement(summary, 'div', 'github-caption', `contributions in the last year / updated ${latestDate}`);
    container.appendChild(summary);

    const scroll = document.createElement('div');
    scroll.className = 'github-scroll';

    const months = document.createElement('div');
    months.className = 'calendar-months';
    weeks.forEach((week, index) => {
        const currentDate = new Date(`${week.firstDay}T00:00:00`);
        const previousDate = index > 0 ? new Date(`${weeks[index - 1].firstDay}T00:00:00`) : null;
        const monthChanged = !previousDate || currentDate.getMonth() !== previousDate.getMonth();
        appendTextElement(months, 'div', 'month-cell', monthChanged ? currentDate.toLocaleString(undefined, { month: 'short' }) : '');
    });

    const layout = document.createElement('div');
    layout.className = 'calendar-layout';

    const dayLabels = document.createElement('div');
    dayLabels.className = 'day-labels';
    ['Mon', 'Wed', 'Fri'].forEach(label => appendTextElement(dayLabels, 'span', '', label));

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    weeks.forEach((week: ContributionWeek) => {
        const column = document.createElement('div');
        column.className = 'week-column';
        week.contributionDays.forEach((day: ContributionDay) => column.appendChild(createContributionCell(day)));
        grid.appendChild(column);
    });

    layout.append(dayLabels, grid);
    scroll.append(months, layout);
    container.appendChild(scroll);
    container.appendChild(createGitHubLegend());
}

function createContributionCell(day: ContributionDay): HTMLDivElement {
    const block = document.createElement('div');
    const contributionText = `${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'} on ${formatDate(day.date)}`;

    block.className = 'day-cell activity-day';
    block.style.backgroundColor = contributionColor(day.contributionLevel);
    block.setAttribute('title', contributionText);
    block.setAttribute('aria-label', contributionText);

    return block;
}

function createGitHubLegend(): HTMLDivElement {
    const legend = document.createElement('div');
    legend.className = 'github-legend';
    appendTextElement(legend, 'span', '', 'Less');

    const colors = document.createElement('div');
    colors.className = 'legend-colors';
    ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'].forEach(level => {
        const square = document.createElement('span');
        square.className = 'day-cell';
        square.style.backgroundColor = contributionColor(level);
        colors.appendChild(square);
    });

    legend.appendChild(colors);
    appendTextElement(legend, 'span', '', 'More');
    return legend;
}

function contributionColor(level: string): string {
    const levelColorMap: Record<string, string> = {
        NONE: 'var(--github-none)',
        FIRST_QUARTILE: 'var(--github-first-quartile)',
        SECOND_QUARTILE: 'var(--github-second-quartile)',
        THIRD_QUARTILE: 'var(--github-third-quartile)',
        FOURTH_QUARTILE: 'var(--github-fourth-quartile)'
    };

    return levelColorMap[level] || levelColorMap.NONE;
}

function formatDate(date: string): string {
    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function renderContactSection(): void {
    if (!siteData) {
        return;
    }

    setText(selectors.contactEyebrow, siteData.contact.eyebrow);
    setText(selectors.contactTitle, siteData.contact.title);
    setText(selectors.contactBody, siteData.contact.body);

    const actions = selectElement<HTMLElement>(selectors.contactActions);
    if (!actions) {
        return;
    }

    clearElement(actions);
    siteData.contact.actions.forEach(action => {
        const href = resolveLinkUrl(action);
        const className = action.variant === 'primary' ? 'button-link primary' : 'button-link';
        actions.appendChild(createAnchor(action.label, href, className));
    });
}

function initPointerEffects(): void {
    return;
}

function initScrollEffects(): void {
    return;
}

function renderPortfolio(): void {
    updatePageTitle();
    renderNavigation();
    updateHeroSection();
    updateSocialLinks();
    renderAboutSection();
    renderExperienceSection();
    renderEducationSection();
    renderSkillsSection();
    renderProjectsSection();
    renderGitHubActivities();
    renderContactSection();
    updateFooter();
}

async function initPortfolio(): Promise<void> {
    await loadAllData();
    renderPortfolio();
    initScrollEffects();
}

function isTestRuntime(): boolean {
    const meta = import.meta as ImportMeta & { vitest?: unknown };
    const runtime = globalThis as typeof globalThis & {
        process?: {
            env?: Record<string, string | undefined>;
        };
    };

    return Boolean(meta.vitest || runtime.process?.env?.VITEST);
}

if (!isTestRuntime()) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            void initPortfolio();
        });
    } else {
        void initPortfolio();
    }
}

export {
    loadAllData,
    initPointerEffects,
    initScrollEffects,
    renderAboutSection,
    renderExperienceSection,
    renderEducationSection,
    renderSkillsSection,
    renderProjectsSection,
    renderGitHubActivities,
    renderContactSection,
    renderPortfolio,
    updatePageTitle,
    updateHeroSection,
    updateSocialLinks,
    updateFooter
};
