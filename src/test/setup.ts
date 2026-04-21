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

// jsdom does not implement IntersectionObserver. Components like
// `ScrollReveal` instantiate it on mount, so every component test that
// renders anything wrapped in ScrollReveal would throw without this stub.
// The stub is a no-op — tests that care about visibility-driven behavior
// can override globalThis.IntersectionObserver per-test. For the majority
// case (render + interaction tests) this is sufficient.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = '';
  thresholds = [];
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  // Cast via unknown to satisfy the lib DOM type without importing it here.
  globalThis.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

// Silence `vi` unused-import warning when this file is type-checked standalone.
void vi;
