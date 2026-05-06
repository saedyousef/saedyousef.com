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
let cursorTrailCleanup: (() => void) | null = null;

const fallbackProfileData: ProfileData = {
    name: 'Saed Yousef',
    title: 'Software Engineer',
    subtitle: 'I build reliable backend systems.',
    greeting: 'Backend systems',
    about: ['Profile data is currently unavailable.'],
    contact: {
        email: 'me@saedyousef.com',
        github: 'https://github.com/saedyousef',
        linkedin: 'https://www.linkedin.com/in/saedyousef',
        website: 'https://saedyousef.com'
    },
    footer: {
        text: 'Designed & Built by',
        showName: true
    }
};

const fallbackSiteData: SiteData = {
    canonicalDomain: 'saedyousef.com',
    sourceRepository: 'https://github.com/saedyousef/saedyousef.com',
    theme: 'Nitro-inspired portfolio',
    navigation: [
        { label: 'About', target: 'about' },
        { label: 'Experience', target: 'experience' },
        { label: 'Skills', target: 'skills' },
        { label: 'Contact', target: 'contact' }
    ],
    hero: {
        eyebrow: '',
        terminalTitle: 'profile.json',
        actions: [
            { label: 'View experience', href: '#experience', variant: 'primary' },
            { label: 'Say hello', urlKey: 'email', variant: 'secondary' }
        ]
    },
    sections: {
        about: {
            number: '01',
            title: 'About',
            eyebrow: 'Profile',
            techIntro: 'Current working set'
        },
        experience: {
            number: '02',
            title: 'Experience',
            eyebrow: 'Work'
        },
        education: {
            number: '03',
            title: 'Education',
            eyebrow: 'Foundation'
        },
        skills: {
            number: '04',
            title: 'Skills',
            eyebrow: 'Toolbox'
        },
        projects: {
            number: '05',
            title: 'Projects',
            eyebrow: 'Selected work'
        },
        github: {
            number: '06',
            title: 'GitHub Activity',
            eyebrow: 'Contributions'
        }
    },
    socialLinks: [
        { id: 'github', label: 'GitHub', urlKey: 'github', icon: 'github' },
        { id: 'linkedin', label: 'LinkedIn', urlKey: 'linkedin', icon: 'linkedin' },
        { id: 'email', label: 'Email', urlKey: 'email', icon: 'email' }
    ],
    contact: {
        eyebrow: 'Contact',
        title: 'Let us build reliable systems.',
        body: 'Send a message and I will get back to you.',
        actions: [
            { label: 'Say hello', urlKey: 'email', variant: 'primary' }
        ]
    }
};

const iconMap: Record<SocialLink['icon'], string> = {
    github: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.53.12-3.18 0 0 1-.32 3.3 1.23a11.48 11.48 0 0 1 6 0C14.3 4.63 15.3 4.95 15.3 4.95c.66 1.65.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.23v3.31c0 .32.21.7.83.58A12 12 0 0 0 12 .5Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.54V9H7.1v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>',
    code: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 5-4 14"/></svg>'
};

type UiIconName = 'briefcase' | 'calendar' | 'location' | 'remote' | 'school' | 'spark' | 'sun' | 'moon';

