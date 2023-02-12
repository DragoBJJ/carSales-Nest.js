import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isTest = process.env.NODE_ENV === 'test';
    console.log('isTest', isTest);
    const dbConfig: Partial<TypeOrmModuleOptions> = {
      type: 'sqlite',
      synchronize: false,
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
    };
    if (isTest) {
      Object.assign(dbConfig, {
        synchronize: true,
        migrationsRun: true,
        migrations: ['src/migrations/*.ts'],
      });
    }
    return dbConfig;
  }
}
