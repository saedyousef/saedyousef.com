/**
 * Created by yousef on 6/14/2025 at 3:02 PM
 * Description: terminal
 */
import { toggleCursorSpinner } from './main.js';
// Typing effect in terminal
function getTypedTextEl(): HTMLElement {
    return document.getElementById('typed-text') as HTMLElement;
}
let aboutText = '';
let index = 0;
let delay = 30;

function typeText(): void {
    const typedTextEl = getTypedTextEl();
    if (index < aboutText.length) {
        typedTextEl.textContent += aboutText.charAt(index++);
        setTimeout(typeText, delay);
    } else {
        toggleCursorSpinner(false);
    }
}

export function setAboutText(text: string): void {
    aboutText = text || '';
    index = 0;
    const typedTextEl = getTypedTextEl();
    typedTextEl.textContent = '';
    delay = aboutText.length ? 2500 / aboutText.length : 0;
    toggleCursorSpinner(true);
    typeText();
}

if (typeof window !== 'undefined') {
    (window as any).setAboutText = setAboutText;
}
