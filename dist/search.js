function flattenSkills(data) {
    const all = [];
    if (data.skills) {
        Object.values(data.skills).forEach(list => {
            if (Array.isArray(list))
                all.push(...list);
        });
    }
    return Array.from(new Set(all));
}
export function initSkillSearch() {
    var _a;
    const wrapper = document.getElementById('search-wrapper');
    const hint = document.getElementById('search-hint');
    const input = document.getElementById('skill-search');
    const datalist = document.getElementById('skill-suggestions');
    if (!wrapper || !input || !datalist || !hint)
        return;
    fetch('content.json')
        .then(r => r.json())
        .then((data) => {
        const skills = flattenSkills(data);
        datalist.innerHTML = skills.map(s => `<option value="${s}"></option>`).join('');
    });
    const showSearch = () => {
        wrapper.style.display = 'block';
        wrapper.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' });
        input.focus();
        hint.style.display = 'none';
    };
    const hideSearch = () => {
        wrapper.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).onfinish = () => {
            wrapper.style.display = 'none';
            hint.style.display = '';
        };
    };
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (wrapper.style.display === 'none' || wrapper.style.display === '') {
                showSearch();
            }
            else {
                hideSearch();
            }
        }
    });
    const highlight = (query) => {
        const badges = document.querySelectorAll('.skill-badge');
        badges.forEach(b => {
            const el = b;
            if (query && el.textContent && el.textContent.toLowerCase().includes(query.toLowerCase())) {
                el.classList.add('highlight');
            }
            else {
                el.classList.remove('highlight');
            }
        });
    };
    const performSearch = () => {
        highlight(input.value.trim());
    };
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    (_a = document.getElementById('search-icon')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', performSearch);
}
if (typeof window !== 'undefined') {
    window.initSkillSearch = initSkillSearch;
}
