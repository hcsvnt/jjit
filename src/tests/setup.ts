/**
 * Test environment setup for Vitest + React Testing Library.
 *
 * Imports matchers from @testing-library/jest-dom and registers a global
 * afterEach hook (from Vitest) that invokes cleanup() to unmount rendered
 * components and remove DOM artifacts after every test, preventing test
 * cross-contamination and memory leaks.
 *
 * @file Global test setup: enable jest-dom matchers and ensure automatic cleanup
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
    cleanup();
});
