import { describe, it, expect, vi, beforeEach } from 'vitest';

const searchMock = vi.fn();
const createMock = vi.fn();

class FakeSquareError extends Error {
  statusCode: number;
  body: unknown;
  constructor(opts: { statusCode: number; message: string; body?: unknown }) {
    super(opts.message);
    this.statusCode = opts.statusCode;
    this.body = opts.body;
    Object.setPrototypeOf(this, FakeSquareError.prototype);
  }
}

vi.mock('@/lib/square', () => ({
  square: {
    customers: {
      search: searchMock,
      create: createMock,
    },
  },
  SquareError: FakeSquareError,
}));

beforeEach(() => {
  searchMock.mockReset();
  createMock.mockReset();
  vi.resetModules();
});

const fd = (email: string | null) => {
  const f = new FormData();
  if (email !== null) f.append('email', email);
  return f;
};

describe('subscribeEmail', () => {
  it('creates new customer when search returns empty array', async () => {
    searchMock.mockResolvedValue({ customers: [] });
    createMock.mockResolvedValue({});
    const { subscribeEmail } = await import('@/app/actions/subscribe');

    const result = await subscribeEmail({}, fd('jane@example.com'));

    expect(result.success).toBe(true);
    expect(result.message).toBe("You're on the list.");
    expect(searchMock).toHaveBeenCalledTimes(1);
    expect(searchMock).toHaveBeenCalledWith({
      query: { filter: { emailAddress: { exact: 'jane@example.com' } } },
      limit: 1,
    });
    expect(createMock).toHaveBeenCalledTimes(1);
    const call = createMock.mock.calls[0][0];
    expect(call.emailAddress).toBe('jane@example.com');
    expect(call.referenceId).toBe('web-lead-behind-the-glow');
    expect(typeof call.idempotencyKey).toBe('string');
    expect(call.idempotencyKey.length).toBeGreaterThan(20);
  });

  it('treats missing customers key as zero matches and creates', async () => {
    searchMock.mockResolvedValue({});
    createMock.mockResolvedValue({});
    const { subscribeEmail } = await import('@/app/actions/subscribe');

    const result = await subscribeEmail({}, fd('jane@example.com'));

    expect(result.success).toBe(true);
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it('silent dedup when customer exists (no create call)', async () => {
    searchMock.mockResolvedValue({ customers: [{ id: 'cust_abc' }] });
    const { subscribeEmail } = await import('@/app/actions/subscribe');

    const result = await subscribeEmail({}, fd('jane@example.com'));

    expect(result).toEqual({ success: true, message: "You're on the list." });
    expect(createMock).not.toHaveBeenCalled();
  });

  it('rejects null email without calling SDK', async () => {
    const { subscribeEmail } = await import('@/app/actions/subscribe');

    const result = await subscribeEmail({}, fd(null));

    expect(result.success).toBe(false);
    expect(result.error).toBe('Please enter a valid email address.');
    expect(searchMock).not.toHaveBeenCalled();
    expect(createMock).not.toHaveBeenCalled();
  });

  it('rejects invalid email format without calling SDK', async () => {
    const { subscribeEmail } = await import('@/app/actions/subscribe');

    const result = await subscribeEmail({}, fd('not-an-email'));

    expect(result.success).toBe(false);
    expect(result.error).toBe('Please enter a valid email address.');
    expect(searchMock).not.toHaveBeenCalled();
    expect(createMock).not.toHaveBeenCalled();
  });

  it('uses a fresh idempotencyKey on each submission', async () => {
    searchMock.mockResolvedValue({ customers: [] });
    createMock.mockResolvedValue({});
    const { subscribeEmail } = await import('@/app/actions/subscribe');

    await subscribeEmail({}, fd('a@example.com'));
    await subscribeEmail({}, fd('b@example.com'));

    const k1 = createMock.mock.calls[0][0].idempotencyKey;
    const k2 = createMock.mock.calls[1][0].idempotencyKey;
    expect(k1).not.toBe(k2);
  });

  it('handles SquareError on search without leaking body', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    searchMock.mockRejectedValue(
      new FakeSquareError({
        statusCode: 401,
        message: 'Unauthorized',
        body: { request_id: 'leaky', error: 'token bad' },
      }),
    );
    const { subscribeEmail } = await import('@/app/actions/subscribe');

    const result = await subscribeEmail({}, fd('jane@example.com'));

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      "We couldn't save your email right now. Please try again in a moment.",
    );
    expect(errSpy).toHaveBeenCalledWith(
      '[subscribeEmail] SquareError',
      expect.objectContaining({ status: 401, message: 'Unauthorized' }),
    );
    const logged = JSON.stringify(errSpy.mock.calls);
    expect(logged).not.toContain('leaky');
    expect(logged).not.toContain('token bad');
    errSpy.mockRestore();
  });

  it('handles SquareError on create the same way', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    searchMock.mockResolvedValue({ customers: [] });
    createMock.mockRejectedValue(
      new FakeSquareError({
        statusCode: 500,
        message: 'Internal Server Error',
        body: { request_id: 'internal-leak' },
      }),
    );
    const { subscribeEmail } = await import('@/app/actions/subscribe');

    const result = await subscribeEmail({}, fd('jane@example.com'));

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      "We couldn't save your email right now. Please try again in a moment.",
    );
    expect(errSpy).toHaveBeenCalledWith(
      '[subscribeEmail] SquareError',
      expect.objectContaining({ status: 500, message: 'Internal Server Error' }),
    );
    const logged = JSON.stringify(errSpy.mock.calls);
    expect(logged).not.toContain('internal-leak');
    errSpy.mockRestore();
  });

  it('handles unknown (non-Square) errors with Unknown error tag', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    searchMock.mockRejectedValue(new Error('network oops'));
    const { subscribeEmail } = await import('@/app/actions/subscribe');

    const result = await subscribeEmail({}, fd('jane@example.com'));

    expect(result.success).toBe(false);
    expect(errSpy).toHaveBeenCalledWith(
      '[subscribeEmail] Unknown error',
      expect.any(Error),
    );
    errSpy.mockRestore();
  });

  it('does not log the submitted email on error (PII hygiene)', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    searchMock.mockRejectedValue(
      new FakeSquareError({ statusCode: 500, message: 'boom' }),
    );
    const { subscribeEmail } = await import('@/app/actions/subscribe');

    await subscribeEmail({}, fd('secret-pii@example.com'));

    const logged = JSON.stringify(errSpy.mock.calls);
    expect(logged).not.toContain('secret-pii@example.com');
    errSpy.mockRestore();
  });

  it('locks the referenceId tag value to web-lead-behind-the-glow', async () => {
    searchMock.mockResolvedValue({ customers: [] });
    createMock.mockResolvedValue({});
    const { subscribeEmail } = await import('@/app/actions/subscribe');

    await subscribeEmail({}, fd('a@example.com'));

    expect(createMock.mock.calls[0][0].referenceId).toBe(
      'web-lead-behind-the-glow',
    );
  });
});
