import { prisma } from '../lib/prisma';

export abstract class BaseRepository {
  protected db: typeof prisma;

  constructor() {
    this.db = prisma;
  }
}
