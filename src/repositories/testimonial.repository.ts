import { BaseRepository } from './base.repository';
import { getWibDate } from '@/lib/prisma';

export class TestimonialRepository extends BaseRepository {
  async getFeaturedTestimonials() {
    return this.db.testimonial.findMany({
      where: { isFeatured: true, deletedAt: null },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        reviewerName: true,
        reviewerRole: true,
        content: true,
        rating: true,
        displayOrder: true,
      },
    });
  }

  async createTestimonial(data: { reviewerName: string; reviewerRole?: string; content: string; rating?: number }) {
    const wibNow = getWibDate();
    return this.db.testimonial.create({
      data: {
        reviewerName: data.reviewerName,
        reviewerRole: data.reviewerRole || 'Pengunjung Website',
        content: data.content,
        rating: data.rating || 5,
        isFeatured: true,
        createdAt: wibNow,
        updatedAt: wibNow,
      },
    });
  }
}
