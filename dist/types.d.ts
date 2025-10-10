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
    technologies: string[];
    github?: string;
    live?: string;
    image?: string;
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
//# sourceMappingURL=types.d.ts.map