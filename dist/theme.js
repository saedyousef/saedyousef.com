/**
 * Theme management utilities
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function setTheme(dark, toggleEl) {
    document.body.classList.toggle('dark', dark);
    toggleEl.checked = dark;
}
export function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme');
    setTheme(storedTheme ? storedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches, toggle);
    toggle.addEventListener('change', () => {
        const isDark = toggle.checked;
        setTheme(isDark, toggle);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}
export function loadThemeFromFile() {
    return __awaiter(this, arguments, void 0, function* (path = 'datasets/theme.json') {
        try {
            const res = yield fetch(path);
            const data = yield res.json();
            const root = document.documentElement;
            if (data.colors) {
                if (data.colors.accent)
                    root.style.setProperty('--accent', data.colors.accent);
                if (data.colors.backgroundLight)
                    root.style.setProperty('--bg-light', data.colors.backgroundLight);
                if (data.colors.backgroundDark)
                    root.style.setProperty('--bg-dark', data.colors.backgroundDark);
                if (data.colors.textLight)
                    root.style.setProperty('--text-light', data.colors.textLight);
                if (data.colors.textDark)
                    root.style.setProperty('--text-dark', data.colors.textDark);
                if (data.colors.footerBg)
                    root.style.setProperty('--footer-bg', data.colors.footerBg);
            }
            if (data.profilePhoto) {
                const img = document.querySelector('img.profile-photo');
                if (img)
                    img.src = data.profilePhoto;
            }
        }
        catch (err) {
            console.error('Failed to load theme.json', err);
        }
    });
}
if (typeof window !== 'undefined') {
    window.initTheme = initTheme;
    window.loadThemeFromFile = loadThemeFromFile;
}
