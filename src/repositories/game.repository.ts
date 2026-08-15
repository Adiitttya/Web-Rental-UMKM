import { BaseRepository } from './base.repository';

export class GameRepository extends BaseRepository {
  async getGameCatalog() {
    return this.db.hardwareCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        displayOrder: true,
        hardwares: {
          where: { deletedAt: null },
          orderBy: { displayOrder: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            displayOrder: true,
            isAvailable: true,
            games: {
              where: { deletedAt: null },
              orderBy: { displayOrder: 'asc' },
              select: {
                id: true,
                title: true,
                slug: true,
                genre: true,
                displayOrder: true,
              },
            },
          },
        },
      },
    });
  }
}
