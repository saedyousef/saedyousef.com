interface SkillsData {
  skills?: Record<string, string[]>;
}

function flattenSkills(data: SkillsData): string[] {
  const all: string[] = [];
  if (data.skills) {
    Object.values(data.skills).forEach(list => {
      if (Array.isArray(list)) all.push(...list);
    });
  }
  return Array.from(new Set(all));
}

export function initSkillSearch(): void {
  const wrapper = document.getElementById('search-wrapper');
  const hint = document.getElementById('search-hint');
  const input = document.getElementById('skill-search') as HTMLInputElement | null;
  const datalist = document.getElementById('skill-suggestions') as HTMLDataListElement | null;
  if (!wrapper || !input || !datalist || !hint) return;

  fetch('content.json')
    .then(r => r.json())
    .then((data: SkillsData) => {
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
      } else {
        hideSearch();
      }
    }
  });

  const highlight = (query: string) => {
    const badges = document.querySelectorAll('.skill-badge');
    badges.forEach(b => {
      const el = b as HTMLElement;
      if (query && el.textContent && el.textContent.toLowerCase().includes(query.toLowerCase())) {
        el.classList.add('highlight');
      } else {
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
  (document.getElementById('search-icon') as HTMLElement | null)?.addEventListener('click', performSearch);
}

if (typeof window !== 'undefined') {
  (window as any).initSkillSearch = initSkillSearch;
}
