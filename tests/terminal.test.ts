import { setAboutText } from '../ts/terminal';

jest.useFakeTimers();

test('setAboutText types text', () => {
  document.body.innerHTML = '<span id="typed-text"></span>';
  setAboutText('abc');
  jest.runAllTimers();
  expect((document.getElementById('typed-text') as HTMLElement).textContent).toBe('abc');
});
