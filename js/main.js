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
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.timeline .card').forEach(card => observer.observe(card));
