import { DataSource } from 'typeorm';
import { Role } from '../../modules/role/entities/role.entity';

export const seedRoles = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role);

  const roles = [{ name: 'ADMIN' }, { name: 'USER' }, { name: 'MANAGER' }];

  for (const r of roles) {
    const existingRole = await roleRepository.findOneBy({ name: r.name });

    if (!existingRole) {
      const newRole = roleRepository.create(r);
      await roleRepository.save(newRole);
      console.log(`✅ Seeded role: ${r.name}`);
    } else {
      console.log(`ℹ️ Role ${r.name} already exists, skipping...`);
    }
  }
};
