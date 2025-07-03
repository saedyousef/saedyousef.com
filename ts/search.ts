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
  const closeHint = document.getElementById('close-hint');
  const input = document.getElementById('skill-search') as HTMLInputElement | null;
  const datalist = document.getElementById('skill-suggestions') as HTMLDataListElement | null;
  const autocomplete = document.getElementById('autocomplete-list');
  const results = document.getElementById('search-results');
  let skills: string[] = [];
  if (!wrapper || !input || !datalist || !hint || !autocomplete || !results || !closeHint) return;

  fetch('content.json')
    .then(r => r.json())
    .then((data: SkillsData) => {
      skills = flattenSkills(data);
      datalist.innerHTML = skills.map(s => `<option value="${s}"></option>`).join('');
    });

  const showSearch = () => {
    wrapper.style.display = 'block';
    wrapper.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' });
    input.focus();
    hint.style.display = 'none';
    closeHint.style.display = 'block';
    input.classList.add('active');
    wrapper.style.zIndex = '1000';
  };

  const hideSearch = () => {
    wrapper.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).onfinish = () => {
      wrapper.style.display = 'none';
      hint.style.display = '';
      closeHint.style.display = 'none';
      input.classList.remove('active');
      autocomplete.innerHTML = '';
      wrapper.style.zIndex = '';
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
    } else if (e.key === 'Escape' && wrapper.style.display === 'block') {
      hideSearch();
    }
  });

  const renderSuggestions = (query: string) => {
    if (!query) {
      autocomplete.innerHTML = '';
      return;
    }
    const filtered = skills.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 6);
    autocomplete.innerHTML = filtered.map(s => `<li>${s}</li>`).join('');
    autocomplete.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        input.value = li.textContent || '';
        autocomplete.innerHTML = '';
        input.focus();
      });
    });
  };

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
    const q = input.value.trim();
    highlight(q);
    const count = document.querySelectorAll('.skill-badge.highlight').length;
    results.textContent = count ? `Found ${count} result(s) for "${q}"` : `No results for "${q}"`;
    results.style.display = 'block';
    setTimeout(() => {
      results.style.display = 'none';
    }, 3000);
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  input.addEventListener('input', () => renderSuggestions(input.value));
  (document.getElementById('search-icon') as HTMLElement | null)?.addEventListener('click', performSearch);
}

if (typeof window !== 'undefined') {
  (window as any).initSkillSearch = initSkillSearch;
}
