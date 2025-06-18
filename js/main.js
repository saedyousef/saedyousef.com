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
window.initTimeline = function () {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    const cards = document.querySelectorAll('.timeline .card');

    let currentProgress = 0;
    let progressAnimation;

    const animateLine = (target) => {
        if (progressAnimation) cancelAnimationFrame(progressAnimation);
        const start = currentProgress;
        const delta = target - start;
        const duration = 1000; // ms - slow down the line animation
        let startTime;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const t = Math.min((timestamp - startTime) / duration, 1);
            const value = start + delta * t;
            timeline.style.setProperty('--line-progress', `${value}%`);
            if (t < 1) {
                progressAnimation = requestAnimationFrame(step);
            } else {
                currentProgress = target;
            }
        };

        progressAnimation = requestAnimationFrame(step);
    };

    const updateLineProgress = () => {
        const lineRect = timeline.getBoundingClientRect();
        const viewportBottom = window.scrollY + window.innerHeight;
        const progress = ((viewportBottom - lineRect.top) / lineRect.height) * 100;
        const target = Math.max(0, Math.min(progress, 100));
        // Only animate when moving downwards to keep progress visible
        if (target > currentProgress) {
            animateLine(target);
        }
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
    window.addEventListener('scroll', updateLineProgress);
};
