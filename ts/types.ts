/**
 * Type definitions for the portfolio data structures
 */

export interface ProfileData {
    name: string;
    title: string;
    subtitle?: string;
    greeting?: string;
    about: string[];
    contact: {
        email: string;
        github: string;
        linkedin: string;
        website: string;
    };
    footer?: {
        text: string;
        showName: boolean;
    };
}

export interface SiteLink {
    label: string;
    href?: string;
    url?: string;
    urlKey?: keyof ProfileData['contact'];
    variant?: 'primary' | 'secondary';
}

export interface NavigationItem {
    label: string;
    target: string;
}

export interface SiteSection {
    number: string;
    title: string;
    eyebrow: string;
    summary?: string;
    techIntro?: string;
}

export interface SocialLink {
    id: string;
    label: string;
    url?: string;
    urlKey?: keyof ProfileData['contact'];
    icon: 'github' | 'linkedin' | 'email' | 'code';
}

export interface SiteData {
    canonicalDomain: string;
    sourceRepository: string;
    theme?: string;
    footerNote?: string;
    navigation: NavigationItem[];
    hero: {
        eyebrow: string;
        terminalTitle: string;
        actions: SiteLink[];
    };
    sections: Record<string, SiteSection>;
    socialLinks: SocialLink[];
    contact: {
        eyebrow: string;
        title: string;
        body: string;
        actions: SiteLink[];
    };
}

export interface Experience {
    company: string;
    position: string;
    location: string;
    start: string;
    end: string | null;
    workType: string;
    description: string;
    responsibilities: string[];
}

export interface Education {
    institution: string;
    degree: string;
    field: string;
    start: string;
    end: string;
    location: string;
}

export interface Skill {
    category: string;
    items: string[];
}

export interface Skills {
    skills: Record<string, string[]>;
}

export interface Project {
    title: string;
    description: string;
    status?: string;
    technologies: string[];
    links?: Array<{
        label: string;
        href: string;
    }>;
}

export type ContributionLevel = 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';

export interface ContributionDay {
    date: string;
    contributionCount: number;
    contributionLevel: ContributionLevel;
}

export interface ContributionWeek {
    firstDay: string;
    contributionDays: ContributionDay[];
}

export interface GitHubContributionCalendar {
    totalContributions: number;
    weeks: ContributionWeek[];
}
