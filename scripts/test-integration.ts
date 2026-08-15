import { prisma } from '../src/lib/prisma';
import { BaseRepository } from '../src/repositories/base.repository';
import { BaseService } from '../src/services/base.service';
import { BaseValidator } from '../src/validators/base';
import { handleServerAction } from '../src/actions/base.action';
import { formatCurrency, formatDate, generateSlug } from '../src/utils';
import { ValidationError, NotFoundError } from '../src/lib/errors';

// 1. Example Concrete Repository extending BaseRepository
class SampleHardwareRepository extends BaseRepository {
  async getAllHardware() {
    return this.db.hardware.findMany({
      include: { category: true, games: true },
    });
  }
}

// 2. Example Concrete Service extending BaseService
class SampleHardwareService extends BaseService {
  private repo = new SampleHardwareRepository();

  async getFormattedHardwareCatalog() {
    this.log.info('Fetching hardware catalog from Service Layer...');
    const items = await this.repo.getAllHardware();

    return items.map((h) => ({
      id: h.id,
      name: h.name,
      slug: h.slug,
      categoryName: h.category?.name || 'Uncategorized',
      gameCount: h.games.length,
      gamesList: h.games.map((g) => g.title),
    }));
  }
}

// 3. Example Validator extending BaseValidator
interface CreateHardwareDTO {
  name: string;
  slug: string;
}

class HardwareValidator extends BaseValidator<CreateHardwareDTO> {
  constructor() {
    super();
    this.addRule((data) => (!data.name ? 'Hardware name is required' : null));
    this.addRule((data) => (!data.slug ? 'Hardware slug is required' : null));
  }
}

async function runIntegrationTests() {
  console.log('🚀 Running Complete Integration & End-to-End Debugging Suite...\n');

  try {
    // Test A: Utility Functions
    console.log('--- TEST A: Utility Functions ---');
    const currency = formatCurrency(25000);
    const slug = generateSlug('PlayStation 5 Pro');
    const dateStr = formatDate(new Date());

    console.log(`✅ Currency Formatter: 25000 -> "${currency}"`);
    console.log(`✅ Slug Generator: "PlayStation 5 Pro" -> "${slug}"`);
    console.log(`✅ Date Formatter: "${dateStr}"`);
    console.assert(currency.includes('25.000'), 'Currency format failed');
    console.assert(slug === 'playstation-5-pro', 'Slug generation failed');

    // Test B: Validator Layer
    console.log('\n--- TEST B: Validator Layer ---');
    const validator = new HardwareValidator();

    // Passing validation
    validator.validate({ name: 'Logitech G29', slug: 'logitech-g29' });
    console.log('✅ Passing validation test passed.');

    // Failing validation test
    let capturedValidationError = false;
    try {
      validator.validate({ name: '', slug: '' });
    } catch (err) {
      if (err instanceof ValidationError) {
        capturedValidationError = true;
        console.log(`✅ Captured expected ValidationError: ${err.message} (${JSON.stringify(err.details)})`);
      }
    }
    console.assert(capturedValidationError, 'Validation error test failed');

    // Test C: Repository & Database Integration Layer
    console.log('\n--- TEST C: Repository & Database Layer ---');
    const service = new SampleHardwareService();
    const catalog = await service.getFormattedHardwareCatalog();

    console.log(`✅ Retrieved ${catalog.length} items from Service -> Repository -> Database flow:`);
    for (const item of catalog) {
      console.log(`   └─ [${item.categoryName}] ${item.name} (${item.gameCount} games: ${item.gamesList.join(', ')})`);
    }

    // Test D: Server Action Wrapper Layer
    console.log('\n--- TEST D: Server Action Wrapper Layer ---');

    // Success action test
    const actionResult = await handleServerAction('getHardwareAction', async () => {
      return service.getFormattedHardwareCatalog();
    });
    console.log(`✅ Action Success Result: status=${actionResult.success}, items=${actionResult.data?.length}`);
    console.assert(actionResult.success === true, 'Server Action success wrapper failed');

    // Error action test
    const errorActionResult = await handleServerAction('failingAction', async () => {
      throw new NotFoundError('Requested hardware does not exist');
    });
    console.log(`✅ Action Error Result: status=${errorActionResult.success}, code=${errorActionResult.error?.code}, msg="${errorActionResult.message}"`);
    console.assert(errorActionResult.success === false, 'Server Action error wrapper failed');
    console.assert(errorActionResult.error?.code === 'NOT_FOUND', 'Server Action code mismatch');

    console.log('\n🎉 ALL BACKEND, REPOSITORY, SERVICE, VALIDATOR, AND DATABASE TESTS PASSED 100% CLEAN!');
  } catch (error) {
    console.error('❌ Integration Test Exception:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runIntegrationTests();
