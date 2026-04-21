import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Team from '@/app/components/Team';

/**
 * COMM-02 — Team section surfaces years-in-industry prominently.
 *
 * These tests lock the class contract for the experience "pill" so a future
 * refactor that quietly drops the champagne-accent treatment fails loudly.
 *
 * The `expectedExperiences` list is the source of truth for the data that
 * ships to production — mutating it without updating the Team.tsx data array
 * (or vice versa) breaks the suite intentionally.
 */
const expectedExperiences = [
  '16 years as an aesthetician',
  'Nearly 13 years in aesthetics',
  'Career aesthetician',
  'Medical background',
  'Licensed aesthetician',
  '8 years as a lash artist',
  'Since 2022',
  'Since 2003',
];

const REQUIRED_PILL_CLASSES = [
  'inline-flex',
  'bg-champagne/10',
  'border',
  'text-espresso',
  'font-semibold',
];

describe('Team', () => {
  it('renders exactly 8 team-member headings', () => {
    render(<Team />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(8);
  });

  it('renders every expected experience string at least once', () => {
    render(<Team />);
    for (const exp of expectedExperiences) {
      expect(screen.getAllByText(exp).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders each experience inside a champagne-accent pill (8 total)', () => {
    const { container } = render(<Team />);
    const spans = Array.from(container.querySelectorAll('span'));
    const pills = spans.filter((span) => {
      const cls = span.className;
      return REQUIRED_PILL_CLASSES.every((req) => cls.includes(req));
    });
    expect(pills).toHaveLength(8);
    // Every pill's text content must be one of the known experience strings,
    // verbatim — no suffix / prefix injection.
    for (const pill of pills) {
      expect(expectedExperiences).toContain(pill.textContent?.trim());
    }
  });

  it('does not inject a phantom "years" suffix onto free-form experience strings', () => {
    const { container } = render(<Team />);
    const text = container.textContent ?? '';
    // Positive assertions: free-form strings present verbatim
    expect(text).toContain('Career aesthetician');
    expect(text).toContain('Since 2003');
    expect(text).toContain('Medical background');
    expect(text).toContain('Licensed aesthetician');
    // Negative assertions: no suffix concatenation
    expect(text).not.toContain('Career aesthetician years');
    expect(text).not.toContain('Since 2003 years');
    expect(text).not.toContain('Medical background years');
    expect(text).not.toContain('Licensed aesthetician years');
  });

  it('keeps the Booked Full badge for Tasha Scott (acceptingClients: false)', () => {
    render(<Team />);
    expect(screen.getByText(/booked full/i)).toBeInTheDocument();
  });
});
