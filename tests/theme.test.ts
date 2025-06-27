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

import { setTheme, loadTheme } from '../ts/main';

describe('setTheme', () => {
  it('applies dark theme', () => {
    document.body.className = '';
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    setTheme(true, toggle);
    expect(document.body.classList.contains('dark')).toBe(true);
    expect(toggle.checked).toBe(true);
  });

  it('loads theme colors', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      json: async () => ({ 'bg-light': '#abc' })
    });
    await loadTheme();
    expect(document.documentElement.style.getPropertyValue('--bg-light')).toBe('#abc');
  });
});
