import { BaseValidator } from './base';

export interface FeedbackInput {
  name: string;
  comment: string;
}

export class FeedbackValidator extends BaseValidator<FeedbackInput> {
  constructor() {
    super();

    this.addRule((data) => {
      if (!data.name || data.name.trim().length === 0) {
        return 'Nama wajib diisi.';
      }
      if (data.name.trim().length > 100) {
        return 'Nama maksimal 100 karakter.';
      }
      return null;
    });

    this.addRule((data) => {
      if (!data.comment || data.comment.trim().length === 0) {
        return 'Feedback / Komentar wajib diisi.';
      }
      if (data.comment.trim().length > 1000) {
        return 'Komentar maksimal 1000 karakter.';
      }
      return null;
    });
  }
}

export const feedbackValidator = new FeedbackValidator();
