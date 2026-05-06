import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        environmentOptions: {
            jsdom: {
                url: 'http://localhost:8096/'
            }
        },
        include: ['tests/**/*.test.ts'],
        restoreMocks: true
    }
});
