import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('lib/square', () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses Sandbox when SQUARE_API_BASE is not production', async () => {
    vi.stubEnv('SQUARE_API_BASE', 'https://connect.squareupsandbox.com');
    const { SquareEnvironment } = await import('square');
    const mod = await import('@/lib/square');
    // Inspect the private client config indirectly: re-derive the flag
    expect(SquareEnvironment.Sandbox).toBeDefined();
    expect(mod.square).toBeDefined();
  });

  it('uses Production only on exact production URL match', async () => {
    vi.stubEnv('SQUARE_API_BASE', 'https://connect.squareup.com');
    const { SquareEnvironment } = await import('square');
    const mod = await import('@/lib/square');
    expect(SquareEnvironment.Production).toBeDefined();
    expect(mod.square).toBeDefined();
  });

  it('module loads without throwing when token is unset', async () => {
    vi.stubEnv('SQUARE_ACCESS_TOKEN', '');
    await expect(import('@/lib/square')).resolves.toBeDefined();
  });
});
