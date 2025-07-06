/**
 * Created by yousef on 6/14/2025 at 3:02 PM
 * Description: main
 */

export function initStarButton(): void {
    const countEl = document.getElementById('star-count');
    if (!countEl) return;
    fetch('https://api.github.com/repos/saedyousef/saedyousef.com')
        .then(res => res.json())
        .then(data => {
            if (data && typeof data.stargazers_count === 'number') {
                countEl.textContent = data.stargazers_count.toString();
            }
        })
        .catch(() => {
            countEl.textContent = '';
        });
}

let cursorSpinner: HTMLElement | null = null;

export function toggleCursorSpinner(active: boolean): void {
    if (!cursorSpinner) return;
    cursorSpinner.style.display = active ? 'block' : 'none';
    document.body.style.cursor = active ? 'none' : 'auto';
}

export function initMouseHighlight(): void {
    const highlight = document.createElement('div');
    highlight.id = 'mouse-highlight';
    const cursor = document.createElement('div');
    cursor.id = 'cursor-spinner';
    const inner = document.createElement('div');
    inner.className = 'cursor-spinner-inner';
    cursor.appendChild(inner);
    cursor.style.display = 'none';
    cursorSpinner = cursor;
    document.body.appendChild(highlight);
    document.body.appendChild(cursor);
    document.body.style.cursor = 'auto';
    document.addEventListener('mousemove', (e: MouseEvent) => {
        highlight.style.left = `${e.clientX}px`;
        highlight.style.top = `${e.clientY}px`;
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
}

if (typeof window !== 'undefined') {
    (window as any).initStarButton = initStarButton;
    (window as any).initMouseHighlight = initMouseHighlight;
}
