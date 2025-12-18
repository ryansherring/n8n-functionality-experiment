import { BaseNode } from '../../core/classes/BaseNode';
import type { Email, ReceiveEmailInput, ReceiveEmailOutput } from './ReceiveEmail.types';
import { isEmail } from './ReceiveEmail.types';

export class ReceiveEmailNode extends BaseNode<ReceiveEmailInput, ReceiveEmailOutput> {
  public readonly type = 'receiveEmail';

  public executeNode(input: ReceiveEmailInput): ReceiveEmailOutput {
    const existing = input.email;

    const email: Email = isEmail(existing)
      ? existing
      : { from: 'unknown', subject: '', body: '' };

    return {
      output0: {
        ...input,
        email,
      },
    };
  }
}
