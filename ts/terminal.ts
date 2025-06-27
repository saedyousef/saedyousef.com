/**
 * Created by yousef on 6/14/2025 at 3:02 PM
 * Description: terminal
 */
// Typing effect in terminal
function getTypedTextEl(): HTMLElement {
    return document.getElementById('typed-text') as HTMLElement;
}
let aboutText = '';
let index = 0;
const delay = 30;

function typeText(): void {
    const typedTextEl = getTypedTextEl();
    if (index < aboutText.length) {
        typedTextEl.textContent += aboutText.charAt(index++);
        setTimeout(typeText, delay);
    }
}

export function setAboutText(text: string): void {
    aboutText = text || '';
    index = 0;
    const typedTextEl = getTypedTextEl();
    typedTextEl.textContent = '';
    typeText();
}

if (typeof window !== 'undefined') {
    (window as any).setAboutText = setAboutText;
}
