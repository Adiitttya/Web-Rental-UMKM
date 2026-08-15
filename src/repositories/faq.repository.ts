import { BaseRepository } from './base.repository';

export class FaqRepository extends BaseRepository {
  async getPublishedFaqs() {
    return this.db.faqItem.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        category: true,
      },
    });
  }
}
