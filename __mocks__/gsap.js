// Mock GSAP for testing
const gsapMock = {
  from: jest.fn(),
  to: jest.fn(),
  registerPlugin: jest.fn(),
  utils: {
    toArray: jest.fn(() => [])
  }
};

const ScrollTriggerMock = {
  create: jest.fn(),
  refresh: jest.fn()
};

module.exports = {
  gsap: gsapMock,
  ScrollTrigger: ScrollTriggerMock
};
