import { BaseService } from './base.service';
import {
  HeroRepository,
  GameRepository,
  PricingRepository,
  EventRepository,
  GalleryRepository,
  BranchRepository,
  FaqRepository,
  TestimonialRepository,
  SystemSettingRepository,
  CmsSectionRepository,
  FeedbackRepository,
} from '../repositories';

export class LandingService extends BaseService {
  private heroRepo = new HeroRepository();
  private gameRepo = new GameRepository();
  private pricingRepo = new PricingRepository();
  private eventRepo = new EventRepository();
  private galleryRepo = new GalleryRepository();
  private branchRepo = new BranchRepository();
  private faqRepo = new FaqRepository();
  private testimonialRepo = new TestimonialRepository();
  private systemSettingRepo = new SystemSettingRepository();
  private cmsSectionRepo = new CmsSectionRepository();
  private feedbackRepo = new FeedbackRepository();

  async getFullLandingData() {
    const [
      cmsSections,
      hero,
      gameCatalog,
      pricingCatalog,
      events,
      galleryPhotos,
      branches,
      faqs,
      testimonials,
      systemSettings,
    ] = await Promise.all([
      this.cmsSectionRepo.getCmsSections(),
      this.heroRepo.getPrimaryHero(),
      this.gameRepo.getGameCatalog(),
      this.pricingRepo.getPricingCatalog(),
      this.eventRepo.getEvents(),
      this.galleryRepo.getGalleryPhotos(),
      this.branchRepo.getPublishedBranches(),
      this.faqRepo.getPublishedFaqs(),
      this.testimonialRepo.getFeaturedTestimonials(),
      this.systemSettingRepo.getAllPublicSettings(),
    ]);

    return {
      cmsSections,
      hero,
      gameCatalog,
      pricingCatalog,
      events,
      galleryPhotos,
      branches,
      faqs,
      testimonials,
      systemSettings,
    };
  }

  async submitFeedback(name: string, comment: string) {
    this.log.info(`Submitting user feedback from [${name}] to feedback database`);
    return this.feedbackRepo.createFeedback({
      name,
      comment,
    });
  }
}

export const landingService = new LandingService();
