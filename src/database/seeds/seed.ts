import AppDataSource from '../data-source';
import { seedRoles } from './role.seed';

async function runSeed() {
  try {
    console.log('🌱 Starting seeding Role...');

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    await seedRoles(AppDataSource);

    console.log('✅ Seeding completed!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}
void runSeed();
