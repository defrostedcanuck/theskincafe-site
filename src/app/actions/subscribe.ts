'use server';

import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { square, SquareError } from '@/lib/square';
import type { FormState } from './types';

const subscribeSchema = z.object({ email: z.email() });

export async function subscribeEmail(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = subscribeSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  const { email } = parsed.data;

  try {
    const existing = await square.customers.search({
      query: { filter: { emailAddress: { exact: email } } },
      limit: 1,
    });

    if (existing.customers && existing.customers.length > 0) {
      // Silent success — identical shape to a fresh subscribe so an attacker
      // cannot enumerate subscribers by comparing response bodies.
      return { success: true, message: "You're on the list." };
    }

    await square.customers.create({
      idempotencyKey: randomUUID(),
      emailAddress: email,
      referenceId: 'web-lead-behind-the-glow',
    });

    return { success: true, message: "You're on the list." };
  } catch (err) {
    if (err instanceof SquareError) {
      // Log status + message only. Never the full error or its body — those
      // can echo the request payload or tokens in some Square responses.
      console.error('[subscribeEmail] SquareError', {
        status: err.statusCode,
        message: err.message,
      });
    } else {
      console.error('[subscribeEmail] Unknown error', err);
    }
    return {
      success: false,
      error:
        "We couldn't save your email right now. Please try again in a moment.",
    };
  }
}
