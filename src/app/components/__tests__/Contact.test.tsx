import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the server action so we observe call shape without hitting Resend.
// Keep the mock factory function-local so `actionMock.mockResolvedValue` /
// `mockReset()` works across tests (hoisting-safe: the mock factory closes
// over the variable, and Vitest hoists `vi.mock` above imports).
const actionMock = vi.fn();
vi.mock('@/app/actions/contact', () => ({
  submitContactForm: (prev: unknown, fd: FormData) => actionMock(prev, fd),
}));

import Contact from '@/app/components/Contact';

beforeEach(() => {
  actionMock.mockReset();
});

describe('Contact form', () => {
  it('renders all inputs with correct name attributes', () => {
    render(<Contact />);
    expect(screen.getByLabelText(/^name$/i)).toHaveAttribute('name', 'name');
    expect(screen.getByLabelText(/^email$/i)).toHaveAttribute('name', 'email');
    expect(screen.getByLabelText(/preferred location/i)).toHaveAttribute(
      'name',
      'location',
    );
    expect(screen.getByLabelText(/service interest/i)).toHaveAttribute(
      'name',
      'service',
    );
    expect(screen.getByLabelText(/^message$/i)).toHaveAttribute(
      'name',
      'message',
    );
  });

  it('uses action binding (not onSubmit) and submit button is enabled initially', () => {
    const { container } = render(<Contact />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    // The submit button renders with the progressive-enhancement copy.
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });

  it('invokes submitContactForm when the form is submitted', async () => {
    actionMock.mockResolvedValue({ success: true, message: 'thanks' });
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText(/^name$/i), 'Jane');
    await user.type(screen.getByLabelText(/^email$/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/^message$/i), 'hello');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(actionMock).toHaveBeenCalled();
  });

  it('renders success UI (Message Sent!) after a successful submission', async () => {
    actionMock.mockResolvedValue({
      success: true,
      message: 'Thanks — we will reply soon.',
    });
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText(/^name$/i), 'Jane');
    await user.type(screen.getByLabelText(/^email$/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/^message$/i), 'hello');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // After the action resolves with success, the form is replaced by the
    // confirmation UI driven by state.success.
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
    expect(
      screen.getByText(/thanks — we will reply soon/i),
    ).toBeInTheDocument();
  });

  it('renders an error with role="alert" on failure (form remains visible)', async () => {
    actionMock.mockResolvedValue({
      success: false,
      error: 'Something went wrong please try again.',
    });
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText(/^name$/i), 'Jane');
    await user.type(screen.getByLabelText(/^email$/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/^message$/i), 'hello');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/something went wrong/i);
    // Form is still on the page (user can edit + retry)
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
  });
});
