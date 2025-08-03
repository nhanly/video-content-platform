import { BaseValueObject } from './base.vo';

export class Email extends BaseValueObject<string> {
  constructor(value: string) {
    super(value);
    if (!Email.isValid(value)) {
      throw new Error('Invalid email address');
    }
  }

  getValue(): string {
    return this.props;
  }

  static isValid(email: string): boolean {
    // Implement email validation logic here (e.g., using a regex)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
