/**
 * Theme management utilities
 */

export function setTheme(dark: boolean, toggleEl: HTMLInputElement): void {
    document.body.classList.toggle('dark', dark);
    toggleEl.checked = dark;
}

export function initTheme(): void {
    const toggle = document.getElementById('theme-toggle') as HTMLInputElement;
    const storedTheme = localStorage.getItem('theme');
    setTheme(
        storedTheme ? storedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches,
        toggle
    );
    toggle.addEventListener('change', () => {
        const isDark = toggle.checked;
        setTheme(isDark, toggle);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

export async function loadThemeFromFile(path: string = 'datasets/theme.json'): Promise<void> {
    try {
        const res = await fetch(path);
        const data = await res.json();
        const root = document.documentElement;
        if (data.colors) {
            if (data.colors.accent) root.style.setProperty('--accent', data.colors.accent);
            if (data.colors.backgroundLight) root.style.setProperty('--bg-light', data.colors.backgroundLight);
            if (data.colors.backgroundDark) root.style.setProperty('--bg-dark', data.colors.backgroundDark);
            if (data.colors.textLight) root.style.setProperty('--text-light', data.colors.textLight);
            if (data.colors.textDark) root.style.setProperty('--text-dark', data.colors.textDark);
            if (data.colors.footerBg) root.style.setProperty('--footer-bg', data.colors.footerBg);
        }
        if (data.profilePhoto) {
            const img = document.querySelector('img.profile-photo') as HTMLImageElement | null;
            if (img) img.src = data.profilePhoto;
        }
    } catch (err) {
        console.error('Failed to load theme.json', err);
    }
}

if (typeof window !== 'undefined') {
    (window as any).initTheme = initTheme;
    (window as any).loadThemeFromFile = loadThemeFromFile;
}
