/**
 * Created by yousef on 6/14/2025 at 3:02 PM
 * Description: terminal
 */
// Typing effect in terminal
const typedTextEl = document.getElementById('typed-text');
let aboutText = '';
let index = 0;
const delay = 30;

function typeText() {
    if (index < aboutText.length) {
        typedTextEl.textContent += aboutText.charAt(index++);
        setTimeout(typeText, delay);
    }
}

window.setAboutText = function(text) {
    aboutText = text || '';
    index = 0;
    typedTextEl.textContent = '';
    typeText();
};
