import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Prisma keys:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
}

main();
