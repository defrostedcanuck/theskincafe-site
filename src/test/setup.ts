import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

<<<<<<< HEAD
// jsdom does not implement IntersectionObserver, which ScrollReveal relies on.
// Provide a minimal stub that never fires (children stay in the initial
// "opacity-0" state but are still present in the DOM for assertions).
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
    root = null;
    rootMargin = '';
    thresholds: ReadonlyArray<number> = [];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).IntersectionObserver = MockIntersectionObserver;
}

=======
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

>>>>>>> worktree-agent-accbc96b
afterEach(() => {
  cleanup();
});
