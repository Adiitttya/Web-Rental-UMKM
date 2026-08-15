import { BaseRepository } from './base.repository';

export class SystemSettingRepository extends BaseRepository {
  async getAllPublicSettings() {
    return this.db.systemSetting.findMany({
      where: { isPublic: true },
    });
  }
}
