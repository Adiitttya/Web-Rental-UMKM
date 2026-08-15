import { BaseRepository } from './base.repository';

export class PricingRepository extends BaseRepository {
  async getPricingCatalog() {
    return this.db.pricingCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        items: {
          where: { deletedAt: null },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }
}
