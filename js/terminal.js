/**
 * Created by yousef on 6/14/2025 at 3:02 PM
 * Description: terminal
 */
// Typing effect in terminal
const typedTextEl = document.getElementById("typed-text");
const aboutText = ` As a Development Team Lead with over 7 years of experience, I specialize in backend technologies, primarily PHP. My expertise lies in building robust web applications, integrating third-party systems, and architecting RESTful APIs.`;
let index = 0;
const delay = 30;

function typeText() {
    if (index < aboutText.length) {
        typedTextEl.textContent += aboutText.charAt(index++);
        setTimeout(typeText, delay);
    }
}

window.addEventListener('DOMContentLoaded', typeText);
