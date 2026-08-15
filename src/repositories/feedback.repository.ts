import { BaseRepository } from './base.repository';
import { getWibDate } from '@/lib/prisma';

export class FeedbackRepository extends BaseRepository {
  async createFeedback(data: { name: string; email?: string; phone?: string; comment: string }) {
    const wibNow = getWibDate();
    const created = await this.db.feedback.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        comment: data.comment,
        status: 'pending',
        createdAt: wibNow,
        updatedAt: wibNow,
      },
    });
    console.log('✅ [FeedbackRepository] Successfully saved feedback to DB with WIB timestamp:', created.id, created.name);
    return created;
  }

  async getAllFeedback() {
    return this.db.feedback.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }
}
