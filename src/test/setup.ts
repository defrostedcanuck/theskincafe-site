import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom does not implement IntersectionObserver. Components that use
// ScrollReveal (which uses it in a useEffect) crash on render without this.
// Minimal stub — tests do not rely on intersection behavior.
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '';
  thresholds: ReadonlyArray<number> = [];
}

globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

afterEach(() => {
  cleanup();
});
