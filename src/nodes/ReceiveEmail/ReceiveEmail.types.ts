import type { JsonObject } from '../../core/types/Json';
import type { NodeOutput } from '../../core/types/Node';

export type Email = {
  from: string;
  subject: string;
  body: string;
};

export type ReceiveEmailInput = JsonObject & {
  email?: unknown;
};

export type ReceiveEmailOutput = NodeOutput & {
  output0: JsonObject & { email: Email };
};

export function isEmail(value: unknown): value is Email {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return typeof v.from === 'string' && typeof v.subject === 'string' && typeof v.body === 'string';
}