const uiIconMap: Record<UiIconName, string> = {
    briefcase: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"/><path d="M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z"/><path d="M3 13h18"/><path d="M10 13v2h4v-2"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v4"/><path d="M17 3v4"/><path d="M4 8h16"/><path d="M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/></svg>',
    location: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>',
    remote: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v10H4z"/><path d="M8 19h8"/><path d="M12 15v4"/></svg>',
    school: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M7 11.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-4.5"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 9.8 8.8 4 11l5.8 2.2L12 19l2.2-5.8L20 11l-5.8-2.2L12 3Z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z"/></svg>'
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

function getElement<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

function clearElement(element: HTMLElement): void {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function setText(id: string, value: string): void {
    const element = getElement(id);

    if (element) {
        element.textContent = value;
    }
}

function setOptionalText(id: string, value: string): void {
    const element = getElement(id);

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

function createAnchor(label: string, href: string, className: string): HTMLAnchorElement {
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

function createIconAnchor(link: SocialLink): HTMLAnchorElement {
    const anchor = createAnchor('', resolveLinkUrl(link), 'icon-link');
    anchor.setAttribute('aria-label', link.label);
    anchor.innerHTML = iconMap[link.icon];
    return anchor;
}

function createUiIcon(name: UiIconName): HTMLSpanElement {
    const icon = document.createElement('span');
    icon.className = 'meta-icon';
    icon.innerHTML = uiIconMap[name];
    return icon;
}

function createMetaChip(icon: UiIconName, text: string): HTMLSpanElement {
    const chip = document.createElement('span');
    chip.className = 'meta-chip';
    chip.append(createUiIcon(icon), document.createTextNode(text));
    return chip;
}

function renderSectionHeader(containerId: string, section?: SiteSection): void {
    const container = getElement(containerId);

    if (!container || !section) {
        return;
    }

    clearElement(container);
    appendTextElement(container, 'p', 'section-kicker', section.eyebrow);

    const title = document.createElement('h2');
    title.className = 'section-title';

    const number = document.createElement('span');
    number.className = 'section-number';
    number.textContent = section.number;

    const label = document.createElement('span');
    label.textContent = section.title;

    title.append(number, label);
    container.appendChild(title);
    if (section.summary) {
        appendTextElement(container, 'p', 'section-summary', section.summary);
    }
}

function updatePageTitle(): void {
    if (!profileData) {
        return;
    }

    const titleText = profileData.title ? `${profileData.name} | ${profileData.title}` : profileData.name;
    setText('page-title', titleText);
    document.title = titleText;
}

function renderNavigation(): void {
    const nav = getElement('site-nav');
    const brand = getElement('site-brand');

    if (brand && profileData) {
        brand.textContent = profileData.name
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

    siteData.navigation.forEach((item) => {
        const anchor = createAnchor(item.label, `#${item.target}`, '');
        nav.appendChild(anchor);
    });
}

function updateHeroSection(): void {
    if (!profileData || !siteData) {
        return;
    }

    setOptionalText('hero-greeting', siteData.hero.eyebrow || '');
    setText('hero-name', profileData.name);
    setText('hero-subtitle', profileData.subtitle || profileData.title);
    setText('hero-description', profileData.about[0] || '');

    const actions = getElement('hero-actions');
    if (actions) {
        clearElement(actions);
        siteData.hero.actions.forEach(action => {
            const href = resolveLinkUrl(action);
            const anchor = createAnchor(action.label, href, `button-link ${action.variant === 'primary' ? 'primary' : ''}`.trim());
            actions.appendChild(anchor);
        });
    }

    renderHeroTerminal();
}

function renderHeroTerminal(): void {
    const terminal = getElement('hero-meta');

    if (!terminal || !profileData || !siteData) {
        return;
    }

    const rows: Array<{ label: string; value: string; href?: string }> = [
        { label: 'name', value: profileData.name },
        { label: 'title', value: profileData.title },
        { label: 'experience', value: '9+ years' },
        { label: 'domain', value: siteData.canonicalDomain, href: profileData.contact.website },
        { label: 'email', value: profileData.contact.email, href: `mailto:${profileData.contact.email}` },
        { label: 'source', value: 'GitHub repository', href: siteData.sourceRepository }
    ];

    clearElement(terminal);

    rows.forEach(({ label, value, href }) => {
        const row = document.createElement('dl');
        row.className = 'terminal-row';
        appendTextElement(row, 'dt', '', label);

        const description = document.createElement('dd');
        if (href) {
            description.appendChild(createAnchor(value, href, 'terminal-link'));
        } else {
            description.textContent = value;
        }

        row.appendChild(description);
        terminal.appendChild(row);
    });
}

function updateSocialLinks(): void {
    if (!profileData || !siteData) {
        return;
    }

    const leftSidebar = getElement('social-links-left');
    const mobileSocial = getElement('social-links-mobile');
    const rightSidebar = getElement('social-links-right');
    const socialLinks = siteData.socialLinks;

    [leftSidebar, mobileSocial].forEach(container => {
        if (!container) {
            return;
        }

        clearElement(container);
        socialLinks.forEach(link => container.appendChild(createIconAnchor(link)));
    });

    if (rightSidebar) {
        clearElement(rightSidebar);
        const anchor = createAnchor(profileData.contact.email, `mailto:${profileData.contact.email}`, '');
        rightSidebar.appendChild(anchor);
    }
}

function updateFooter(): void {
    const footer = getElement('footer-text');

    if (!footer || !profileData || !siteData) {
        return;
    }

    clearElement(footer);

    const footerConfig = profileData.footer || { text: 'Designed & Built by', showName: true };
    footer.append(document.createTextNode(`${footerConfig.text}${footerConfig.showName ? ` ${profileData.name}` : ''} | `));

    const websiteDomain = profileData.contact.website.replace(/^https?:\/\//, '');
    footer.appendChild(createAnchor(websiteDomain, profileData.contact.website, ''));
    if (siteData.footerNote) {
        footer.append(document.createTextNode(` | ${siteData.footerNote}`));
    }
}

function renderAboutSection(): void {
    const aboutContent = getElement('about-content');
    const techIntro = getElement('tech-intro');
    const techList = getElement('tech-list');

    renderSectionHeader('about-header', siteData?.sections.about);

    if (aboutContent && profileData) {
        clearElement(aboutContent);
        profileData.about.forEach(paragraph => appendTextElement(aboutContent, 'p', '', paragraph));
    }

    if (techIntro) {
        techIntro.textContent = siteData?.sections.about.techIntro || 'Technologies';
    }

    if (!techList) {
        return;
    }

    clearElement(techList);

    const skillBuckets = skillsData?.skills || {};
    const technologies = Array.from(new Set(Object.values(skillBuckets).flat().filter(Boolean))).slice(0, 14);

    if (technologies.length === 0) {
        appendTextElement(techList, 'li', '', 'Technologies data will be available soon.');
        return;
    }

    technologies.forEach(technology => appendTextElement(techList, 'li', '', technology));
}

function renderExperienceSection(): void {
    const container = getElement('experience-container');

    renderSectionHeader('experience-header', siteData?.sections.experience);

    if (!container) {
        return;
    }

    clearElement(container);

    experiencesData.forEach(experience => {
        const item = document.createElement('article');
        item.className = 'timeline-item';

        const meta = document.createElement('div');
        meta.className = 'timeline-meta';
        meta.appendChild(createMetaChip('calendar', `${experience.start} - ${experience.end || 'Present'}`));

        const content = document.createElement('div');
        content.className = 'timeline-content';

        appendTextElement(content, 'h3', '', experience.position);

        const metaList = document.createElement('div');
        metaList.className = 'meta-list';
        metaList.appendChild(createMetaChip('briefcase', experience.company));
        if (experience.location) {
            metaList.appendChild(createMetaChip('location', experience.location));
        }
        if (experience.workType) {
            metaList.appendChild(createMetaChip('remote', experience.workType));
        }
        content.appendChild(metaList);

        appendTextElement(content, 'p', 'timeline-description', experience.description);

        if (experience.responsibilities.length > 0) {
            const list = document.createElement('ul');
            list.className = 'bullet-list';
            experience.responsibilities.forEach(responsibility => appendTextElement(list, 'li', '', responsibility));
            content.appendChild(list);
        }

        item.append(meta, content);
        container.appendChild(item);
    });
}

function renderEducationSection(): void {
    const container = getElement('education-container');

    renderSectionHeader('education-header', siteData?.sections.education);

    if (!container) {
        return;
    }

    clearElement(container);

    educationData.forEach(education => {
        const card = document.createElement('article');
        card.className = 'info-card';
        const heading = document.createElement('div');
        heading.className = 'card-heading';
        heading.appendChild(createUiIcon('school'));
        appendTextElement(heading, 'h3', '', education.institution);
        card.appendChild(heading);
        appendTextElement(card, 'p', 'info-meta', `${education.degree} / ${education.field}`);
        appendTextElement(card, 'p', 'timeline-description', `${education.start} - ${education.end} / ${education.location}`);
        container.appendChild(card);
    });
}

function renderSkillsSection(): void {
    const container = getElement('skills-container');

    renderSectionHeader('skills-header', siteData?.sections.skills);

    if (!container) {
        return;
    }

    clearElement(container);

    const skillBuckets = skillsData?.skills || {};

    Object.entries(skillBuckets).forEach(([category, skills]) => {
        const card = document.createElement('article');
        card.className = 'skill-card';
        appendTextElement(card, 'h3', '', category);

        const list = document.createElement('ul');
        list.className = 'tag-list';
        skills.forEach(skill => appendTextElement(list, 'li', 'tag-pill', skill));
        card.appendChild(list);
        container.appendChild(card);
    });

    if (Object.keys(skillBuckets).length === 0) {
        appendTextElement(container, 'p', 'section-summary', 'Skills data will be available soon.');
    }
}

function renderProjectsSection(): void {
    const container = getElement('projects-container');

    renderSectionHeader('projects-header', siteData?.sections.projects);

    if (!container) {
        return;
    }

    clearElement(container);

    if (projectsData.length === 0) {
        const card = document.createElement('article');
        card.className = 'project-card coming-soon-card';
        const icon = document.createElement('div');
        icon.className = 'coming-soon-icon';
        icon.appendChild(createUiIcon('spark'));
        card.appendChild(icon);
        appendTextElement(card, 'h3', 'coming-soon-title', 'Coming soon..');
        appendTextElement(card, 'p', 'project-description', 'Projects will be added here soon.');
        container.appendChild(card);
        return;
    }

    projectsData.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card';
        appendTextElement(card, 'p', 'project-status', project.status || 'Project');
        appendTextElement(card, 'h3', '', project.title);
        appendTextElement(card, 'p', 'project-description', project.description);

        const tags = document.createElement('ul');
        tags.className = 'tag-list';
        project.technologies.forEach(technology => appendTextElement(tags, 'li', 'tag-pill', technology));
        card.appendChild(tags);

        if (project.links && project.links.length > 0) {
            const links = document.createElement('div');
            links.className = 'hero-actions';
            project.links.forEach(link => links.appendChild(createAnchor(link.label, link.href, 'button-link')));
            card.appendChild(links);
        }

        container.appendChild(card);
    });
}

function renderGitHubActivities(): void {
    const container = getElement('github-activities-container');

    renderSectionHeader('github-header', siteData?.sections.github);

    if (!container) {
        return;
    }

    clearElement(container);

    if (!githubCalendarData || githubCalendarData.weeks.length === 0) {
        appendTextElement(container, 'p', 'section-summary', 'GitHub activity will appear here once available.');
        return;
    }

    const { totalContributions, weeks } = githubCalendarData;
    const latestDay = [...weeks].reverse().flatMap(week => [...week.contributionDays].reverse())[0];
    const latestDate = latestDay ? formatDate(latestDay.date) : 'Unknown';

    const summary = document.createElement('div');
    summary.className = 'github-summary';

    const summaryCopy = document.createElement('div');
    appendTextElement(summaryCopy, 'div', 'github-total', totalContributions.toLocaleString());
    appendTextElement(summaryCopy, 'div', 'github-caption', 'contributions in the last year');
    appendTextElement(summary, 'div', 'github-updated', `Updated ${latestDate}`);
    summary.prepend(summaryCopy);
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
    grid.setAttribute('data-role', 'github-calendar-grid');

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

    block.className = 'day-cell';
    block.style.backgroundColor = contributionColor(day.contributionLevel);
    block.setAttribute('data-activity-day', day.date);
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
        NONE: '#111827',
        FIRST_QUARTILE: '#0f766e',
        SECOND_QUARTILE: '#0891b2',
        THIRD_QUARTILE: '#22d3ee',
        FOURTH_QUARTILE: '#a78bfa'
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

    setText('contact-eyebrow', siteData.contact.eyebrow);
    setText('contact-title', siteData.contact.title);
    setText('contact-body', siteData.contact.body);

    const actions = getElement('contact-actions');

    if (!actions) {
        return;
    }

    clearElement(actions);
    siteData.contact.actions.forEach(action => {
        const href = resolveLinkUrl(action);
        const anchor = createAnchor(action.label, href, `button-link ${action.variant === 'primary' ? 'primary' : ''}`.trim());
        actions.appendChild(anchor);
    });
}

function initPointerEffects(): void {
    if (!isCursorEffectSupported()) {
        stopPointerEffects();
        return;
    }

    cursorTrailCleanup?.();
    cursorTrailCleanup = null;
    void initChromaFlowTrail();
}

function stopPointerEffects(): void {
    cursorTrailCleanup?.();
    cursorTrailCleanup = null;

    const canvas = getElement<HTMLCanvasElement>('cursor-trail');

    if (canvas) {
        canvas.hidden = true;
    }
}

function isCursorEffectSupported(): boolean {
    const isReducedMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
    const hasWebGPU = 'gpu' in navigator;
    const deviceMemory = 'deviceMemory' in navigator ? Number(navigator.deviceMemory) : undefined;
    const isLowMemory = deviceMemory !== undefined && deviceMemory < 4;
    const isLowCore = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4;

    return hasWebGPU && !isReducedMotion && !isMobile && !isLowMemory && !isLowCore;
}

async function initChromaFlowTrail(): Promise<void> {
    const existingCanvas = getElement<HTMLCanvasElement>('cursor-trail');

    if (!existingCanvas) {
        return;
    }

    if (!isCursorEffectSupported()) {
        existingCanvas.hidden = true;
        return;
    }

    const canvas = existingCanvas.cloneNode(false) as HTMLCanvasElement;
    canvas.hidden = false;
    existingCanvas.replaceWith(canvas);

    try {
        const { createShader } = await import('shaders/js');
        const shader = await createShader(canvas, {
            components: [
                {
                    type: 'ChromaFlow',
                    id: 'cursorChromaFlow',
                    props: {
                        baseColor: 'oklch(71.2% 0.194 13.428)',
                        upColor: 'oklch(70.2% 0.183 293.541)',
                        downColor: 'oklch(70.2% 0.183 293.541)',
                        rightColor: 'oklch(70.2% 0.183 293.541)',
                        leftColor: 'oklch(70.2% 0.183 293.541)',
                        opacity: 0.5,
                        intensity: 0.7
                    }
                }
            ]
        }, {
            colorSpace: 'p3-linear',
            disableTelemetry: true,
            enablePerformanceTracking: false
        });

        cursorTrailCleanup = () => {
            shader.destroy();
            cursorTrailCleanup = null;
        };

        window.addEventListener('pagehide', () => {
            cursorTrailCleanup?.();
        }, { once: true });
    } catch (error) {
        console.error('Failed to initialize ChromaFlow cursor effect.', error);
        canvas.hidden = true;
    }
}

function getPreferredEffectsEnabled(): boolean {
    try {
        const storage = window.localStorage;
        return typeof storage?.getItem === 'function' && storage.getItem('cursorEffects') === 'enabled';
    } catch {
        return false;
    }
}

function updateEffectsToggle(enabled: boolean, supported = isCursorEffectSupported()): void {
    const toggle = getElement<HTMLButtonElement>('effects-toggle');
    const label = getElement('effects-toggle-label');
    const icon = getElement('effects-toggle-icon');

    if (!toggle) {
        return;
    }

    toggle.disabled = !supported;
    toggle.setAttribute('aria-pressed', enabled && supported ? 'true' : 'false');
    toggle.setAttribute('aria-label', `${enabled && supported ? 'Disable' : 'Enable'} cursor effects`);
    toggle.title = supported ? 'Toggle cursor effects' : 'Cursor effects require WebGPU on a desktop browser.';

    if (label) {
        label.textContent = enabled && supported ? 'Effects On' : 'Effects Off';
    }

    if (icon) {
        icon.innerHTML = uiIconMap.spark;
    }
}

function setEffectsEnabled(enabled: boolean): void {
    const supported = isCursorEffectSupported();

    try {
        const storage = window.localStorage;
        if (typeof storage?.setItem === 'function') {
            storage.setItem('cursorEffects', enabled ? 'enabled' : 'disabled');
        }
    } catch {
        // The toggle still works for the current page load if storage is unavailable.
    }

    if (enabled && supported) {
        initPointerEffects();
    } else {
        stopPointerEffects();
    }

    updateEffectsToggle(enabled, supported);
}

function initEffectsToggle(): void {
    const toggle = getElement<HTMLButtonElement>('effects-toggle');
    const enabled = getPreferredEffectsEnabled();

    setEffectsEnabled(enabled);

    if (!toggle || toggle.dataset.bound === 'true') {
        return;
    }

    toggle.dataset.bound = 'true';
    toggle.addEventListener('click', () => {
        const nextEnabled = toggle.getAttribute('aria-pressed') !== 'true';
        setEffectsEnabled(nextEnabled);
    });
}

function getPreferredTheme(): 'dark' | 'light' {
    try {
        const storage = window.localStorage;
        const storedTheme = typeof storage?.getItem === 'function' ? storage.getItem('theme') : null;
        return storedTheme === 'light' ? 'light' : 'dark';
    } catch {
        return 'dark';
    }
}

function updateThemeToggle(theme: 'dark' | 'light'): void {
    const toggle = getElement<HTMLButtonElement>('theme-toggle');
    const label = getElement('theme-toggle-label');
    const icon = getElement('theme-toggle-icon');

    if (!toggle) {
        return;
    }

    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
    toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');

    if (label) {
        label.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }

    if (icon) {
        icon.innerHTML = uiIconMap[theme === 'dark' ? 'moon' : 'sun'];
    }
}

function applyTheme(theme: 'dark' | 'light'): void {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#050816' : '#f8fafc');
    try {
        const storage = window.localStorage;
        if (typeof storage?.setItem === 'function') {
            storage.setItem('theme', theme);
        }
    } catch {
        document.documentElement.dataset.theme = theme;
    }
    updateThemeToggle(theme);
}

function initThemeToggle(): void {
    const toggle = getElement<HTMLButtonElement>('theme-toggle');
    applyTheme(getPreferredTheme());

    if (!toggle || toggle.dataset.bound === 'true') {
        return;
    }

    toggle.dataset.bound = 'true';
    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
}

function initScrollEffects(): void {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(element => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });

    revealElements.forEach(element => observer.observe(element));
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
    initThemeToggle();
    initEffectsToggle();
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
