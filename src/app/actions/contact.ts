'use server';

import type { FormState } from './types';

export async function submitContactForm(
  _prev: FormState,
  _formData: FormData,
): Promise<FormState> {
  // Intentional placeholder. Implemented in Plan 02 (LEAD-05).
  return {
    success: false,
    error: 'submitContactForm is not yet implemented.',
  };
}
