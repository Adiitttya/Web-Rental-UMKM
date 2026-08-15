'use server';

import { handleServerAction } from './base.action';
import { landingService } from '../services';

export async function getLandingPageDataAction() {
  return handleServerAction('getLandingPageData', async () => {
    return landingService.getFullLandingData();
  });
}

export async function submitFeedbackAction(name: string, comment: string) {
  return handleServerAction('submitFeedback', async () => {
    return landingService.submitFeedback(name, comment);
  });
}
