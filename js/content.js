document.addEventListener('DOMContentLoaded', () => {
    fetch('content.json')
        .then(res => res.json())
        .then(data => {
            if (data.about && window.setAboutText) {
                window.setAboutText(data.about.text);
            }

            const expContainer = document.getElementById('experience');
            if (expContainer && Array.isArray(data.experience)) {
                data.experience.forEach(exp => {
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
                const fragment = document.createDocumentFragment();
                Object.entries(data.skills).forEach(([section, skillList]) => {
                    const sectionDiv = document.createElement('div');
                    sectionDiv.className = 'skill-section';

                    const h3 = document.createElement('h3');
                    h3.textContent = section;
                    sectionDiv.appendChild(h3);

                    const list = document.createElement('div');
                    list.className = 'skills-list';

                    if (Array.isArray(skillList)) {
                        skillList.forEach(skill => {
                            const span = document.createElement('span');
                            span.className = 'skill-badge';
                            span.textContent = skill;
                            list.appendChild(span);
                        });
                    }

                    sectionDiv.appendChild(list);
                    fragment.appendChild(sectionDiv);
                });
                skillsContainer.appendChild(fragment);
            }

            if (window.initTimeline) {
                window.initTimeline();
            }
        })
        .catch(err => {
            console.error('Failed to load content.json', err);
        });
});
