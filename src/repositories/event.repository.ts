import { BaseRepository } from './base.repository';

export class EventRepository extends BaseRepository {
  async getEvents() {
    return this.db.event.findMany({
      where: { deletedAt: null },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        startDate: true,
        endDate: true,
        eventDate: true,
        linkUrl: true,
        isFeatured: true,
        displayOrder: true,
        posterMedia: {
          select: {
            url: true,
          },
        },
      },
    });
  }
}
