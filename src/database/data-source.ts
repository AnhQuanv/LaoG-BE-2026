import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { Role } from '../modules/role/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  entities: [Role, User],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
