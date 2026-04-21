'use server';

import type { FormState } from './types';

export async function subscribeEmail(
  _prev: FormState,
  _formData: FormData,
): Promise<FormState> {
  // Intentional placeholder. Implemented in Plan 03 (LEAD-01..04).
  return {
    success: false,
    error: 'subscribeEmail is not yet implemented.',
  };
}
