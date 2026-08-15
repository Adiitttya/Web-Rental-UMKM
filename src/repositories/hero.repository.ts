import { BaseRepository } from './base.repository';

export class HeroRepository extends BaseRepository {
  async getPrimaryHero() {
    return this.db.hero.findFirst({
      where: { isPrimary: true },
      include: {
        bgMedia: true,
        logoMedia: true,
        decorations: {
          include: {
            media: true,
          },
        },
      },
    });
  }
}
