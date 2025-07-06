Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    media: ''
  }))
});

import { setTheme } from '../ts/theme';

describe('setTheme', () => {
  it('applies dark theme', () => {
    document.body.className = '';
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    setTheme(true, toggle);
    expect(document.body.classList.contains('dark')).toBe(true);
    expect(toggle.checked).toBe(true);
  });
});
