/**
 * Test environment setup for Vitest + React Testing Library.
 *
 * Imports matchers from @testing-library/jest-dom and registers a global
 * afterEach hook (from Vitest) that invokes cleanup() to unmount rendered
 * components and remove DOM artifacts after every test, preventing test
 * cross-contamination and memory leaks.
 *
 * Also mocks console methods globally to reduce noise in test output.
 *
 * @file Global test setup: enable jest-dom matchers and ensure automatic cleanup
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// Suppress console output in tests unless debugging
beforeAll(() => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
    cleanup();
});
