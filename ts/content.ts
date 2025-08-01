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
        fetch('datasets/education.json').then(res => res.json())
    ])
        .then(([profile, exp, edu]) => {
            const data: SiteData = {
                ...(profile || {}),
                experience: exp?.experience,
                education: edu?.education
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

            if (data.about) {
                const bio = document.getElementById('bio-text');
                const aboutEl = document.getElementById('about-text');
                const html = data.about.text
                    .replace(/Development Team Lead/g, '<strong>Development Team Lead</strong>')
                    .replace(/DevOps/g, '<strong>DevOps</strong>');
                if (bio) bio.innerHTML = html;
                if (aboutEl) aboutEl.innerHTML = html;
            }

            const expContainer = document.getElementById('experience-list');
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

            const eduContainer = document.getElementById('education-list');
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

            // skills and terminal sections removed in new layout

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


        // github activity section removed in new layout
        })
        .catch(err => {
            console.error('Failed to load datasets', err);
        });
});
