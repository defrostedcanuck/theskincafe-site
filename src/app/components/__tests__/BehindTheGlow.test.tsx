import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const actionMock = vi.fn();
vi.mock('@/app/actions/subscribe', () => ({
  subscribeEmail: (prev: unknown, fd: FormData) => actionMock(prev, fd),
}));

import BehindTheGlow from '@/app/components/BehindTheGlow';

describe('BehindTheGlow', () => {
  beforeEach(() => {
    actionMock.mockReset();
  });

  it('renders the "Behind the Glow" heading with a "Coming Soon" eyebrow', () => {
    render(<BehindTheGlow />);
    expect(
      screen.getByRole('heading', { name: /behind the glow/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });

  it('renders an accessible email input with correct attributes', () => {
    render(<BehindTheGlow />);
    const input = screen.getByLabelText(/email address/i) as HTMLInputElement;
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('autoComplete', 'email');
    expect(input).toBeRequired();
  });

  it('exposes an anchorable section id ("behind-the-glow") for navbar linking', () => {
    const { container } = render(<BehindTheGlow />);
    expect(container.querySelector('#behind-the-glow')).toBeInTheDocument();
  });

  it('renders a submit button with default "Notify Me" copy', () => {
    render(<BehindTheGlow />);
    const button = screen.getByRole('button', { name: /notify me/i });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('invokes subscribeEmail with FormData containing the email on submit', async () => {
    actionMock.mockResolvedValue({
      success: true,
      message: "You're on the list.",
    });
    const user = userEvent.setup();
    render(<BehindTheGlow />);

    await user.type(
      screen.getByLabelText(/email address/i),
      'jane@example.com',
    );
    await user.click(screen.getByRole('button', { name: /notify me/i }));

    expect(actionMock).toHaveBeenCalled();
    // Second arg is the FormData payload
    const fdArg = actionMock.mock.calls[0][1] as FormData;
    expect(fdArg.get('email')).toBe('jane@example.com');
  });
});
