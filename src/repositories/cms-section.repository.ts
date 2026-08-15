import { BaseRepository } from './base.repository';

export class CmsSectionRepository extends BaseRepository {
  async getCmsSections() {
    return this.db.cmsSection.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }
}
