import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Community from '@/app/components/Community';

describe('Community', () => {
  it('renders the first testimonial (Jen Jones) as the featured quote by default', () => {
    render(<Community />);
    // Featured quote text + attribution
    expect(
      screen.getByText(/I've been going to The Skin Cafe and seeing Starr/i),
    ).toBeInTheDocument();
    // Name appears as the attribution — may also appear on the avatar's aria-label;
    // scope by the visible "Jen Jones" text element.
    const attributions = screen.getAllByText(/Jen Jones/i);
    expect(attributions.length).toBeGreaterThan(0);
  });

  it('renders exactly 9 avatar buttons — one per testimonial', () => {
    const { container } = render(<Community />);
    const avatarButtons = container.querySelectorAll(
      'button[aria-label^="Show testimonial from"]',
    );
    expect(avatarButtons.length).toBe(9);
  });

  it('renders avatar initials for at least three known names (JJ, SG, MB)', () => {
    render(<Community />);
    expect(screen.getByText('JJ')).toBeInTheDocument(); // Jen Jones
    expect(screen.getByText('SG')).toBeInTheDocument(); // Susan Garbayo
    expect(screen.getByText('MB')).toBeInTheDocument(); // Michelle B
  });

  it("swaps the featured quote when a different avatar is clicked (Abby Kaufman)", async () => {
    const user = userEvent.setup();
    render(<Community />);

    // Initial featured: Jen Jones's quote is present
    expect(
      screen.getByText(/I've been going to The Skin Cafe and seeing Starr/i),
    ).toBeInTheDocument();

    const abbyBtn = screen.getByRole('button', {
      name: /Show testimonial from Abby Kaufman/i,
    });
    await user.click(abbyBtn);

    // After click: Abby's quote is rendered
    expect(
      screen.getByText(/best facial I have ever had/i),
    ).toBeInTheDocument();
  });

  it('renders an Instagram CTA link with target=_blank + rel="noopener noreferrer" + correct href', () => {
    render(<Community />);
    const ig = screen.getByRole('link', { name: /instagram|follow/i });
    expect(ig).toHaveAttribute('href', 'https://www.instagram.com/theskincafe');
    expect(ig).toHaveAttribute('target', '_blank');
    const rel = ig.getAttribute('rel') ?? '';
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  });

  it('exposes an anchorable section id ("community")', () => {
    const { container } = render(<Community />);
    expect(container.querySelector('#community')).toBeInTheDocument();
  });

  it('every avatar button has a non-empty aria-label', () => {
    const { container } = render(<Community />);
    const avatarButtons = container.querySelectorAll(
      'button[aria-label^="Show testimonial from"]',
    );
    expect(avatarButtons.length).toBe(9);
    avatarButtons.forEach((btn) => {
      const label = btn.getAttribute('aria-label') ?? '';
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('every avatar is a real <button type="button"> (keyboard-activatable, not a div)', () => {
    const { container } = render(<Community />);
    const avatarButtons = container.querySelectorAll(
      'button[aria-label^="Show testimonial from"]',
    );
    avatarButtons.forEach((btn) => {
      expect(btn.tagName).toBe('BUTTON');
      expect(btn.getAttribute('type')).toBe('button');
    });
  });
});
