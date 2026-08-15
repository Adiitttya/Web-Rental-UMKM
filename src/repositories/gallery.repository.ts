import { BaseRepository } from './base.repository';

export class GalleryRepository extends BaseRepository {
  async getGalleryPhotos() {
    return this.db.galleryPhoto.findMany({
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        caption: true,
        displayOrder: true,
        media: {
          select: {
            url: true,
            altText: true,
          },
        },
      },
    });
  }
}
