import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

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
