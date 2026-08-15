import { ValidationError } from '../lib/errors';

export type ValidatorRule<T> = (data: T) => string | null;

export class BaseValidator<T> {
  private rules: ValidatorRule<T>[] = [];

  addRule(rule: ValidatorRule<T>): this {
    this.rules.push(rule);
    return this;
  }

  validate(data: T): void {
    const errors: string[] = [];

    for (const rule of this.rules) {
      const errorMsg = rule(data);
      if (errorMsg) {
        errors.push(errorMsg);
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }
  }
}
