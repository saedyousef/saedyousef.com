module.exports = {
  "preset": "ts-jest",
  "testEnvironment": "jsdom",
  "testMatch": [
    "**/tests/**/*.test.ts"
  ],
  "moduleNameMapper": {
    "^three$": "<rootDir>/node_modules/three/build/three.module.js",
    "^gsap$": "<rootDir>/__mocks__/gsap.js",
    "^gsap/ScrollTrigger$": "<rootDir>/__mocks__/gsap.js"
  },
  "transform": {
    "^.+\\.ts$": [
      "ts-jest",
      {
        "tsconfig": {
          "esModuleInterop": true,
          "allowSyntheticDefaultImports": true
        }
      }
    ]
  },
  "transformIgnorePatterns": [
    "node_modules/(?!(gsap)/)"
  ]
};
