interface SiteData {
    name?: string;
    tagline?: string;
    headers?: Record<string, string>;
    about?: { text: string };
    experience?: any[];
    education?: any[];
    skills?: Record<string, string[]>;
    terminal?: {
        user?: string;
        host?: string;
    };
    links?: {
        github?: string;
        linkedin?: string;
        repo?: string;
    };
}

document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        fetch('datasets/profile.json').then(res => res.json()),
        fetch('datasets/experiences.json').then(res => res.json()),
        fetch('datasets/education.json').then(res => res.json()),
        fetch('datasets/skills.json').then(res => res.json())
    ])
        .then(([profile, exp, edu, skills]) => {
            const data: SiteData = {
                ...(profile || {}),
                experience: exp?.experience,
                education: edu?.education,
                skills: skills?.skills
            };
            if (data.name) {
                const nameEl = document.getElementById('name');
                if (nameEl) nameEl.textContent = data.name;
            }

            if (data.tagline) {
                const taglineEl = document.getElementById('tagline');
                if (taglineEl) taglineEl.textContent = data.tagline;
            }

            if (data.headers && typeof data.headers === 'object') {
                Object.entries(data.headers).forEach(([key, text]) => {
                    const el = document.getElementById(`${key}-header`);
                    if (el) el.textContent = text as string;
                });
            }

            if (data.about && (window as any).setAboutText) {
                (window as any).setAboutText(data.about.text);
            }

            const expContainer = document.getElementById('experience');
            if (expContainer && Array.isArray(data.experience)) {
                data.experience.forEach((exp) => {
                    const card = document.createElement('div');
                    card.className = 'card';

                    const h3 = document.createElement('h3');
                    h3.textContent = `${exp.position} – ${exp.company}`;
                    card.appendChild(h3);

                    const p1 = document.createElement('p');
                    const end = exp.end || 'Present';
                    const work = exp.workType ? ` (${exp.workType})` : '';
                    const loc = exp.location ? ` · ${exp.location}` : '';
                    p1.innerHTML = `<strong>${exp.start} – ${end}</strong>${loc}${work}`;
                    card.appendChild(p1);

                    const p2 = document.createElement('p');
                    p2.textContent = exp.description;
                    card.appendChild(p2);

                    if (Array.isArray(exp.responsibilities) && exp.responsibilities.length) {
                        const ul = document.createElement('ul');
                        exp.responsibilities.forEach(r => {
                            const li = document.createElement('li');
                            li.textContent = r;
                            ul.appendChild(li);
                        });
                        card.appendChild(ul);
                    }

                    expContainer.appendChild(card);
                });
            }

            const eduContainer = document.getElementById('education');
            if (eduContainer && Array.isArray(data.education)) {
                data.education.forEach(edu => {
                    const card = document.createElement('div');
                    card.className = 'card';

                    const h3 = document.createElement('h3');
                    h3.textContent = edu.institution;
                    card.appendChild(h3);

                    const p1 = document.createElement('p');
                    p1.innerHTML = `<strong>${edu.degree} in ${edu.field}</strong>`;
                    card.appendChild(p1);

                    const p2 = document.createElement('p');
                    p2.textContent = `${edu.start} – ${edu.end} · ${edu.location}`;
                    card.appendChild(p2);

                    eduContainer.appendChild(card);
                });
            }

            const skillsContainer = document.getElementById('skills');
            if (skillsContainer && data.skills && typeof data.skills === 'object') {
                // Clear previous content in case the script runs more than once
                skillsContainer.innerHTML = '';

                const wrapper = document.createElement('div');
                wrapper.className = 'skills-rows';

                const allSkills: string[] = [];
                Object.values(data.skills).forEach(skillList => {
                    if (Array.isArray(skillList)) {
                        allSkills.push(...skillList);
                    }
                });

                const createRow = (dir: 'left' | 'right', skills: string[]) => {
                    const row = document.createElement('div');
                    row.className = 'skills-row' + (dir === 'right' ? ' row-right' : ' row-left');
                    const track = document.createElement('div');
                    track.className = 'skill-track';
                    skills.forEach(skill => {
                        const span = document.createElement('span');
                        span.className = 'skill-badge';
                        span.textContent = skill;
                        track.appendChild(span);
                    });
                    // Duplicate for seamless scrolling
                    skills.forEach(skill => {
                        const span = document.createElement('span');
                        span.className = 'skill-badge';
                        span.textContent = skill;
                        track.appendChild(span);
                    });
                    row.appendChild(track);
                    return row;
                };

                wrapper.appendChild(createRow('left', allSkills));
                wrapper.appendChild(createRow('right', allSkills));
                const reversed = [...allSkills].reverse();
                wrapper.appendChild(createRow('left', reversed));

                skillsContainer.appendChild(wrapper);
            }

            if (data.terminal) {
                const user = data.terminal.user || '';
                const host = data.terminal.host || '';
                const full = user && host ? `${user}@${host}` : user || host;
                const toolbar = document.getElementById('terminal-toolbar');
                if (toolbar) toolbar.textContent = `${full}: ~`;
                const span = document.getElementById('terminal-user');
                if (span) span.textContent = `${full}:`;
            }

            if (data.links) {
                const gh = document.getElementById('github-link') as HTMLAnchorElement | null;
                if (gh && data.links.github) gh.href = data.links.github;
                const li = document.getElementById('linkedin-link') as HTMLAnchorElement | null;
                if (li && data.links.linkedin) li.href = data.links.linkedin;
                const designer = document.getElementById('designer-link') as HTMLAnchorElement | null;
                if (designer && data.links.github) designer.href = data.links.github;
                const repo = document.getElementById('github-star') as HTMLAnchorElement | null;
                if (repo && data.links.repo) repo.href = data.links.repo;
            }


        // Load GitHub activity component if container exists
        const activityContainer = document.getElementById('activity');
            if (activityContainer) {
                fetch('datasets/github_activities.json')
                    .then(res => res.json())
                    .then(calendar => {
                        if (calendar && Array.isArray(calendar.weeks)) {
                            const levelMap: Record<string, string> = {
                                NONE: '0',
                                FIRST_QUARTILE: '1',
                                SECOND_QUARTILE: '2',
                                THIRD_QUARTILE: '3',
                                FOURTH_QUARTILE: '4'
                            };
                            const table = document.createElement('table');
                            for (let i = 0; i < 7; i++) {
                                const tr = document.createElement('tr');
                                calendar.weeks.forEach((week: any) => {
                                    const day = week.contributionDays ? week.contributionDays[i] : undefined;
                                    const td = document.createElement('td');
                                    td.className = 'ContributionCalendar-day';
                                    if (day) {
                                        td.dataset.level = levelMap[day.contributionLevel] || '0';
                                        td.title = `${day.contributionCount} contributions on ${day.date}`;
                                    } else {
                                        td.dataset.level = '0';
                                        td.title = '';
                                    }
                                    tr.appendChild(td);
                                });
                                table.appendChild(tr);
                            }
                            activityContainer.innerHTML = '';
                            activityContainer.appendChild(table);
                        }
                    })
                    .catch(err => console.error('Failed to load github_activities.json', err));
            }
        })
        .catch(err => {
            console.error('Failed to load datasets', err);
        });
});
