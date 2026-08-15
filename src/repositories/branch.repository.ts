import { BaseRepository } from './base.repository';

export class BranchRepository extends BaseRepository {
  async getPublishedBranches() {
    return this.db.branch.findMany({
      where: { isPublished: true, deletedAt: null },
      orderBy: { displayOrder: 'asc' },
      include: {
        coverMedia: true,
      },
    });
  }
}
