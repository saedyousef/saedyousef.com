/**
 * Created by yousef on 6/14/2025 at 3:02 PM
 * Description: main
 */
// Theme toggle
const toggle = document.getElementById('theme-toggle');
const setTheme = (dark) => {
    document.body.classList.toggle('dark', dark);
    toggle.checked = dark;
};
const storedTheme = localStorage.getItem('theme');
setTheme(storedTheme ? storedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
toggle.addEventListener('change', () => {
    const isDark = toggle.checked;
    setTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Timeline scroll animation
const timeline = document.querySelector('.timeline');
const cards = document.querySelectorAll('.timeline .card');

const updateLineProgress = () => {
    const active = Array.from(cards).filter(c => c.classList.contains('active'));
    if (!active.length) {
        timeline.style.setProperty('--line-progress', '0%');
        return;
    }
    const last = active[active.length - 1];
    const rect = last.getBoundingClientRect();
    const lineRect = timeline.getBoundingClientRect();
    const progress = ((rect.top + rect.height / 2) - lineRect.top) / lineRect.height * 100;
    timeline.style.setProperty('--line-progress', `${Math.min(progress, 100)}%`);
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
    updateLineProgress();
}, { threshold: 0.3 });

cards.forEach(card => observer.observe(card));
window.addEventListener('load', updateLineProgress);
